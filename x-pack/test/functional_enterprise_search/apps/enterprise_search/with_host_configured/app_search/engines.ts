/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';
import { AppSearchService, IEngine } from '../../../../services/app_search_service';

export default function enterpriseSearchSetupEnginesTests({
  getService,
  getPageObjects,
}: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const browser = getService('browser');
  const retry = getService('retry');
  const testSubjects = getService('testSubjects');
  const appSearch = getService('appSearch') as AppSearchService;

  const PageObjects = getPageObjects(['enterpriseSearch', 'security']);

  describe('Engines Overview', function() {
    this.tags('smoke');
    let engine1: IEngine;
    let engine2: IEngine;
    let metaEngine: IEngine;

    before(async () => {
      await esArchiver.load('empty_kibana');
      engine1 = await appSearch.createEngine();
      engine2 = await appSearch.createEngineWithDocs();
      metaEngine = await appSearch.createMetaEngine([engine1.name, engine2.name]);
    });

    after(async () => {
      await esArchiver.unload('empty_kibana');
      appSearch.destroyEngine(engine1.name);
      appSearch.destroyEngine(engine2.name);
      appSearch.destroyEngine(metaEngine.name);
    });

    describe('when an enterpriseSearch host is configured', () => {
      it('navigating to the enterprise_search plugin will redirect a user to the App Search Engines Overview page', async () => {
        await PageObjects.security.forceLogout();
        const { user, password } = appSearch.getEnterpriseSearchUser();
        await PageObjects.security.login(user, password, {
          expectSpaceSelector: false,
        });

        await PageObjects.enterpriseSearch.navigateToPage();
        await retry.try(async function() {
          const currentUrl = await browser.getCurrentUrl();
          expect(currentUrl).to.contain('/app_search');
        });
      });
    });
  });
}
