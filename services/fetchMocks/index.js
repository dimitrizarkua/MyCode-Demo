// @flow weak

import { appConfig }    from '../../config';
import {
  dailyStatsMockData,
  userInfosMockData,
  saleStatsMockData,
  userSearchResultMockData
}                       from '../../models';

export const fetchMockDailyStats = (
  timeToWait: number = appConfig.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve({
          dailyFunds: dailyStatsMockData.dailyFunds,
          dailyTokenSold: dailyStatsMockData.dailyTokenSold
        }),
        timeToWait
      );
    }
  );
};

export const fetchSaleStatsMockData = (
  timeToWait: number = appConfig.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve(saleStatsMockData),
        timeToWait
      );
    }
  );
};

export const fetchMockUserInfosData = async (
  timeToWait: number = appConfig.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve({ token: userInfosMockData.token, data: {...userInfosMockData}}), // { token: userInfosMockData.token, data: {...userInfosMockData}}
        timeToWait
      );
    }
  );
};

export const fetchMockUserSearchResultData = async (
  timeToWait: number = appConfig.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve({ userInfo: userSearchResultMockData.userInfo }),
        timeToWait
      );
    }
  );
};
