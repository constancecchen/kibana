/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { SetAppSearchBreadcrumbs } from '../kibana_breadcrumbs';
import { mount } from 'enzyme';

jest.mock('./generate_breadcrumbs', () => ({
  appSearchBreadcrumbs: jest.fn(),
}));
import { appSearchBreadcrumbs } from './generate_breadcrumbs';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    createHref: jest.fn(),
    push: jest.fn(),
    location: {
      pathname: '/current-path',
    },
  }),
}));

import { KibanaContext } from '../..';

describe('SetAppSearchBreadcrumbs', () => {
  const setBreadcrumbs = jest.fn();
  const builtBreadcrumbs = [];
  const appSearchBreadCrumbsInnerCall = jest.fn().mockReturnValue(builtBreadcrumbs);
  const appSearchBreadCrumbsOuterCall = jest.fn().mockReturnValue(appSearchBreadCrumbsInnerCall);
  appSearchBreadcrumbs.mockImplementation(appSearchBreadCrumbsOuterCall);

  afterEach(() => {
    jest.clearAllMocks();
  });

  const render = props => {
    return mount(
      <KibanaContext.Provider
        value={{
          http: {},
          enterpriseSearchUrl: 'http://localhost:3002',
          setBreadcrumbs,
        }}
      >
        <SetAppSearchBreadcrumbs {...props} />
      </KibanaContext.Provider>
    );
  };

  describe('when isRoot is false', () => {
    const subject = () => render({ text: 'Page 1', isRoot: false });

    it('calls appSearchBreadcrumbs to build breadcrumbs, then registers them with Kibana', () => {
      subject();

      // calls appSearchBreadcrumbs to build breadcrumbs with the target page and current location
      expect(appSearchBreadCrumbsInnerCall).toHaveBeenCalledWith([
        { text: 'Page 1', path: '/current-path' },
      ]);

      // then registers them with Kibana
      expect(setBreadcrumbs).toHaveBeenCalledWith(builtBreadcrumbs);
    });
  });

  describe('when isRoot is true', () => {
    const subject = () => render({ text: 'Page 1', isRoot: true });

    it('calls appSearchBreadcrumbs to build breadcrumbs with an empty breadcrumb, then registers them with Kibana', () => {
      subject();

      // uses an empty bredcrumb
      expect(appSearchBreadCrumbsInnerCall).toHaveBeenCalledWith([]);

      // then registers them with Kibana
      expect(setBreadcrumbs).toHaveBeenCalledWith(builtBreadcrumbs);
    });
  });
});
