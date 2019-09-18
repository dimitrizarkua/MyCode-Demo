import moment               from 'moment';
import { appConfig }        from '../../config';
import {
  getDailyStatsData
}                           from '../../services/API';
import {
  fetchMockDailyStats
}                           from '../../services/fetchMocks';

const REQUEST_DAILY_STATS_DATA   = 'REQUEST_DAILY_STATS_DATA';
const RECEIVED_DAILY_STATS_DATA  = 'RECEIVED_DAILY_STATS_DATA';
const ERROR_DAILY_STATS_DATA     = 'ERROR_DAILY_STATS_DATA';

type DailyCollected = Array<number>;
type DailyTokenSold = Array<number>;

type DailyStatsState = {
  isFetching: boolean,
  dailyFunds: Array<DailyCollected>,
  dailyTokenSold: Array<DailyTokenSold>,
  time:       string,
};

/*
  reducer
 */
const initialState: DailyStatsState = {
  isFetching:     false,
  dailyFunds:     [],
  dailyTokenSold: [],
  time:           null
};

export default function dailyStats(state = initialState, action) {
  switch (action.type) {
  case REQUEST_DAILY_STATS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };
  case RECEIVED_DAILY_STATS_DATA:
    return {
      ...state,
      isFetching:     action.isFetching,
      dailyFunds:     action.dailyFunds,
      dailyTokenSold: action.dailyTokenSold,
      time:           action.time
    };
  case ERROR_DAILY_STATS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };
  default:
    return state;
  }
}

export function fetchDailyStatsIfNeeded() {
  return (
    dispatch,
    getState
  ) => {
    if (shouldFetchDailyStats(getState())) {
      return dispatch(fetchDailyStats());
    }
  };
}

function requestDailyStats(time = moment().format()) {
  return {
    type:       REQUEST_DAILY_STATS_DATA,
    isFetching: true,
    time
  };
}
function receivedDailyStats(data, time = moment().format()) {
  return {
    type:             RECEIVED_DAILY_STATS_DATA,
    isFetching:       false,
    dailyFunds:       [...data.data.dailyFunds],
    dailyTokenSold:   [...data.data.dailyTokenSold],
    time
  };
}
function errorDailyStats(error, time = moment().format()) {
  return {
    type:       ERROR_DAILY_STATS_DATA,
    isFetching: false,
    error,
    time
  };
}

function fetchDailyStats() {
  return dispatch => {
    dispatch(requestDailyStats());
    if (!appConfig.DEV_MODE) {
      // DEV ONLY
      fetchMockDailyStats()
        .then(
          data => dispatch(receivedDailyStats(data))
        );
    } else {
      getDailyStatsData()
        .then(
          data => dispatch(receivedDailyStats(data))
        )
        .catch(
          error => dispatch(errorDailyStats(error))
        );
    }
  };
}

function shouldFetchDailyStats(state) {
  const dailyStatsStore = state.dailyStats;
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (dailyStatsStore.isFetching) {
    return false;
  } else {
    return true;
  }
}
