// @flow

import { registerHttpAction } from './registerHttpAction';

function getMock() {
  return {
    '_id': '5a6c0297b6a3a5652490f3d3',
    'operation': 'credit',
    'currency': 'eth',
    'type': 'crypto',
    'debited': true,
    'credited': true,
    'logs': [
      {
        'timestamp': new Date('2017-12-29T20:28:07.815Z'),
        'message': 'created',
        '_id': '5a46a5577a6b1e321015174b'
      },
      {
        'timestamp': new Date('2017-12-30T01:41:35.730Z'),
        'message': '1 eth',
        '_id': '5a46eecf6232db112062421a'
      }
    ],
    'amount': {
      'gross': 1,
      'net': 1,
      'fee': 0,
      'credited': 1
    },
    'seen': true,
    'address': '0x818ccc292e999f7a8962fb052bc883fd12a12c9d',
    'addressAssigned': new Date('2018-01-27T04:39:53.186Z'),
    'createdAt': new Date('2018-01-27T04:39:53.187Z'),
    'manualProcessed': true,
    'updatedAt': new Date('2018-02-22T07:39:28.392Z')
  };
}

function createUrl({ _id }) {
  return `admin/updatePayment/${_id}`;
}

function createBody(params) {
  return params;
}

const { reducer, action } = registerHttpAction({
  name: 'UPDATE_PAYMENT',
  getMock,
  method: 'put',
  createUrl,
  createBody
});

export default reducer;
export const updatePaymentIfNeeded = action;
