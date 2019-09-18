// @flow

import { registerHttpAction } from './registerHttpAction';
import type { RegisterHttpActionParam, ActionState } from './registerHttpAction';

export type ApplyReferralBonusParams = {
  referralEmail: string,
  ambassadorEmail: string
}

type ApplyReferralBonusResult = {
  result: true,
  message?: string
}

function getMock(): ApplyReferralBonusResult {
  return {
    result: true,
    message: 'Awarded 311 XCM to Referral and 622 XCM to Ambassador'
  };
}

function createUrl() {
  return 'admin/applyReferral';
}

function createBody(params: ApplyReferralBonusParams) {
  return params;
}

const { reducer: applyReferralBonusResult, action: applyReferralBonusIfNeeded } = registerHttpAction(({
  name: 'APPLY_REFERRAL_BONUS',
  getMock,
  method: 'post',
  createUrl,
  createBody
}: RegisterHttpActionParam<ApplyReferralBonusResult, ApplyReferralBonusParams>));

export type ApplyReferralBonusState = ActionState<ApplyReferralBonusResult, ApplyReferralBonusParams>

export {
  applyReferralBonusResult,
  applyReferralBonusIfNeeded
};
