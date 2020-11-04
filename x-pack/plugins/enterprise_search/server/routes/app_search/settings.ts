/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { schema } from '@kbn/config-schema';

import { IRouteDependencies } from '../../plugin';

interface ILogSettings {
  enabled: boolean;
  disabled_at: string | null;
  retention_policy: {
    is_default: boolean;
    min_age_days: number;
  } | null;
}
interface ILogSettingsResponse {
  api: ILogSettings;
  analytics: ILogSettings;
}

export function registerSettingsRoutes({
  router,
  enterpriseSearchRequestHandler,
}: IRouteDependencies) {
  router.get(
    {
      path: '/api/app_search/log_settings',
      validate: false,
    },
    enterpriseSearchRequestHandler.createRequest({
      path: '/as/log_settings',
      jsonTransform: (json: ILogSettingsResponse) => ({
        api: {
          enabled: json.api.enabled,
          disabledAt: json.api.disabled_at,
          retentionPolicy: json.api.retention_policy
            ? {
                isDefault: json.api.retention_policy.is_default,
                minAgeDays: json.api.retention_policy.min_age_days,
              }
            : null,
        },
        analytics: {
          enabled: json.analytics.enabled,
          disabledAt: json.analytics.disabled_at,
          retentionPolicy: json.analytics.retention_policy
            ? {
                isDefault: json.analytics.retention_policy.is_default,
                minAgeDays: json.analytics.retention_policy.min_age_days,
              }
            : null,
        },
      }),
    })
  );

  router.put(
    {
      path: '/api/app_search/log_settings',
      validate: {
        body: schema.object({
          api: schema.maybe(
            schema.object({
              enabled: schema.boolean(),
            })
          ),
          analytics: schema.maybe(
            schema.object({
              enabled: schema.boolean(),
            })
          ),
        }),
      },
    },
    async (context, request, response) => {
      return enterpriseSearchRequestHandler.createRequest({
        path: '/as/log_settings',
      })(context, request, response);
    }
  );
}
