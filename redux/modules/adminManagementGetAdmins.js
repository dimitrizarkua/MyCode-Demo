// @flow

import qs from 'qs';

import { type Permission } from './adminManagementPermission';
import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState, type Action } from './registerHttpAction';

export type GetAdminsParams = {
  /** Use empty string to get all admins. */
  searchQuery: string,
  /** Use 0 to get first page. */
  pageNum: number
}

export type Admin = {
  id: string,
  email: string,
  permissions: Permission[]
}

type GetAdminsResult = {
  admins: Admin[],
  /** Starts from 0 (even if no results). */
  pageNum: number,
  /** Min value is 1 (even if no results). */
  pageCount: number
}

function getMock(params: GetAdminsParams): GetAdminsResult {
  // // valid response, but no search results
  // return {
  //   admins: [],
  //   pageNum: 0,
  //   pageCount: 1
  // };

  // // valid response with several admins
  // return {
  //   admins: [
  //     {
  //       email: 'qwer@qwer.com'
  //     },
  //     {
  //       email: 'test@test.com'
  //     }
  //   ],
  //   pageNum: 0,
  //   pageCount: 1
  // };

  // valid response with pagination
  const pageNum = params.pageNum || 0;
  const pageCount = params.searchQuery ? 3 : 5;
  return {
    admins: [
      {
        id: 'qewrfvfasdfqwer',
        email: 'qwer@qwer.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwew',
        email: 'test@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe1',
        email: 'test1@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe2',
        email: 'test2@test.com',
        permissions: ['userinfo-read']
      },
      {
        id: 'rewrfvfasdfqwe3',
        email: 'test3@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe4',
        email: 'test4@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe5',
        email: 'test5@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe6',
        email: 'test6@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe7',
        email: 'test7@test.com',
        permissions: []
      },
      {
        id: 'rewrfvfasdfqwe8',
        email: 'test8@test.com',
        permissions: []
      }
    ],
    pageNum: pageNum >= pageCount ? pageCount - 1: pageNum,
    pageCount: pageCount
  };

  // // error response
  // // eslint-disable-next-line no-throw-literal
  // throw 'Failed to fetch admins';
}

function createUrl(params: GetAdminsParams) {
  return 'admin/admins/?' + qs.stringify(params);
}

function createBody(/* params: GetAdminsParams */) {
  return;
}

const { reducer: getAdminsResult, action: getAdminsIfNeeded } = registerHttpAction(({
  name: 'GET_ADMINS',
  getMock,
  method: 'get',
  createUrl,
  createBody,
  resolution: 'keeplast'
}: RegisterHttpActionParam<GetAdminsResult, GetAdminsParams>));

export type GetAdminsState = ActionState<GetAdminsResult, GetAdminsParams>

export type GetAdminsAction = Action<GetAdminsResult, GetAdminsParams>

export {
  getAdminsResult,
  getAdminsIfNeeded
};
