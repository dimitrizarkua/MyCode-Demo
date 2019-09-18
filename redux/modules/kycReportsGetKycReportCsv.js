// @flow

import qs from 'qs';

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type GetKycReportCsvParams = {
  startDate: ?Date,
  endDate: ?Date
}

type GetKycReportCsvResult = string

function getMock(/* params: GetKycReportCsvParams */): GetKycReportCsvResult {
  return '1,2,3,4\n5,3,4,5';
}

function createUrl(params: GetKycReportCsvParams) {
  return 'admin/kycReport/?' + qs.stringify({
    ...params,
    format: 'csv'
  });
}

function createBody(/* params: GetKycReportCsvParams */) {
  return;
}

const { reducer: getKycReportCsvResult, action: getKycReportCsvIfNeeded } = registerHttpAction(({
  name: 'GET_KYC_REPORT_CSV',
  getMock,
  method: 'get',
  createUrl,
  createBody,
  payloadFullBody: true
}: RegisterHttpActionParam<GetKycReportCsvResult, GetKycReportCsvParams>));

export type GetKycReportCsvState = ActionState<GetKycReportCsvResult, GetKycReportCsvParams>

export {
  getKycReportCsvResult,
  getKycReportCsvIfNeeded
};
