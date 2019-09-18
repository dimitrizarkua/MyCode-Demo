// @flow
import assert from 'assert';

import type { Action } from '../types.js';

import * as toastr from 'toastr';

// Shows toastr notification for each 'ERROR_*' action type
export const errorToastrMiddleware = store => next => (action: Action) => {
  assert(store);

  if (action.type.startsWith('ERROR_')) {
    const errormessage = getErrorMessage(action);
    toastr.error(errormessage);
  }
  return next(action);
};

function getErrorMessage(action: Action) {
  if (!action.error) {
    return action.type;
  }
  if (typeof action.error === 'string') {
    return action.error;
  }
  if (action.error.message) {
    return action.error.message;
  }
  const stringified = JSON.stringify(action.error);
  if (stringified === '{}') {
    return action.type;
  }
  return stringified;
}
