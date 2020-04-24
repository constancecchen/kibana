/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { mount } from 'enzyme';

import { EngineOverviewHeader } from '../engine_overview_header';
import { KibanaContext } from '../../..';

describe('EngineOverviewHeader', () => {
  let enterpriseSearchUrl;

  afterEach(() => {
    enterpriseSearchUrl = undefined;
  });

  const render = () => {
    return mount(
      <KibanaContext.Provider
        value={{
          http: {},
          enterpriseSearchUrl,
          setBreadcrumbs: jest.fn(),
        }}
      >
        <EngineOverviewHeader />
      </KibanaContext.Provider>
    );
  };

  describe('when enterpriseSearchUrl is set', () => {
    let wrapper;

    beforeEach(() => {
      enterpriseSearchUrl = 'http://localhost:3002';
      wrapper = render();
    });

    describe('the Launch App Search button', () => {
      const subject = () => wrapper.find('EuiButton[data-test-subj="launch_button"]');

      it('should not be disabled', () => {
        expect(subject().props().isDisabled).toBeFalsy();
      });

      it('should use the enterpriseSearchUrl as the base path for its href', () => {
        expect(subject().props().href).toBe('http://localhost:3002/as');
      });
    });
  });

  describe('when enterpriseSearchUrl is not set', () => {
    let wrapper;

    beforeEach(() => {
      enterpriseSearchUrl = undefined;
      wrapper = render();
    });

    describe('the Launch App Search button', () => {
      const subject = () => wrapper.find('EuiButton[data-test-subj="launch_button"]');

      it('should be disabled', () => {
        expect(subject().props().isDisabled).toBe(true);
      });

      it('should not have an href', () => {
        expect(subject().props().href).toBeUndefined();
      });
    });
  });
});
