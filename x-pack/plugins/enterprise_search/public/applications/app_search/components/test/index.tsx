/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { useValues } from 'kea';

import { EuiThemeProvider } from '../../../../../../../../src/plugins/kibana_react/common';
import { KibanaContextProvider } from '../../../../../../../../src/plugins/kibana_react/public';
import { LogStream } from '../../../../../../infra/public';

import { HttpLogic } from '../../../shared/http';
import { KibanaLogic } from '../../../shared/kibana';
import { AppSearchPageTemplate } from '../layout';

/*
 * Documentation links for reference:
 * - https://github.com/elastic/kibana/blob/master/x-pack/plugins/infra/public/components/log_stream/log_stream.stories.mdx
 *   - Run `yarn storybook infra` and go to http://localhost:9001/?path=/docs/infra-logstream--default-story
 * - Example team usage: https://github.com/elastic/kibana/blob/master/x-pack/plugins/apm/public/components/app/transaction_details/waterfall_with_summary/TransactionTabs.tsx
 *
 * EuiThemeProvider req: https://github.com/elastic/kibana/blob/master/src/plugins/kibana_react/common/eui_styled_components.tsx
 * KibanaContextProvider req: https://github.com/elastic/kibana/blob/master/src/plugins/kibana_react/README.md
 * ! NOTE: It's possible these providers should get set at the App/index.tsx level instead of just here,
 *   and that we should refactor out/DRY out some concerns we would get for free by switching to useKibana()
 *   instead of rolling our own KibanaLogic (my fault for not finding this until now!)
 */

export const Test: React.FC = () => {
  const { http } = useValues(HttpLogic);
  const { data } = useValues(KibanaLogic);

  const endTimestamp = Date.now();
  const startTimestamp = endTimestamp - 15 * 60 * 1000; // 15 minutes ago

  return (
    <AppSearchPageTemplate pageChrome={['test']} pageHeader={{ pageTitle: 'Test' }}>
      <KibanaContextProvider services={{ http, data }}>
        <EuiThemeProvider>
          <LogStream
            startTimestamp={startTimestamp}
            endTimestamp={endTimestamp}
            // query="trace.id: 18fabada9384abd4"
            // columns={[ ... ]}
          />
        </EuiThemeProvider>
      </KibanaContextProvider>
    </AppSearchPageTemplate>
  );
};
