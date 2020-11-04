/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { MockRouter, mockRequestHandler, mockDependencies } from '../../__mocks__';

import { registerSettingsRoutes } from './settings';

describe('log settings routes', () => {
  describe('GET /api/app_search/log_settings', () => {
    let mockRouter: MockRouter;

    beforeEach(() => {
      jest.clearAllMocks();
      mockRouter = new MockRouter({ method: 'get' });

      registerSettingsRoutes({
        ...mockDependencies,
        router: mockRouter.router,
      });
    });

    it('creates a request to enterprise search', () => {
      mockRouter.callRoute({});

      expect(mockRequestHandler.createRequest).toHaveBeenCalledWith({
        path: '/as/log_settings',
        jsonTransform: expect.any(Function),
      });
    });

    describe('jsonTransform', () => {
      it('camelCases keys', () => {
        const mockResponse = {
          api: {
            enabled: true,
            disabled_at: null,
            retention_policy: { is_default: true, min_age_days: 7 },
          },
          analytics: {
            enabled: true,
            disabled_at: null,
            retention_policy: { is_default: true, min_age_days: 180 },
          },
        };

        expect(mockRequestHandler.jsonTransform(mockResponse)).toEqual({
          api: {
            enabled: true,
            disabledAt: null,
            retentionPolicy: { isDefault: true, minAgeDays: 7 },
          },
          analytics: {
            enabled: true,
            disabledAt: null,
            retentionPolicy: { isDefault: true, minAgeDays: 180 },
          },
        });
      });

      it('handles empty retention policies', () => {
        const mockResponse = {
          api: {
            enabled: false,
            disabled_at: null,
            retention_policy: null,
          },
          analytics: {
            enabled: false,
            disabled_at: null,
            retention_policy: null,
          },
        };

        const transformedResponse = mockRequestHandler.jsonTransform(mockResponse);
        expect(transformedResponse.api.retentionPolicy).toBeNull();
        expect(transformedResponse.analytics.retentionPolicy).toBeNull();
      });
    });
  });

  describe('PUT /api/app_search/log_settings', () => {
    let mockRouter: MockRouter;

    beforeEach(() => {
      jest.clearAllMocks();
      mockRouter = new MockRouter({ method: 'put', payload: 'body' });

      registerSettingsRoutes({
        ...mockDependencies,
        router: mockRouter.router,
      });
    });

    it('creates a request to enterprise search', () => {
      expect(mockRequestHandler.createRequest).toHaveBeenCalledWith({
        path: '/as/log_settings',
      });
    });

    describe('validates', () => {
      it('validates good data', () => {
        const request = {
          body: {
            analytics: { enabled: true },
            api: { enabled: true },
          },
        };
        mockRouter.shouldValidate(request);
      });

      it('rejects bad data', () => {
        const request = {
          body: {
            foo: 'bar',
          },
        };
        mockRouter.shouldThrow(request);
      });
    });
  });
});
