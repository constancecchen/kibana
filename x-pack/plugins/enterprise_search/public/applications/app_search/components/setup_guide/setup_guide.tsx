/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiPage,
  EuiPageSideBar,
  EuiPageBody,
  EuiPageContent,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiText,
  EuiImage,
  EuiIcon,
  EuiSteps,
  EuiCode,
  EuiCodeBlock,
  EuiAccordion,
  EuiLink,
} from '@elastic/eui';

import { SetAppSearchBreadcrumbs as SetBreadcrumbs } from '../../../shared/kibana_breadcrumbs';
import { SendAppSearchTelemetry as SendTelemetry } from '../../../shared/telemetry';

import GettingStarted from '../../assets/getting_started.png';
import './setup_guide.scss';

export const SetupGuide: React.FC<> = () => {
  return (
    <EuiPage className="setup-guide">
      <SetBreadcrumbs text="Setup Guide" />
      <SendTelemetry action="viewed" metric="setup_guide" />

      <EuiPageSideBar>
        <EuiText color="subdued" size="s">
          <strong>Setup Guide</strong>
        </EuiText>
        <EuiSpacer size="s" />

        <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiIcon type="logoAppSearch" size="l" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiTitle size="m">
              <h1>App Search</h1>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>

        <a
          href="https://www.elastic.co/webinars/getting-started-with-elastic-app-search"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="setup-guide__thumbnail"
            src={GettingStarted}
            alt="Getting started with App Search - in this short video we'll guide you through how to get App Search up and running"
            width="1280"
            height-="720"
          />
        </a>

        <EuiTitle size="s">
          <p>
            Set up App Search to leverage dashboards, analytics, and APIs for advanced application
            search made simple.
          </p>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiText>
          <p>
            App Search has not been configured in your Kibana instance yet. To get started, follow
            the instructions on this page.
          </p>
        </EuiText>
      </EuiPageSideBar>

      <EuiPageBody>
        <EuiPageContent>
          <EuiSteps
            headingElement="h2"
            steps={[
              {
                title: 'Add your App Search host URL to your Kibana configuration',
                children: (
                  <EuiText>
                    <p>
                      Within your <EuiCode>config/kibana.yml</EuiCode> file, add the following the
                      host URL of your App Search instance as{' '}
                      <EuiCode>enterpriseSearch.host</EuiCode>. For example:
                    </p>
                    <EuiCodeBlock language="yml">
                      enterpriseSearch.host: &apos;http://localhost:3002&apos;
                    </EuiCodeBlock>
                  </EuiText>
                ),
              },
              {
                title: 'Reload your Kibana instance',
                children: (
                  <EuiText>
                    <p>
                      After updating your Kibana config file, restart Kibana to pick up your
                      changes.
                    </p>
                    <p>
                      If you’re using{' '}
                      <EuiLink
                        href="https://swiftype.com/documentation/app-search/self-managed/security#elasticsearch-native-realm"
                        target="_blank"
                      >
                        Elasticsearch Native
                      </EuiLink>{' '}
                      auth within App Search - you’re all set! All users should be able to use App
                      Search in Kibana automatically, inheriting the existing access and permissions
                      they have within App Search.
                    </p>
                  </EuiText>
                ),
              },
              {
                title: 'Troubleshooting issues',
                children: (
                  <>
                    <EuiAccordion
                      buttonContent="App Search is on a different Elasticsearch cluster than Kibana"
                      id="standard-auth"
                      paddingSize="s"
                    >
                      <EuiText>
                        <p>
                          The plugin currently relies on App Search and Kibana sharing the same
                          Elasticsearch cluster. If your App Search instance and Kibana instance are
                          on different clusters, this plugin unfortunately will not work.
                        </p>
                      </EuiText>
                    </EuiAccordion>
                    <EuiSpacer />
                    <EuiAccordion
                      buttonContent="App Search and Kibana are on different authentication methods"
                      id="standard-auth"
                      paddingSize="s"
                    >
                      <EuiText>
                        <p>
                          The plugin does not currently support App Search operating on different
                          authentication methods (for example, App Search being on a different SAML
                          provider than Kibana).
                        </p>
                      </EuiText>
                    </EuiAccordion>
                    <EuiSpacer />
                    <EuiAccordion
                      buttonContent="App Search on Standard authentication"
                      id="standard-auth"
                      paddingSize="s"
                    >
                      <EuiText>
                        <p>
                          Unfortunately, App Search operating on{' '}
                          <EuiLink
                            href="https://swiftype.com/documentation/app-search/self-managed/security#standard"
                            target="_blank"
                          >
                            Standard Auth
                          </EuiLink>{' '}
                          is currently not fully supported by this plugin. Users created in App
                          Search must be granted Kibana access. Users created in Kibana will see
                          &quot;Cannot find App Search account&quot; error messages.
                        </p>
                      </EuiText>
                    </EuiAccordion>
                  </>
                ),
              },
            ]}
          />
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
