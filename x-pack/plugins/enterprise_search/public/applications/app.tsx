/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { CoreStart } from 'src/core/public';
import { ClientConfigType } from '../plugin';

import { AppSearch } from './app_search';

export interface IAppProps {
  core: CoreStart;
  config: ClientConfigType;
}

export const App: React.FC<IAppProps> = ({ core, config }) => (
  <>
    <Route exact path="/">
      {/* This will eventually contain an Enterprise Search landing page,
      and we'll also actually have a /workplace_search route */}
      <Redirect to="/app_search" />
    </Route>
    <Route path="/app_search">
      <AppSearch
        http={core.http}
        appSearchUrl={config.host}
        setBreadcrumbs={core.chrome.setBreadcrumbs}
      />
    </Route>
  </>
);
