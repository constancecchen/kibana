/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { EuiLink, EuiButton } from '@elastic/eui';

jest.mock('react-router-dom', () => ({ useHistory: jest.fn() }));
import { useHistory } from 'react-router-dom';

import { EuiReactRouterLink, EuiReactRouterButton } from './eui_link';

describe('EUI & React Router Component Helpers', () => {
  const historyPushMock = jest.fn();
  const historycreateHrefMock = jest.fn(({ pathname }) => `/app_search${pathname}`);
  useHistory.mockImplementation(() => ({
    push: historyPushMock,
    createHref: historycreateHrefMock,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const wrapper = shallow(<EuiReactRouterLink to="/" />);

    expect(wrapper.find(EuiLink)).toHaveLength(1);
  });

  it('renders an EuiButton', () => {
    const wrapper = shallow(<EuiReactRouterButton to="/" />)
      .find(EuiReactRouterLink)
      .dive();

    expect(wrapper.find(EuiButton)).toHaveLength(1);
  });

  it('passes down all ...rest props', () => {
    const wrapper = shallow(<EuiReactRouterLink to="/" data-test-subj="foo" disabled={true} />);
    const link = wrapper.find(EuiLink);

    expect(link.prop('disabled')).toEqual(true);
    expect(link.prop('data-test-subj')).toEqual('foo');
  });

  it('renders with the correct href and onClick props', () => {
    const wrapper = shallow(<EuiReactRouterLink to="/foo/bar" />);
    const link = wrapper.find(EuiLink);

    expect(link.prop('onClick')).toBeInstanceOf(Function);
    expect(link.prop('href')).toEqual('/app_search/foo/bar');
    expect(historycreateHrefMock).toHaveBeenCalled();
  });

  describe('onClick', () => {
    it('prevents default navigation and uses React Router history', () => {
      const wrapper = shallow(<EuiReactRouterLink to="/bar/baz" />);

      const simulatedEvent = {
        button: 0,
        target: { getAttribute: () => '_self' },
        preventDefault: jest.fn(),
      };
      wrapper.find(EuiLink).simulate('click', simulatedEvent);

      expect(simulatedEvent.preventDefault).toHaveBeenCalled();
      expect(historyPushMock).toHaveBeenCalled();
    });

    it('does not prevent default browser behavior on new tab/window clicks', () => {
      const wrapper = shallow(<EuiReactRouterLink to="/bar/baz" />);

      const simulatedEvent = {
        shiftKey: true,
        target: { getAttribute: () => '_blank' },
      };
      wrapper.find(EuiLink).simulate('click', simulatedEvent);

      expect(historyPushMock).not.toHaveBeenCalled();
    });
  });
});
