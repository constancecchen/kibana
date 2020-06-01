/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { PluginInitializerContext, PluginConfigDescriptor } from 'src/core/server';
import { schema, TypeOf } from '@kbn/config-schema';
import { EnterpriseSearchPlugin } from './plugin';

export const plugin = (initializerContext: PluginInitializerContext) => {
  return new EnterpriseSearchPlugin(initializerContext);
};

export const configSchema = schema.object({
  enabled: schema.boolean({ defaultValue: false }), // TODO: This plugin is disabled for master/8.x only. This line should be removed once Enterprise Search becomes 8.x compatible
  host: schema.maybe(schema.string()),
});

type ConfigType = TypeOf<typeof configSchema>;

export const config: PluginConfigDescriptor<ConfigType> = {
  schema: configSchema,
  exposeToBrowser: {
    host: true,
  },
};
