// @flow

import assert               from 'assert';
import moment               from 'moment';
import hash                 from 'object-hash';
import { appConfig }        from '../../config';
import {
  getLocationOrigin
}                           from '../../services/fetchTools';
import axios                from 'axios';

import { disconnectUser }   from './userAuth';

const baseUrl = getLocationOrigin();

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

type ActionError = string

interface IBaseActionState<E, T, P> {
  +isFetching: boolean | null,
  /** Unix Millisecond Timestamp */
  +time: string | null,
  +payload: T | null,
  +error: E | null,
  +params: P | null
}

interface ActionInitialState<E, T, P> extends IBaseActionState<E, T, P> {
  isFetching: false,
  time: null,
  payload: null,
  error: null,
  params: null
}

interface ActionInProgressState<E, T, P> extends IBaseActionState<E, T, P> {
  isFetching: true,
  time: string,
  payload: null,
  error: null,
  params: P
}

interface ActionSuccessState<E, T, P> extends IBaseActionState<E, T, P> {
  isFetching: false,
  time: string,
  payload: T,
  error: null,
  params: P
}

interface ActionFailureState<E, T, P> extends IBaseActionState<E, T, P> {
  isFetching: false,
  time: string,
  payload: null,
  error: E,
  params: P
}

export type ActionState<T, P>
  = ActionInitialState<ActionError, T, P>
  | ActionInProgressState<ActionError, T, P>
  | ActionSuccessState<ActionError, T, P>
  | ActionFailureState<ActionError, T, P>

export type ActionHashState<T, P> = {
  [paramsHash: string]: ActionState<T, P>
}

export type Action<T, P> = ActionState<T, P> & {
  type: string
}

type ActionName = {
  uppercase: string,
  camelcase: string,
  pascalcase: string
}

export type RegisterHttpActionParam<T, P> = {
  name: string,
  method: 'get' | 'post' | 'put' | 'delete',
  getMock: (P: P) => T,
  createUrl: (P: P) => string,
  createBody: (P: P) => any,
  resolution?: 'keeplast' | 'keepfirst' | 'nocheck', // "nocheck" means it just fires the actions unconditionally
  payloadFullBody?: boolean // use full response body on success as payload
}

// when using this function, don't forget to update actions.js and reducers.js
// to finish action registration. Reducer name must correspond to `name`, ie if
// name is UPDATE_PAYMENT, then reducer name must be `updatePaymentResult`.
export function registerHttpAction<T, P>({ name, getMock, method, createUrl, createBody, resolution = 'keepfirst', payloadFullBody = false }: RegisterHttpActionParam<T, P>) {
  assert(name && name.length);

  const names = normalize(name);

  const REQUEST_ACTION   = `REQUEST_${names.uppercase}`;
  const RECEIVED_ACTION  = `RECEIVED_${names.uppercase}`;
  const ERROR_ACTION     = `ERROR_${names.uppercase}`;
  // used if resolution === keeplast
  const ABORT_ACTION     = `ABORT_${names.uppercase}`;

  const initialState: ActionInitialState<ActionError, T, P> = {
    isFetching: false,
    time: null,
    payload: null,
    error: null,
    params: null
  };

  // $FlowIgnore: flow is too dumb to understand that this code is typesafe
  function reducer(state: ActionState<T, P> = initialState, action: Action<T, P>): ActionState<T, P> {
    switch (action.type) {
    case REQUEST_ACTION:
    case RECEIVED_ACTION:
    case ERROR_ACTION:
    // dont handle ABORT_ACTION
      return {
        ...state,
        isFetching: action.isFetching,
        time: action.time,
        payload: action.payload,
        error: action.error,
        params: action.params
      };
    default:
      return state;
    }
  }

  // $FlowIgnore: flow is too dumb to understand that this code is typesafe
  function reducerHash(state: ActionHashState<T, P> = {}, action: Action<T, P>): ActionHashState<T, P> {
    switch (action.type) {
    case REQUEST_ACTION:
    case RECEIVED_ACTION:
    case ERROR_ACTION:
    case ABORT_ACTION:
      if (!action.params) {
        return state;
      } else {
        return {
          ...state,
          [hash(action.params)]: {
            isFetching: action.isFetching,
            time: action.time,
            payload: action.payload,
            error: action.error,
            params: action.params
          }
        };
      }
    default:
      return state;
    }
  }

  function doActionIfNeeded(params: P) {
    return (dispatch: any, getState: any): void => {
      if (shouldAction(getState())) {
        dispatch(doAction(params));
      }
    };
  }

  function requestAction(params: P, time = moment().format('x')): Action<T, P> {
    return {
      type: REQUEST_ACTION,
      isFetching: true,
      time,

      payload: null,
      error: null,
      params
    };
  }

  function receivedAction(params: P, payload: T, time = moment().format('x')): Action<T, P> {
    return {
      type: RECEIVED_ACTION,
      isFetching: false,
      time,

      payload,
      error: null,
      params
    };
  }

  function errorAction(params: P, error: ActionError, time = moment().format('x')): Action<T, P> {
    return {
      type: ERROR_ACTION,
      isFetching: false,
      time,

      payload: null,
      error,
      params
    };
  }

  // used if resolution === keeplast
  function abortAction(params: P, time = moment().format('x')) {
    return {
      type: ABORT_ACTION,
      time,

      payload: null,
      error: null,
      params
    };
  }

  function doAction(params: P) {
    return (dispatch, getState) => {
      const timeInitiated = moment().format('x');
      dispatch(requestAction(params, timeInitiated));
      if (appConfig.MOCK_MODE) {
        let payload;
        try {
          payload = getMock(params);
        } catch (err) {
          setTimeout(() => {
            if (resolution === 'keeplast' && getState()[`${names.camelcase}Result`].time !== timeInitiated) {
              // checking that time of this request is the same as time of last request
              // means that another request was initiated before this one finished
              dispatch(abortAction(params));
            } else {
              // eslint-disable-next-line no-console
              console.log(`mocked response ${ERROR_ACTION}`);
              dispatch(errorAction(params, err));
            }
          }, appConfig.FAKE_ASYNC_DELAY);
          return;
        }
        setTimeout(() => {
          if (resolution === 'keeplast' && getState()[`${names.camelcase}Result`].time !== timeInitiated) {
            // checking that time of this request is the same as time of last request
            // means that another request was initiated before this one finished
            dispatch(abortAction(params));
          } else {
            // eslint-disable-next-line no-console
            console.log(`mocked response ${RECEIVED_ACTION}`);
            dispatch(receivedAction(params, payload));
          }
        }, appConfig.FAKE_ASYNC_DELAY);
      } else {
        addTokenToHeadersOptions();
        axios({
          method,
          url: createUrl(params),
          data: createBody(params)
        })
          .then(response => {
            if (resolution === 'keeplast' && getState()[`${names.camelcase}Result`].time !== timeInitiated) {
              // checking that time of this request is the same as time of last request
              // means that another request was initiated before this one finished
              dispatch(abortAction(params));
            } else if (payloadFullBody) {
              dispatch(receivedAction(params, response.data));
            } else if (!response.data.data) {
              // eslint-disable-next-line no-console
              console.error(new Error('unexpected response'), response);
              dispatch(errorAction(params, 'unexpected response'));
            } else {
              // $FlowIgnore
              const data: T = response.data.data;
              dispatch(receivedAction(params, data));
            }
          })
          .catch(error => {
            if (resolution === 'keeplast' && getState()[`${names.camelcase}Result`].time !== timeInitiated) {
              // checking that time of this request is the same as time of last request
              // means that another request was initiated before this one finished
              dispatch(abortAction(params));
            } else if (error.response) {
              const { message, code } = error.response.data.response.errors;

              dispatch(errorAction(params, message));
              if (error.response.status === 401) {
                if (code === 'INSUFFICIENT_PERMISSIONS') {
                  // no-op
                } else {
                  dispatch(disconnectUser());
                }
              }
            } else {
              dispatch(errorAction(params, error.message));
            }
          });
      }
    };
  }

  function shouldAction(state) {
    if (resolution === 'keeplast' || resolution === 'nocheck') {
      return true;
    }
    // TODO: hardcoded reducer name
    const actionState: ActionState<T, P> = state[`${names.camelcase}Result`];
    if (actionState.isFetching) {
      return false;
    } else {
      return true;
    }
  }

  return {
    reducer: reducer,
    action: doActionIfNeeded,
    hashed: {
      reducer: reducerHash,
      hashFn: hash
    }
  };
}

function normalize(name: string): ActionName {
  const uppercase = name.replace(' ', '_').toUpperCase();
  const words = uppercase.split('_');
  const pascalcase = words.map(capitalize).join('');
  const camelcase = words[0].toLowerCase() + words.slice(1).map(capitalize).join('');
  return {
    uppercase,
    camelcase,
    pascalcase
  };
}

function capitalize(str) {
  const lower = str.toLowerCase();
  return lower[0].toUpperCase() + lower.slice(1);
}

function addTokenToHeadersOptions() {
  const token = localStorage.getItem('token') || null;

  if(token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    assert(false, 'No token saved!');
  }
}
