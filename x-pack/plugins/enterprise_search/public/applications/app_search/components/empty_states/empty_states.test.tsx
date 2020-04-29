/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import '../../../test_utils/mock_shallow_usecontext';

import React from 'react';
import { shallow } from 'enzyme';
import { EuiEmptyPrompt, EuiLoadingContent } from '@elastic/eui';

import { ErrorState, NoUserState, EmptyState, LoadingState } from './';

describe('ErrorState', () => {
  it('renders', () => {
    const wrapper = shallow(<ErrorState />);
    const prompt = wrapper.find(EuiEmptyPrompt);

    expect(prompt).toHaveLength(1);
    expect(prompt.prop('title')).toEqual(<h2>Cannot connect to App Search</h2>);
  });
});

describe('NoUserState', () => {
  it('renders', () => {
    const wrapper = shallow(<NoUserState />);
    const prompt = wrapper.find(EuiEmptyPrompt);

    expect(prompt).toHaveLength(1);
    expect(prompt.prop('title')).toEqual(<h2>Cannot find App Search account</h2>);
  });
});

describe('EmptyState', () => {
  it('renders', () => {
    const wrapper = shallow(<EmptyState />);
    const prompt = wrapper.find(EuiEmptyPrompt);

    expect(prompt).toHaveLength(1);
    expect(prompt.prop('title')).toEqual(<h2>There’s nothing here yet</h2>);
  });
});

describe('LoadingState', () => {
  it('renders', () => {
    const wrapper = shallow(<LoadingState />);

    expect(wrapper.find(EuiLoadingContent)).toHaveLength(2);
  });
});
