/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { EuiSteps, EuiIcon } from '@elastic/eui';

import { mountWithContext } from '../../__mocks__';

import { SetupGuide } from './';

describe('SetupGuide', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SetupGuide productName="Enterprise Search" productEuiIcon="logoEnterpriseSearch">
        <p data-test-subj="test">Wow!</p>
      </SetupGuide>
    );

    expect(wrapper.find('h1').text()).toEqual('Enterprise Search');
    expect(wrapper.find(EuiIcon).prop('type')).toEqual('logoEnterpriseSearch');
    expect(wrapper.find('[data-test-subj="test"]').text()).toEqual('Wow!');
    expect(wrapper.find(EuiSteps)).toHaveLength(1);
  });
});
