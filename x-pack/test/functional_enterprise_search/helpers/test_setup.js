/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const setup = require('./setup').setup;
const tearDown = require('./setup').tearDown;

/*
  This script tests that the setup helper is functioning by calling it directly.

  Run from the console with `node test_setup.js`
*/

setup().then(setupResponse => {
  console.log(setupResponse);
  tearDown(setupResponse).then(tearDownResponse => {
    console.log(tearDownResponse);
  });
});
