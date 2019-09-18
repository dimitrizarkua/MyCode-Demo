// flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */

/*
  imports
 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {
  getSaleStatsData
}                           from '../../services/API';
import {
  fetchSaleStatsMockData

}                           from '../../services/fetchMocks';
import * as ReduxTypes      from '../types';

/*
  constants
 */
const REQUEST_SALE_STATS_DATA   = 'REQUEST_SALE_STATS_DATA';
const RECEIVED_SALE_STATS_DATA  = 'RECEIVED_SALE_STATS_DATA';
const ERROR_SALE_STATS_DATA     = 'ERROR_SALE_STATS_DATA';

type SaleStatsState = {
  isFetching: boolean,
  quotes:     Array,
  data:       Object,
  time:       string,
};

/*
  reducer
 */
const initialState: SaleStatsState = {
  isFetching: false,
  quotes:     [],
  data:       {},
  time:       null,
};

export default function saleStats(state = initialState, action) {
  switch (action.type) {
  case REQUEST_SALE_STATS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };
  case RECEIVED_SALE_STATS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      quotes:     action.quotes,
      data:       action.data,
      time:       action.time
    };
  case ERROR_SALE_STATS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };
  default:
    return state;
  }
}


/*
  action creators
 */
export function fetchSaleStatsDataIfNeeded() {
  return (
    dispatch,
    getState
  ) => {
    if (shouldFetchSaleStatsData(getState())) {
      return dispatch(fetchSaleStatsData());
    }
  };
}

function requestSaleStatsData(time = moment().format()) {
  return {
    type:       REQUEST_SALE_STATS_DATA,
    isFetching: true,
    time
  };
}

function receivedSaleStatsData(data, time = moment().format()) {
  return {
    type:       RECEIVED_SALE_STATS_DATA,
    isFetching: false,
    quotes:     [...data.quotes],
    data:       {...data.data},
    time
  };
}

function errorSaleStatsData(error, time = moment().format()) {
  return {
    type:       ERROR_SALE_STATS_DATA,
    isFetching: false,
    error,
    time
  };
}

function fetchSaleStatsData() {
  return dispatch => {
    dispatch(requestSaleStatsData());
    if (!appConfig.DEV_MODE) {
      // DEV ONLY
      fetchSaleStatsMockData()
        .then(
          data => dispatch(receivedSaleStatsData(data))
        );
    } else {
      getSaleStatsData()
        .then(
          data => dispatch(receivedSaleStatsData(data))
        )
        .catch(
          error => dispatch(errorSaleStatsData(error))
        );
    }
  };
}

function shouldFetchSaleStatsData(state) {
  const saleStatsStore = state.saleStats;
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (saleStatsStore.isFetching) {
    return false;
  } else {
    return true;
  }
}

