/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mockRouter, RouterMock } from 'src/core/server/http/router/router.mock';
import { savedObjectsServiceMock } from 'src/core/server/saved_objects/saved_objects_service.mock';
import { httpServerMock } from 'src/core/server/http/http_server.mocks';

import { registerTelemetryRoute } from './telemetry';

jest.mock('../../collectors/app_search/telemetry', () => ({
  incrementUICounter: jest.fn(),
}));
import { incrementUICounter } from '../../collectors/app_search/telemetry';

describe('App Search Telemetry API', () => {
  let router: RouterMock;
  const mockResponseFactory = httpServerMock.createResponseFactory();

  beforeEach(() => {
    jest.resetAllMocks();
    router = mockRouter.create();
    registerTelemetryRoute({
      router,
      getSavedObjectsService: () => savedObjectsServiceMock.create(),
    });
  });

  describe('PUT /api/app_search/telemetry', () => {
    it('increments the saved objects counter', async () => {
      const successResponse = { success: true };
      incrementUICounter.mockImplementation(jest.fn(() => successResponse));

      await callThisRoute('put', { body: { action: 'viewed', metric: 'setup_guide' } });

      expect(incrementUICounter).toHaveBeenCalledWith({
        savedObjects: expect.any(Object),
        uiAction: 'ui_viewed',
        metric: 'setup_guide',
      });
      expect(mockResponseFactory.ok).toHaveBeenCalledWith({ body: successResponse });
    });

    it('throws an error when incrementing fails', async () => {
      incrementUICounter.mockImplementation(jest.fn(() => Promise.reject()));

      await callThisRoute('put', { body: { action: 'error', metric: 'error' } });

      expect(incrementUICounter).toHaveBeenCalled();
      expect(mockResponseFactory.internalError).toHaveBeenCalled();
    });
  });

  /**
   * Test helpers
   */

  const callThisRoute = async (method, request) => {
    const [_, handler] = router[method].mock.calls[0];

    const context = {};
    await handler(context, httpServerMock.createKibanaRequest(request), mockResponseFactory);
  };
});
