// @flow

import { registerHttpAction } from './registerHttpAction';

function getMock() {
  return {
    '_id' : '5a754ea5d3cbb06f4e0acb72',
    'updatedAt' : new Date('2018-02-03T05:54:45.910Z'),
    'createdAt' : new Date('2018-02-03T05:54:45.375Z'),
    'label' : 'XCM',
    'currency' : 'XCM',
    'balance' : 15002,
    'disabled' : false,
    'userId' : '5a716a51ee820437c44264af',
    'pendingBalance' : 0,
    'balanceHistory' : [
      {
        'newBalance' : 0,
        'timestamp' : new Date('2018-02-03T05:54:45.375Z')
      },
      {
        'timestamp' : new Date('2018-02-03T05:54:45.909Z'),
        'paymentId' : '5a7544de86c4821eecb022d6',
        'newBalance' : 14636
      },
      {
        'timestamp' : new Date('2018-02-03T05:54:45.909Z'),
        'paymentId' : '5a7544de86c4821eecb022d6',
        'newBalance' : 15002,
        'description' : 'Referral bonus',
        'referral' : '5a35eb28a49fe94969b0d890'
      }
    ]
  };
}

function createUrl({ _id }) {
  return `admin/updateWallet/${_id}`;
}

function createBody(params) {
  return params;
}

const { reducer, action } = registerHttpAction({
  name: 'UPDATE_WALLET',
  getMock,
  method: 'put',
  createUrl,
  createBody
});

export default reducer;
export const updateWalletIfNeeded = action;
