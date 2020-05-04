/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const http = require('http');

const makeRequest = (method, path, body) => {
  return new Promise(function(resolve, reject) {
    const APP_SEARCH_API_KEY = process.env.APP_SEARCH_API_KEY || '';
    let postData;

    if (body) {
      postData = JSON.stringify(body);
    }

    const req = http.request(
      {
        method: method,
        hostname: 'localhost',
        port: 3002,
        path: path,
        agent: false, // Create a new agent just for this one request
        headers: {
          Authorization: `Bearer ${APP_SEARCH_API_KEY}`,
          'Content-Type': 'application/json',
          ...(!!postData && { 'Content-Length': Buffer.byteLength(postData) }),
        },
      },
      res => {
        let body = [];
        res.on('data', function(chunk) {
          body.push(chunk);
        });

        res.on('end', function() {
          try {
            body = JSON.parse(Buffer.concat(body).toString());
          } catch (e) {
            reject(e);
          }

          resolve(body);
        });
      }
    );

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const createEngine = async () => {
  const engineName = `test-engine-${new Date().getTime()}`;
  return await makeRequest('POST', '/api/as/v1/engines', { name: engineName });
};

const destroyEngine = async engineName => {
  return await makeRequest('DELETE', `/api/as/v1/engines/${engineName}`);
};

const createMetaEngine = async sourceEngines => {
  const engineName = `test-meta-engine-${new Date().getTime()}`;
  return await makeRequest('POST', '/api/as/v1/engines', {
    name: engineName,
    type: 'meta',
    source_engines: sourceEngines,
  });
};

const search = async engineName => {
  return await makeRequest('POST', `/api/as/v1/engines/${engineName}/search`, { query: '' });
};

// Since the App Search API does not issue document receipts, the only way to tell whether or not documents
// are fully indexed is to poll the search endpoint.
const waitForIndexedDocs = engineName => {
  return new Promise(async function(resolve) {
    let isReady = false;
    while (!isReady) {
      const response = await search(engineName);
      if (response.results && response.results.length > 0) {
        isReady = true;
        resolve();
      }
    }
  });
};

const indexData = async engineName => {
  const docs = [
    { id: 1, name: 'doc1' },
    { id: 2, name: 'doc2' },
    { id: 3, name: 'doc2' },
  ];
  const response = await makeRequest('POST', `/api/as/v1/engines/${engineName}/documents`, docs);
  return response;
};

module.exports = {
  /**
   * Set up engines for App Search plugin tests
   */
  setup: async () => {
    const engine1 = await createEngine();
    const engine1Name = engine1.name;
    const engine1docs = await indexData(engine1Name);
    await waitForIndexedDocs(engine1Name);
    console.log(`PROGRESS: engine1 Ready`);

    const engine2 = await createEngine();
    const engine2Name = engine2.name;
    const engine2docs = await indexData(engine2Name);
    await waitForIndexedDocs(engine2Name);
    console.log(`PROGRESS: engine2 Ready`);

    const metaEngine = await createMetaEngine([engine1Name, engine2Name]);
    console.log(`PROGRESS: metaEngine Ready`);
    const metaEngineName = metaEngine.name;
    console.log(`PROGRESS: Done`);

    const response = {
      engine1Name,
      engine1docs,
      engine2Name,
      engine2docs,
      metaEngineName,
    };
    return response;
  },

  /**
   * Tear down engines that were set up for App Search tests
   */
  tearDown: async setupResponse => {
    const names = [
      setupResponse.engine1Name,
      setupResponse.engine2Name,
      setupResponse.metaEngineName,
    ];
    const responses = names.map(async name => {
      return await destroyEngine(name);
    });
    return Promise.all(responses);
  },
};
