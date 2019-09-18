// @flow

import qs from 'qs';

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type GetKycReportExcelParams = {
  startDate: ?Date,
  endDate: ?Date
}

type GetKycReportExcelResult = string

function getMock(/* params: GetKycReportExcelParams */): GetKycReportExcelResult {
  return '1,2,3,4\n5,3,4,5';
}

function createUrl(params: GetKycReportExcelParams) {
  return 'admin/kycReport/?' + qs.stringify({
    ...params,
    format: 'excel'
  });
}

function createBody(/* params: GetKycReportExcelParams */) {
  return;
}

const { reducer: getKycReportExcelResult, action: getKycReportExcelIfNeeded } = registerHttpAction(({
  name: 'GET_KYC_REPORT_EXCEL',
  getMock,
  method: 'get',
  createUrl,
  createBody,
  payloadFullBody: true
}: RegisterHttpActionParam<GetKycReportExcelResult, GetKycReportExcelParams>));

export type GetKycReportExcelState = ActionState<GetKycReportExcelResult, GetKycReportExcelParams>

export {
  getKycReportExcelResult,
  getKycReportExcelIfNeeded
};
