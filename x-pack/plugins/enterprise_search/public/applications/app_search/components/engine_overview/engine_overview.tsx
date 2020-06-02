/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useContext, useEffect, useState } from 'react';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiTitle,
  EuiSpacer,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

import { SetAppSearchBreadcrumbs as SetBreadcrumbs } from '../../../shared/kibana_breadcrumbs';
import { SendAppSearchTelemetry as SendTelemetry } from '../../../shared/telemetry';
import { LicenseContext, ILicenseContext, hasPlatinumLicense } from '../../../shared/licensing';
import { KibanaContext, IKibanaContext } from '../../../index';

import EnginesIcon from '../../assets/engine.svg';
import MetaEnginesIcon from '../../assets/meta_engine.svg';

import { LoadingState, EmptyState, NoUserState, ErrorState } from '../empty_states';
import { EngineOverviewHeader } from '../engine_overview_header';
import { EngineTable } from './engine_table';

import './engine_overview.scss';

export const EngineOverview: ReactFC<> = () => {
  const { http } = useContext(KibanaContext) as IKibanaContext;
  const { license } = useContext(LicenseContext) as ILicenseContext;

  const [isLoading, setIsLoading] = useState(true);
  const [hasNoAccount, setHasNoAccount] = useState(false);
  const [hasErrorConnecting, setHasErrorConnecting] = useState(false);

  const [engines, setEngines] = useState([]);
  const [enginesPage, setEnginesPage] = useState(1);
  const [enginesTotal, setEnginesTotal] = useState(0);
  const [metaEngines, setMetaEngines] = useState([]);
  const [metaEnginesPage, setMetaEnginesPage] = useState(1);
  const [metaEnginesTotal, setMetaEnginesTotal] = useState(0);

  const getEnginesData = async ({ type, pageIndex }) => {
    return await http.get('/api/app_search/engines', {
      query: { type, pageIndex },
    });
  };
  const setEnginesData = async (params, callbacks) => {
    try {
      const response = await getEnginesData(params);

      callbacks.setResults(response.results);
      callbacks.setResultsTotal(response.meta.page.total_results);

      setIsLoading(false);
    } catch (error) {
      if (error?.body?.message === 'no-as-account') {
        setHasNoAccount(true);
      } else {
        setHasErrorConnecting(true);
      }
    }
  };

  useEffect(() => {
    const params = { type: 'indexed', pageIndex: enginesPage };
    const callbacks = { setResults: setEngines, setResultsTotal: setEnginesTotal };

    setEnginesData(params, callbacks);
  }, [enginesPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasPlatinumLicense(license)) {
      const params = { type: 'meta', pageIndex: metaEnginesPage };
      const callbacks = { setResults: setMetaEngines, setResultsTotal: setMetaEnginesTotal };

      setEnginesData(params, callbacks);
    }
  }, [license, metaEnginesPage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (hasErrorConnecting) return <ErrorState />;
  if (hasNoAccount) return <NoUserState />;
  if (isLoading) return <LoadingState />;
  if (!engines.length) return <EmptyState />;

  return (
    <EuiPage restrictWidth className="engine-overview">
      <SetBreadcrumbs isRoot />
      <SendTelemetry action="viewed" metric="engines_overview" />

      <EuiPageBody>
        <EngineOverviewHeader />

        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiTitle size="s">
              <h2>
                <img src={EnginesIcon} alt="" className="engine-icon" />
                <FormattedMessage
                  id="xpack.enterpriseSearch.appSearch.enginesOverview.engines"
                  defaultMessage="Engines"
                />
              </h2>
            </EuiTitle>
          </EuiPageContentHeader>
          <EuiPageContentBody data-test-subj="appSearchEngines">
            <EngineTable
              data={engines}
              pagination={{
                totalEngines: enginesTotal,
                pageIndex: enginesPage - 1,
                onPaginate: setEnginesPage,
              }}
            />
          </EuiPageContentBody>

          {metaEngines.length > 0 && (
            <>
              <EuiSpacer size="xl" />
              <EuiPageContentHeader>
                <EuiTitle size="s">
                  <h2>
                    <img src={MetaEnginesIcon} alt="" className="engine-icon" />
                    <FormattedMessage
                      id="xpack.enterpriseSearch.appSearch.enginesOverview.metaEngines"
                      defaultMessage="Meta Engines"
                    />
                  </h2>
                </EuiTitle>
              </EuiPageContentHeader>
              <EuiPageContentBody data-test-subj="appSearchMetaEngines">
                <EngineTable
                  data={metaEngines}
                  pagination={{
                    totalEngines: metaEnginesTotal,
                    pageIndex: metaEnginesPage - 1,
                    onPaginate: setMetaEnginesPage,
                  }}
                />
              </EuiPageContentBody>
            </>
          )}
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
