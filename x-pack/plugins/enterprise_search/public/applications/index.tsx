/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { CoreStart, AppMountParams } from 'src/core/public';
import { ClientConfigType } from '../plugin';

import { App } from './app';

export const renderApp = (core: CoreStart, params: AppMountParams, config: ClientConfigType) => {
  ReactDOM.render(
    <BrowserRouter basename={params.appBasePath}>
      <App core={core} config={config} />
    </BrowserRouter>,
    params.element
  );
  return () => ReactDOM.unmountComponentAtNode(params.element);
};
