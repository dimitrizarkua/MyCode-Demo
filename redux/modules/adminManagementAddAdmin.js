// @flow

import { type Permission } from './adminManagementPermission';
import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type AddAdminParams = {
  email: string,
  password: string,
  permissions: Permission[]
}

type AddAdminResult = {}

function getMock(params: AddAdminParams): AddAdminResult {
  return {
    ...params,
    id: 'qwerqwerqwer'
  };
}

function createUrl() {
  return 'admin/admins';
}

function createBody(params: AddAdminParams) {
  return params;
}

const { reducer: addAdminResult, action: addAdminIfNeeded } = registerHttpAction(({
  name: 'ADD_ADMIN',
  getMock,
  method: 'post',
  createUrl,
  createBody
}: RegisterHttpActionParam<AddAdminResult, AddAdminParams>));

export type AddAdminState = ActionState<AddAdminResult, AddAdminParams>

export {
  addAdminResult,
  addAdminIfNeeded
};
