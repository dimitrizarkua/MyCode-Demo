// @flow

import { type Admin, type GetAdminsAction } from './adminManagementGetAdmins';
import { type EditAdminAction } from './adminManagementEditAdmin';
import { type DeleteAdminAction } from './adminManagementDeleteAdmin';
export * from './adminManagementGetAdmins';
export * from './adminManagementAddAdmin';
export * from './adminManagementEditAdmin';
export * from './adminManagementDeleteAdmin';

type AdminManagementState = {
  admins: Admin[]
}

const initialState: AdminManagementState = {
  admins: []
};

// $FlowIgnore: flow is too dumb to understand that this code is typesafe
export function adminManagement(state: AdminManagementState = initialState, action: GetAdminsAction | EditAdminAction | DeleteAdminAction) {
  if (action.type === 'RECEIVED_GET_ADMINS') {
    if (action.payload) {
      return {
        ...state,
        admins: action.payload.admins || []
      };
    } else {
      return {
        ...state,
        admins: []
      };
    }
  }

  if (action.type === 'RECEIVED_ADD_ADMIN') {
    return {
      ...state,
      admins: [...(state.admins), action.payload]
    };
  }

  if (action.type === 'ERROR_GET_ADMINS') {
    return {
      ...state,
      admins: []
    };
  }

  if (action.type === 'RECEIVED_EDIT_ADMIN' && action.payload) {
    return {
      ...state,
      // $FlowIgnore: flow is too dumb to understand that this code is typesafe
      admins: state.admins.map(admin => admin.id === action.payload.id ? action.payload : admin)
    };
  }

  if (action.type === 'RECEIVED_DELETE_ADMIN' && action.params) {
    return {
      ...state,
      // $FlowIgnore: flow is too dumb to understand that this code is typesafe
      admins: state.admins.filter(admin => admin.id !== action.params.id)
    };
  }

  return state;
}
