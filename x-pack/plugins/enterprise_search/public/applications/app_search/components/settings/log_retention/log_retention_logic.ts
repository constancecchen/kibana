/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { kea, MakeLogicType } from 'kea';

import { ELogRetentionOptions, ILogRetention } from './types';
import { HttpLogic } from '../../../../shared/http';
import { flashAPIErrors } from '../../../../shared/flash_messages';

interface ILogRetentionActions {
  clearLogRetentionUpdating(): { value: boolean };
  closeModals(): { value: boolean };
  fetchLogRetention(): { value: boolean };
  saveLogRetention(
    option: ELogRetentionOptions,
    enabled: boolean
  ): { option: ELogRetentionOptions; enabled: boolean };
  setOpenModal(option: ELogRetentionOptions): { option: ELogRetentionOptions };
  toggleLogRetention(option: ELogRetentionOptions): { option: ELogRetentionOptions };
  updateLogRetention(logRetention: ILogRetention): { logRetention: ILogRetention };
}

interface ILogRetentionValues {
  logRetention: ILogRetention | null;
  logsRetentionUpdating: boolean;
  openModal: ELogRetentionOptions | null;
}

export const LogRetentionLogic = kea<MakeLogicType<ILogRetentionValues, ILogRetentionActions>>({
  path: ['enterprise_search', 'app_search', 'log_retention_logic'],
  actions: () => ({
    clearLogRetentionUpdating: true,
    closeModals: true,
    fetchLogRetention: true,
    saveLogRetention: (option, enabled) => ({ enabled, option }),
    setOpenModal: (option) => ({ option }),
    toggleLogRetention: (option) => ({ option }),
    updateLogRetention: (logRetention) => ({ logRetention }),
  }),
  reducers: () => ({
    logRetention: [
      null,
      {
        updateLogRetention: (previousValue, { logRetention }) => {
          return {
            [ELogRetentionOptions.Analytics]: {
              ...previousValue?.[ELogRetentionOptions.Analytics],
              ...logRetention[ELogRetentionOptions.Analytics],
            },
            [ELogRetentionOptions.API]: {
              ...previousValue?.[ELogRetentionOptions.API],
              ...logRetention[ELogRetentionOptions.API],
            },
          };
        },
      },
    ],
    logsRetentionUpdating: [
      false,
      {
        clearLogRetentionUpdating: () => false,
        closeModals: () => false,
        fetchLogRetention: () => true,
        toggleLogRetention: () => true,
      },
    ],
    openModal: [
      null,
      {
        closeModals: () => null,
        saveLogRetention: () => null,
        setOpenModal: (_, { option }) => option,
      },
    ],
  }),
  listeners: ({ actions, values }) => ({
    fetchLogRetention: async () => {
      try {
        const { http } = HttpLogic.values;
        const response = await http.get('/api/app_search/log_settings');
        actions.updateLogRetention(response);
      } catch (e) {
        flashAPIErrors(e);
      } finally {
        actions.clearLogRetentionUpdating();
      }
    },
    saveLogRetention: async ({ enabled, option }) => {
      const updateData = { [option.toString()]: { enabled } };

      try {
        const { http } = HttpLogic.values;
        const response = await http.put('/api/app_search/log_settings', {
          body: JSON.stringify(updateData),
        });
        actions.updateLogRetention(response);
      } catch (e) {
        flashAPIErrors(e);
      } finally {
        actions.clearLogRetentionUpdating();
      }
    },
    toggleLogRetention: ({ option }) => {
      const logRetention = values.logRetention && values.logRetention[option];

      // If the user has found a way to call this before we've retrieved
      // log retention settings from the server, short circuit this and return early
      if (!logRetention) {
        return;
      }

      const optionIsAlreadyEnabled = logRetention.enabled;
      if (optionIsAlreadyEnabled) {
        actions.setOpenModal(option);
      } else {
        actions.saveLogRetention(option, true);
      }
    },
  }),
});
