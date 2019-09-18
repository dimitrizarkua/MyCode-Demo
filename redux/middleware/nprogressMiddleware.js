// @flow
import assert from 'assert';

import type { Action } from '../types';

import nprogress from '../../services/nprogress';

// Shows toastr notification for each 'ERROR_*' action type
export const nprogressMiddleware = store => next => (action: Action) => {
  assert(store);

  if (action.type.startsWith('REQUEST_')) {
    nprogress.push();
  } else if (action.type.startsWith('RECEIVED_')) {
    nprogress.pop();
  } else if (action.type.startsWith('ERROR_')) { // TODO what if we have action that starts with Error and which is not a request?
    nprogress.pop();
  } else if (action.type.startsWith('ABORT_')) {
    nprogress.pop();
  }
  return next(action);
};
