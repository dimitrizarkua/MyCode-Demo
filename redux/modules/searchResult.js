import moment               from 'moment';
import { appConfig }        from '../../config';
import {
  fetchMockUserSearchResultData
}                           from '../../services/fetchMocks';
import {
  getLocationOrigin
}                           from '../../services/fetchTools';
import * as ReduxTypes      from '../types';
import axios                from 'axios';
import qs                   from 'qs';

import { disconnectUser }   from './userAuth';

const baseUrl = getLocationOrigin();

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const REQUEST_SEARCH_RESULT_DATA   = 'REQUEST_SEARCH_RESULT_DATA';
const RECEIVED_SEARCH_RESULT_DATA  = 'RECEIVED_SEARCH_RESULT_DATA';
const ERROR_SEARCH_RESULT_DATA     = 'ERROR_SEARCH_RESULT_DATA';

// TODO: convert to `registerHttpAction`

type SearchResultState = {
  isFetching: boolean,
  userInfo: Object,
  payments: Array,
  tokenBuys: Array,
  wallets: Array,
  time: string,
};

/*
  reducer
 */
const initialState: SearchResultState = {
  isFetching: false,
  userInfo:   {},
  payments:   [],
  tokenBuys:  [],
  wallets:    [],
  time:       null
};

export default function searchResult(state = initialState, action) {
  switch (action.type) {
  case REQUEST_SEARCH_RESULT_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };
  case RECEIVED_SEARCH_RESULT_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      userInfo:   action.userInfo,
      payments:   action.payments,
      tokenBuys:  action.tokenBuys,
      wallets:    action.wallets,
      time:       action.time
    };
  case ERROR_SEARCH_RESULT_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      error:      action.error,
      time:       action.time
    };
  default:
    return state;
  }
}


/*
  action creators
 */
export function fetchSearchResultDataIfNeeded(searchBy: string, value: string): (...any) => Promise<any> {
  return (
    dispatch,
    getState
  ) => {
    if (shouldFetchSearchResultData(getState())) {
      return dispatch(fetchSearchResultData(searchBy, value));
    }
    return Promise.resolve('searching in...');
  };
}

function requestSearchResultData(time = moment().format()) {
  return {
    type:       REQUEST_SEARCH_RESULT_DATA,
    isFetching: true,
    time
  };
}

function receivedSearchResultData(data, time = moment().format()) {
  return {
    type:       RECEIVED_SEARCH_RESULT_DATA,
    isFetching: false,
    userInfo:   data.userInfo,
    payments:   data.payments,
    tokenBuys:  data.tokenBuys,
    wallets:    data.wallets,
    time
  };
}

function errorSearchResultData(error, time = moment().format()) {
  return {
    type:       ERROR_SEARCH_RESULT_DATA,
    isFetching: false,
    error,
    time
  };
}

function fetchSearchResultData(searchBy: string, keyword: string) {
  return dispatch => {
    dispatch(requestSearchResultData());
    if (!appConfig.DEV_MODE) {
      // DEV ONLY
      fetchMockUserSearchResultData()
        .then(
          data => dispatch(receivedSearchResultData(data))
        );
    } else {
      addTokenToHeadersOptions();
      axios.post('/admin/getUserInfo', qs.stringify({searchBy, keyword}))
        .then((response) => {
          dispatch(receivedSearchResultData(response.data.data));
        })
        .catch((error) => {
          if (error.response) {
            dispatch(errorSearchResultData(error.response.data.response.errors.message));
            if (error.response.status === 401) {
              dispatch(disconnectUser());
            }
          } else {
            dispatch(errorSearchResultData(error.message));
          }
        });
    }
  };
}

function shouldFetchSearchResultData(state) {
  const searchResultStore = state.searchResult;
  if (searchResultStore.isFetching) {
    return false;
  } else {
    return true;
  }
}

function addTokenToHeadersOptions() {
  const token = localStorage.getItem('token') || null;

  if(token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    console.error('No token saved!');
  }
}
