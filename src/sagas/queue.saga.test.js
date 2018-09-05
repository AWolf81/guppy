import { call, put, takeEvery } from 'redux-saga/effects';
import rootSaga, { handleStartNextActionInQueue } from './queue.saga';

import { START_NEXT_ACTION_IN_QUEUE } from '../actions';

describe('queue saga', () => {
  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();

      expect(saga.next().value).toEqual(
        takeEvery(START_NEXT_ACTION_IN_QUEUE, handleStartNextActionInQueue)
      );
    });
  });
});
