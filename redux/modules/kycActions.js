import axios from 'axios';
import {
  getLocationOrigin
}                           from '../../services/fetchTools';
import { kycMockData }      from '../../models';
import { appConfig }        from '../../config';

const baseUrl = getLocationOrigin();

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const KycActions = {
  getNextKYC: function (query = {}) {
    // TODO: make use of dispatch and redux
    // return (/* dispatch */) => {
    const token = localStorage.getItem('token') || null;

    // add Bearer token to common axios request header
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;

    if (appConfig.MOCK_MODE) {
      return new Promise((resolve/* , reject */) => {
        setImmediate(() => {
          resolve(kycMockData);
        });
      });
    }

    return axios.get('admin/getKYC' +
      (query.email ? `?email=${query.email}` : '') +
      (query.id ? `?id=${query.id}` : ''))
      .then((response) => {
        // console.log(JSON.stringify(response, null, 1));
        return response.data.data;
      })
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.response.errors.message);
        } else {
          return Promise.reject(error.message);
        }
      });
    // };
  },

  setKYC: function (data) {
    // return (/* dispatch */) => {
    const token = localStorage.getItem('token') || null;
    // TODO: enable mock mode
    // add Bearer token to common axios request header
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;

    return axios.post('admin/setKYC', data)
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.response.errors.message);
        } else {
          return Promise.reject(error.message);
        }
      });
    // };
  },

  getKYCSummary: function (startDate) {
    // return (/* dispatch */) => {
    const token = localStorage.getItem('token') || null;
    // TODO: enable mock mode
    // add Bearer token to common axios request header
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;

    return axios.get('admin/kycSummary' + (startDate ? `?startDate=${startDate}` : ''))
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.response.errors.message);
        } else {
          return Promise.reject(error.message);
        }
      });
    // };
  },

  getKYCReport: function (startDate) {
    // return (/* dispatch */) => {
    const token = localStorage.getItem('token') || null;
    // TODO: enable mock mode
    // add Bearer token to common axios request header
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;

    return axios.get('admin/kycReport?format=html' + (startDate ? `&startDate=${startDate}` : ''))
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.response.errors.message);
        } else {
          return Promise.reject(error.message);
        }
      });
    // };
  }
};
