/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { coreMock } from 'src/core/public/mocks';
import { mountWithIntl } from 'test_utils/enzyme_helpers';
import { App } from './app';

jest.mock('../applications/app_search', () => ({
  AppSearch: () => <div>App Search Mock</div>,
}));

describe('App', () => {
  let params;
  let core;

  beforeEach(() => {
    params = coreMock.createAppMountParamters();
    core = coreMock.createStart();
  });

  describe('routing', () => {
    let route;

    beforeEach(() => {
      route = null;
    });

    const subject = () =>
      mountWithIntl(
        <MemoryRouter initialEntries={[route]}>
          <App
            core={core}
            params={params}
            config={{
              host: 'http://localhost:3002',
            }}
          />
        </MemoryRouter>
      );

    const itShouldMountAppSearch = () => {
      it('should mount AppSearch', () => {
        const AppSearch = subject().find('AppSearch');
        expect(AppSearch).toHaveLength(1);

        const props = AppSearch.props();
        expect(props.http).toBe(core.http);
        expect(props.appSearchUrl).toBe('http://localhost:3002');
        expect(props.setBreadcrumbs).toBe(core.chrome.setBreadcrumbs);
      });
    };

    const itShouldNotMountAppSearch = () => {
      it('should not mount AppSearch', () => {
        expect(subject().find('AppSearch')).toHaveLength(0);
      });
    };

    describe('when route is /', () => {
      beforeEach(() => {
        route = '/';
      });

      itShouldMountAppSearch();
    });

    describe('when route is /app_search', () => {
      beforeEach(() => {
        route = '/app_search';
      });

      itShouldMountAppSearch();
    });

    describe('when route is unknown', () => {
      beforeEach(() => {
        route = '/bogus/route';
      });

      itShouldNotMountAppSearch();
    });
  });
});
