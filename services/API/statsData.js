// @flow weak
import { appConfig }  from '../../config';
import {
  defaultOptions,
  postMethod,
  jsonHeader,
  checkStatus,
  parseJSON,
  getLocationOrigin
}                     from '../fetchTools';

const baseUrl = getLocationOrigin();

export const getEarningGraphData = () => {
  const url = `${getLocationOrigin()}/${appConfig.earningGraph.data.API}`;
  const options = {...defaultOptions};

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(error => error);
};

export const getSaleStatsData = () => {
  const options = {...defaultOptions};

  return fetch(baseUrl + '/sale-stats', options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => fetch(baseUrl + '/quotes', options)
      .then(checkStatus)
      .then(parseJSON)
      .then(quoteData => {
        return {
          quotes: quoteData.data,
          data: data.data
        }
      })
    )
    .catch(error => error);
};

export const getDailyStatsData = () => {

  const options = {...defaultOptions};

  return fetch(baseUrl + '/daily-stats', options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(error => error);
};

export const getPieChartPerCurrenciesData = () => {
  const url = 'https://api.coinmetro.com/sale-stats';
  const options = {...defaultOptions};

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(error => error);
};
