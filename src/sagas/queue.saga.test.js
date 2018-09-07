import { select, put, takeEvery } from 'redux-saga/effects';
import rootSaga, {
  handleQueueActionCompleted,
  handleStartNextActionInQueue,
} from './queue.saga';
import { getNextActionForProjectId } from '../reducers/queue.reducer';
import {
  startNextActionInQueue,
  INSTALL_DEPENDENCIES_ERROR,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_ERROR,
  UNINSTALL_DEPENDENCIES_FINISH,
  START_NEXT_ACTION_IN_QUEUE,
} from '../actions';

describe('handleQueueActionCompleted saga', () => {
  const projectId = 'foo';

  it(`should dispatch ${START_NEXT_ACTION_IN_QUEUE} when next queue action exists`, () => {
    const saga = handleQueueActionCompleted({ projectId });
    const nextAction = {
      action: 'install',
      active: false,
      dependencies: [{ name: 'redux' }],
    };

    expect(saga.next().value).toEqual(
      select(getNextActionForProjectId, projectId)
    );
    expect(saga.next(nextAction).value).toEqual(
      put(startNextActionInQueue(projectId))
    );
    expect(saga.next().done).toBe(true);
  });

  it(`should dispatch ${START_NEXT_ACTION_IN_QUEUE} when queue is empty`, () => {
    const saga = handleQueueActionCompleted({ projectId });

    expect(saga.next().value).toEqual(
      select(getNextActionForProjectId, projectId)
    );
    expect(saga.next().done).toBe(true);
  });
});

describe('queue saga', () => {
  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(
          [
            INSTALL_DEPENDENCIES_ERROR,
            INSTALL_DEPENDENCIES_FINISH,
            UNINSTALL_DEPENDENCIES_ERROR,
            UNINSTALL_DEPENDENCIES_FINISH,
          ],
          handleQueueActionCompleted
        )
      );
      expect(saga.next().value).toEqual(
        takeEvery(START_NEXT_ACTION_IN_QUEUE, handleStartNextActionInQueue)
      );
    });
  });
});
