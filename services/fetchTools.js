import { Base64 }  from 'js-base64';

/*
  window.location.origin polyfill
 */
export const getLocationOrigin = () => {
  return process.env.REACT_APP_API_URL;
};

/*
  query options:
 */
export const defaultOptions = {
  credentials: 'same-origin'
};

export const postMethod = {
  method: 'POST'
};

export const jsonHeader = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

/*
  query response helpers:
 */
export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    // throw error;
    return Promise.reject(error);
  }
};

export const parseJSON = (response) => {
  return response.json();
};

/*
 general helpers
 */
export const encodeBase64 = (stringToEncode) => {
  return Base64.encode(stringToEncode);
};
