// @flow

import qs from 'qs';

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type GetKycSummaryParams = {
  startDate: ?Date,
  endDate: ?Date
}

type GetKycSummaryResult = {
  "averageTime": number | null,
  "count": {
    "OK": number,
    "FAIL": number,
    "PENDING": number,
    "TOTAL": number
  }
}

function getMock(/* params: GetKycSummaryParams */): GetKycSummaryResult {
  return {
    'averageTime': null,
    'count': {
      'OK': 0,
      'FAIL': 0,
      'PENDING': 2,
      'TOTAL': 2
    }
  };
}

function createUrl(params: GetKycSummaryParams) {
  return 'admin/kycSummary/?' + qs.stringify(params);
}

function createBody(/* params: GetKycSummaryParams */) {
  return;
}

const { reducer: getKycSummaryResult, action: getKycSummaryIfNeeded } = registerHttpAction(({
  name: 'GET_KYC_SUMMARY',
  getMock,
  method: 'get',
  createUrl,
  createBody
}: RegisterHttpActionParam<GetKycSummaryResult, GetKycSummaryParams>));

export type GetKycSummaryState = ActionState<GetKycSummaryResult, GetKycSummaryParams>

export {
  getKycSummaryResult,
  getKycSummaryIfNeeded
};
