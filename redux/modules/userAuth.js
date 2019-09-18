// @flow weak

import moment                 from 'moment';
import { appConfig }          from '../../config';
import userInfosMockData      from '../../models/userInfosMock';  // from '../../models/userInfosMocks';
import { getLocationOrigin }  from '../../services/fetchTools'; // '../../services/utils';
import auth                   from '../../services/auth';

// --------------------------------
// CONSTANTS
// --------------------------------
const REQUEST_USER_INFOS_DATA:         string = 'REQUEST_USER_INFOS_DATA';
const RECEIVED_USER_INFOS_DATA:        string = 'RECEIVED_USER_INFOS_DATA';
const ERROR_USER_INFOS_DATA:           string = 'ERROR_USER_INFOS_DATA';

const REQUEST_LOG_USER:                string = 'REQUEST_LOG_USER';
const RECEIVED_LOG_USER:               string = 'RECEIVED_LOG_USER';
const ERROR_LOG_USER:                  string = 'ERROR_LOG_USER';

const CHECK_IF_USER_IS_AUTHENTICATED = 'CHECK_IF_USER_IS_AUTHENTICATED';

const DISCONNECT_USER                = 'DISCONNECT_USER';

// --------------------------------
// REDUCER
// --------------------------------
const initialState = {
  // actions details
  isFetching:      false,
  isLogging:       false,
  time:            '',

  // userInfos
  userId:          '',
  token:           null,
  lifetime:        null,
  isAuthenticated: null   // authentication status (token based auth)
};

export default function ( state = initialState, action ) {
  const currentTime = moment().format();

  switch (action.type) {

  case CHECK_IF_USER_IS_AUTHENTICATED:
    return {
      ...state,
      actionTime:      currentTime,
      isAuthenticated: action.isAuthenticated,
      token:           action.token || initialState.token,
      userId:          action.user && action.userId ? action.userId: initialState.userId,
    };

  case DISCONNECT_USER:
    return {
      ...state,
      actionTime:      currentTime,
      isAuthenticated: false,
      token:           initialState.token,
      userId:          initialState.userId,
      lifetime:        initialState.lifetime
    };

  // user login (get token and userInfo)
  case REQUEST_LOG_USER:
    return {
      ...state,
      actionTime: currentTime,
      isLogging:  true
    };

  case RECEIVED_LOG_USER: {
    const userLogged = action.payload.data;

    return {
      ...state,
      actionTime:      currentTime,
      isAuthenticated: true,
      token:           userLogged.token,
      userId:          userLogged.userId,
      lifetime:        userLogged.lifetime,
      isLogging:       false
    };
  }

  case ERROR_LOG_USER:
    return {
      ...state,
      actionTime:       currentTime,
      isAuthenticated:  false,
      isLogging:        false
    };

  default:
    return state;
  }
}

// --------------------------------
// ACTIONS CREATORS
// --------------------------------
//

/**
 *
 * set user isAuthenticated to false and clear all app localstorage:
 *
 * @export
 * @returns {action} action
 */
export function disconnectUser() {
  auth.clearAllAppStorage();
  return { type: DISCONNECT_USER };
}

/**
 *
 * check if user is connected by looking at locally stored
 * - token
 * - user fonrmation
 *
 * @export
 * @returns {action} action
 */
export function checkUserIsConnected() {
  const token           = auth.getToken();
  const user            = auth.getUserInfo();
  // const checkUserHasId  = obj => obj && obj._id;
  // const isAuthenticated = (token && checkUserHasId(user)) ? true : false;
  const isAuthenticated = !!token;

  return {
    type: CHECK_IF_USER_IS_AUTHENTICATED,
    token,
    ...user,
    isAuthenticated
  };
}

/**
 *
 *  user login
 *
 * @param {string} login user login
 * @param {string} password usepasswordr
 * @returns {Promise<any>} promised action
 */
function logUser(
  login: string,
  password: string,
  cb: func
) {
  return (dispatch) => {
    const FETCH_TYPE  = appConfig.DEV_MODE ? 'FETCH' : 'FETCH';
    const __SOME_LOGIN_API__ = 'login';

    const mockResult  = { token: userInfosMockData.token, data: {...userInfosMockData}}; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)
    const url         = `${getLocationOrigin()}/admin-jwt`;
    const method      = 'post';
    const headers     = {};
    const options     = {
      credentials: 'same-origin',
      data: {
        login,
        password
      }
    };

    // fetchMiddleware (does: fetch mock, real fetch, dispatch 3 actions... for a minimum code on action creator!)
    return dispatch({
      type: 'FETCH_MIDDLEWARE',
      fetch: {
        // common props:
        type: FETCH_TYPE,
        actionTypes: {
          request:  REQUEST_LOG_USER,
          success:  RECEIVED_LOG_USER,
          fail:     ERROR_LOG_USER
        },
        // mock fetch props:
        mockResult,
        url,
        method,
        headers,
        options
      },
      cb
    });
  };
}

export function logUserIfNeeded( email: string, password: string, cb: func ): (...any) => Promise<any> {
  return ( dispatch: (any) => any, getState: () => boolean ): any => {
    if (shouldLogUser(getState())) {
      return dispatch(logUser(email, password, cb));
    }
    return Promise.resolve('already loggin in...');
  };
}

function shouldLogUser( state: any ): boolean {
  const isLogging = state.userAuth.isLogging;
  if (isLogging) {
    return false;
  }
  return true;
}

/**
 * fetch user info
 *
 * NOTE: this shows a use-case of fetchMiddleware
 *@param {string} [id=''] user id
 * @returns {Promise<any>} returns fetch promise
 */
function fetchUserInfosData(id = '') {
  return dispatch => {
    const token = auth.getToken();
    const FETCH_TYPE  = appConfig.DEV_MODE ? 'FETCH' : 'FETCH';

    const mockResult  = { token: userInfosMockData.token, data: {...userInfosMockData}}; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)
    const url         = `${getLocationOrigin()}/${appConfig.API.users}/${id}`;
    const method      = 'get';
    const headers     = { authorization: `Bearer ${token}` };
    const options     = { credentials: 'same-origin' }; // put options here (see axios options)

    return dispatch({
      type: 'FETCH_MIDDLEWARE',
      fetch: {
        // common props:
        type: FETCH_TYPE,
        actionTypes: {
          request:  REQUEST_USER_INFOS_DATA,
          success:  RECEIVED_USER_INFOS_DATA,
          fail:     ERROR_USER_INFOS_DATA
        },
        // mock fetch props:
        mockResult,
        // real fetch props:
        url,
        method,
        headers,
        options
      }
    });
  };
}

export function fetchUserInfoDataIfNeeded(
  id: string = ''
) {
  return (
    dispatch,
    getState
  ) => {
    if (shouldFetchUserInfoData(getState())) {
      return dispatch(fetchUserInfosData(id));
    }
    return Promise.resolve();
  };
}

/**
 *
 * determine wether fetching should occur
 *
 * rules:
 * - should not fetch twice when already fetching
 * - ...more rules can be added
 *
 * @param {Immutable.Map} state all redux state (immutable state)
 * @returns {boolean} flag
 */
function shouldFetchUserInfoData(state): boolean {
  const userInfos = state.userAuth;
  if (userInfos.isFetching) {
    return false;
  }
  return true;
}
