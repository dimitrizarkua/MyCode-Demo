// @flow

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState, type ActionHashState, type Action } from './registerHttpAction';

export type DeleteAdminParams = {
  id: string
}

type DeleteAdminResult = {
  id: string
}

function getMock(params: DeleteAdminParams): DeleteAdminResult {
  // throw 'Failed to delete admin';

  return {
    id: params.id
  };
}

function createUrl(params: DeleteAdminParams) {
  return `admin/admins/${params.id}`;
}

function createBody(/* params: DeleteAdminParams */) {
  return;
}

const {
  hashed: {
    reducer: deleteAdminResults,
    hashFn: deleteAdminHash
  },
  action: deleteAdminIfNeeded
} = registerHttpAction(({
  name: 'DELETE_ADMIN',
  getMock,
  method: 'delete',
  createUrl,
  createBody,
  resolution: 'nocheck'
}: RegisterHttpActionParam<DeleteAdminResult, DeleteAdminParams>));

export type DeleteAdminState = ActionState<DeleteAdminResult, DeleteAdminParams>

export type DeleteAdminHashState = ActionHashState<DeleteAdminResult, DeleteAdminParams>

export type DeleteAdminAction = Action<DeleteAdminResult, DeleteAdminParams>

export {
  deleteAdminResults,
  deleteAdminHash, // function to generate hash which we can use to get actual state from hashed state
  deleteAdminIfNeeded
};
