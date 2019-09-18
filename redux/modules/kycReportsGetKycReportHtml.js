// @flow

import qs from 'qs';

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type GetKycReportHtmlParams = {
  startDate: ?Date,
  endDate: ?Date
}

type GetKycReportHtmlResult = string

function getMock(/* params: GetKycReportHtmlParams */): GetKycReportHtmlResult {
  /* eslint-disable max-len */
  return `
  <style>
                              table {
                                  border-collapse: collapse;
                              }
                              table, th, td {
                                  border: 1px solid black;
                              }
                          </style>
                          <table><thead><tr><th class="string">id</th><th class="string">name</th><th class="string">citizenship</th><th class="string">residence</th><th class="undefined">docNum</th><th class="undefined">sentOn</th><th class="undefined">solvedOn</th><th class="undefined">solvedBy</th><th class="string">outcome</th><th class="undefined">comment</th><th class="string">matches</th></tr></thead><tbody><tr><td class="string"><a href="https://admin.coinmetro.com/#/kyc/status?5aa00919f780ab65cb1f8692">5aa00919f780ab65cb1f8692</a></td><td class="string">Dunhao Zhuang</td><td class="string">China</td><td class="string">China</td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="string">PENDING</td><td class="undefined"></td><td class="string"><a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa00919f780ab65cb1f8692&n=0">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa00919f780ab65cb1f8692&n=1">Robert Gabriel Mugabe</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa00919f780ab65cb1f8692&n=2">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa00919f780ab65cb1f8692&n=3">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa00919f780ab65cb1f8692&n=4">Robert Gabriel Mugabe</a> </td></tr><tr><td class="string"><a href="https://admin.coinmetro.com/#/kyc/status?5aa860df68d0d75333cfc70e">5aa860df68d0d75333cfc70e</a></td><td class="string">Robert Daniel Mugabe</td><td class="string">Canada</td><td class="string">Canada</td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="string">PENDING</td><td class="undefined"></td><td class="string"><a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa860df68d0d75333cfc70e&n=0">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa860df68d0d75333cfc70e&n=1">Robert Gabriel Mugabe</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa860df68d0d75333cfc70e&n=2">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa860df68d0d75333cfc70e&n=3">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5aa860df68d0d75333cfc70e&n=4">Robert Gabriel Mugabe</a> </td></tr><tr><td class="string"><a href="https://admin.coinmetro.com/#/kyc/status?5aa91a5dde32d17e07258bb2">5aa91a5dde32d17e07258bb2</a></td><td class="string">JUNAID PATEL</td><td class="string">BARBADOS</td><td class="string">BARBADOS</td><td class="string">7706210239</td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="string">PENDING</td><td class="string">Hello Junaid, can you please correct you're date of birth. </td><td class="string"></td></tr><tr><td class="string"><a href="https://admin.coinmetro.com/#/kyc/status?5ab2789d0f22d1617bb118ca">5ab2789d0f22d1617bb118ca</a></td><td class="string">Robert Daniel Mugabe</td><td class="string">ASD</td><td class="string">ASD</td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="undefined"></td><td class="string">PENDING</td><td class="undefined"></td><td class="string"><a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5ab2789d0f22d1617bb118ca&n=0">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5ab2789d0f22d1617bb118ca&n=1">Robert Gabriel Mugabe</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5ab2789d0f22d1617bb118ca&n=2">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5ab2789d0f22d1617bb118ca&n=3">Robert Gabriel MUGABE</a> <a href="https://api.coinmetro.com/admin/kycMatchDetail?id=5ab2789d0f22d1617bb118ca&n=4">Robert Gabriel Mugabe</a> </td></tr></tbody></table>`;
  /* eslint-enable max-len */
}

function createUrl(params: GetKycReportHtmlParams) {
  return 'admin/kycReport/?' + qs.stringify({
    ...params,
    format: 'html'
  });
}

function createBody(/* params: GetKycReportHtmlParams */) {
  return;
}

const { reducer: getKycReportHtmlResult, action: getKycReportHtmlIfNeeded } = registerHttpAction(({
  name: 'GET_KYC_REPORT_HTML',
  getMock,
  method: 'get',
  createUrl,
  createBody,
  payloadFullBody: true
}: RegisterHttpActionParam<GetKycReportHtmlResult, GetKycReportHtmlParams>));

export type GetKycReportHtmlState = ActionState<GetKycReportHtmlResult, GetKycReportHtmlParams>

export {
  getKycReportHtmlResult,
  getKycReportHtmlIfNeeded
};
