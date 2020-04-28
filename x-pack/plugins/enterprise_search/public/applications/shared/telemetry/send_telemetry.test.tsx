/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { mount } from 'enzyme';

import { sendTelemetry, SendAppSearchTelemetry } from './';
import { mountWithKibanaContext } from '../../test_utils/helpers';

describe('Shared Telemetry Helpers', () => {
  describe('sendTelemetry', () => {
    it('successfully calls the server-side telemetry endpoint', () => {
      const httpMock = { put: jest.fn(() => Promise.resolve()) };

      sendTelemetry({
        http: httpMock,
        product: 'enterprise_search',
        action: 'viewed',
        metric: 'setup_guide',
      });

      expect(httpMock.put).toHaveBeenCalledWith('/api/enterprise_search/telemetry', {
        headers: { 'content-type': 'application/json' },
        body: '{"action":"viewed","metric":"setup_guide"}',
      });
    });

    it('throws an error if the telemetry endpoint fails', () => {
      const httpMock = { put: jest.fn(() => Promise.reject()) };

      expect(sendTelemetry({ http: httpMock })).rejects.toThrow('Unable to send telemetry');
    });
  });

  describe('React component helpers', () => {
    const httpMock = { put: jest.fn(() => Promise.resolve()) };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('SendAppSearchTelemetry component', () => {
      const wrapper = mountWithKibanaContext(
        <SendAppSearchTelemetry action="clicked" metric="button" />,
        { http: httpMock }
      );

      expect(httpMock.put).toHaveBeenCalledWith('/api/app_search/telemetry', {
        headers: { 'content-type': 'application/json' },
        body: '{"action":"clicked","metric":"button"}',
      });
    });
  });
});
