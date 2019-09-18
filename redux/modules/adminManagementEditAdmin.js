// @flow

import { type Permission } from './adminManagementPermission';
import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState, type Action } from './registerHttpAction';
import { type Admin } from './adminManagementGetAdmins';

export type EditAdminParams = {
  id: string,
  email: string,
  permissions: Permission[],
  password?: string
}

type EditAdminResult = Admin

function getMock(params: EditAdminParams): EditAdminResult {
  return {
    id: params.id,
    email: params.email,
    permissions: params.permissions
  };
}

function createUrl(params: EditAdminParams) {
  return `admin/admins/${params.id}`;
}

function createBody(params: EditAdminParams) {
  return {
    email: params.email,
    permissions: params.permissions,
    password: params.password
  };
}

const { reducer: editAdminResult, action: editAdminIfNeeded } = registerHttpAction(({
  name: 'EDIT_ADMIN',
  getMock,
  method: 'put',
  createUrl,
  createBody
}: RegisterHttpActionParam<EditAdminResult, EditAdminParams>));

export type EditAdminState = ActionState<EditAdminResult, EditAdminParams>

export type EditAdminAction = Action<EditAdminResult, EditAdminParams>

export {
  editAdminResult,
  editAdminIfNeeded
};
