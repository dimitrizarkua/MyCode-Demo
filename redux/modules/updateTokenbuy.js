// @flow

import { registerHttpAction } from './registerHttpAction';

function getMock() {
  return {
    '_id': '5a442d9e935feb06cc038e49',
    'updatedAt': new Date('2017-12-27T23:34:56.655Z'),
    'createdAt': new Date('2017-12-27T23:32:46.205Z'),
    'userId': '5a344789eec6c879ba186f29',
    'paymentId': '5a442d9d935feb06cc038e38',
    'coinAmount': 4571,
    'coinPrice': 0.00004244891708597681,
    'purchaseCurrency': 'ETH',
    'purchaseAmount': 0.194034,
    'credited': true,
    '__v': 0,
    'creditAmount': 4571,
    'creditPrice': 0.00004244891708597681,
    'currency': null
  };
}

function createUrl({ _id }) {
  return `admin/updateTokenbuy/${_id}`;
}

function createBody(params) {
  return params;
}

const { reducer, action } = registerHttpAction({
  name: 'UPDATE_TOKENBUY',
  getMock,
  method: 'put',
  createUrl,
  createBody
});

export default reducer;
export const updateTokenbuyIfNeeded = action;
