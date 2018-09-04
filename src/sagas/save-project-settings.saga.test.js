import electron from 'electron'; // Mocked
import { call, put, takeEvery } from 'redux-saga/effects';

import rootSaga, {
  handleSaveSettings,
  handleFinishSettings,
  renameFolder,
} from './save-project-settings.saga';

import {
  SAVE_PROJECT_SETTINGS_START,
  SAVE_PROJECT_SETTINGS_FINISH,
  saveProjectSettingsFinish,
  hideModal,
} from '../actions';
import {
  loadPackageJson,
  writePackageJson,
} from '../services/read-from-disk.service';

jest.mock('path', () => ({
  resolve: jest.fn(),
  join: () => 'path/to/new-project',
}));

describe('save-project-settings saga', () => {
  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(SAVE_PROJECT_SETTINGS_START, handleSaveSettings)
      );
      expect(saga.next().value).toEqual(
        takeEvery(SAVE_PROJECT_SETTINGS_FINISH, handleFinishSettings)
      );
    });
  });

  describe('saveProjectSettings', () => {
    it('should save settings', () => {
      const { dialog } = electron.remote;
      const json = { name: 'project', guppy: { id: 'project', icon: null } };

      const action = {
        name: 'new-project',
        icon: 'icon',
        project: { id: 'project', path: 'path/to/project' },
      };
      const saga = handleSaveSettings(action);

      // Load package.json
      expect(saga.next().value).toEqual(
        call(loadPackageJson, 'path/to/project')
      );

      // Show confirmation for imported projects if name changed
      expect(saga.next(json).value).toEqual(
        call([dialog, dialog.showMessageBox], {
          type: 'warning',
          buttons: ['Yeah', 'Nope'],
          defaultId: 1,
          cancelId: 1,
          title: 'Are you sure?',
          message: 'Do you also want to rename the project folder?',
        })
      );

      // Confirm & rename folder
      expect(saga.next(0).value).toEqual(
        call(renameFolder, 'path/to/project', 'path/to/new-project')
      );

      // Write package.json
      const jsonWithGuppy = {
        name: 'new-project',
        guppy: {
          name: 'new-project',
          id: 'new-project',
          icon: 'icon',
        },
      };

      expect(saga.next().value).toEqual(
        call(writePackageJson, 'path/to/new-project', jsonWithGuppy)
      );

      expect(saga.next().value).toEqual(
        put(
          saveProjectSettingsFinish(undefined, 'project', 'path/to/new-project') // why is project undefined?
        )
      );
    });

    it('should hide modal on finish', () => {
      const saga = handleFinishSettings();

      expect(saga.next().value).toEqual(put(hideModal()));
    });
  });
});
