// @flow

import qs from 'qs';

import {
  type RegisterHttpActionParam,
  type ActionState,
  registerHttpAction
} from '../registerHttpAction';

export type PepCheckParams = {
  fullName: string
};

// copied from cm-adminapi/src/controllers/kyc.controller.ts/Sanction
export type Sanction = {
  // required fields (or so it seems)
  id: string,
  name: string,
  source: string,
  timestamp: string,

  // optional fields
  type?: string,
  title?: string,
  first_name?: string,
  second_name?: string,
  third_name?: string,
  last_name?: string,
  father_name?: string,
  gender?: string,
  summary?: string,
  program?: string,
  function?: string,
  nationalities?: [
    {
      country: string,
      country_code: string
    }
  ],
  identifiers?: [
    {
      type: string
    }
  ],
  birth_dates?: [
    {
      date: string,
      quality: string
    }
  ],
  birth_places?: [
    {
      country: string,
      country_code: string
    }
  ],
  aliases?: [
    {
      name: string,
      quality: string
    }
  ],
  addresses?: [
    {
      country: string,
      note: string,
      country_code: string
    }
  ],
  url?: string,
  updated_at?: string,
  listed_at?: string
};

export type PepCheckResult = Array<Sanction>;

function getMock(params: PepCheckParams): PepCheckResult {
  return [
    /* eslint-disable camelcase */
    {
      name: params.fullName,
      id: 'un-sc-sanctions.6908555',
      program: 'DPRK (KPi.033)',
      source: 'un-sc-sanctions',
      timestamp: '2018-04-10T09:29:46.673781',
      nationalities: [
        {
          country: 'Democratic People\'s Republic of Korea',
          country_code: 'KP'
        }
      ],
      second_name: 'WON HO',
      function: 'DPRK Ministry of State Security Official',
      listed_at: '2016-11-30',
      identifiers: [
        {
          number: '381310014',
          type: 'passport'
        }
      ],
      birth_dates: [
        {
          date: '1964-07-17',
          quality: 'strong'
        }
      ],
      summary:
        'Ri Won Ho is a DPRK Ministry of State Security Official stationed in Syria supporting KOMID.',
      type: 'individual',
      first_name: 'RI',
      aliases: [
        {
          name: 'Jang Chang Ha',
          quality: 'strong'
        }
      ],
      updated_at: '2014-11-20',
      third_name: 'AL-HOUTHI',
      birth_places: [
        {
          country: 'Syrian Arab Republic',
          country_code: 'SY'
        }
      ],
      addresses: [
        {
          country: 'Syrian Arab Republic',
          note: 'Coastal area of. Location as of April 2016',
          country_code: 'SY'
        }
      ],
      title: 'Mr',
      url: 'http://www.worldpresidentsdb.com/Mahmoud-Abbas/',
      last_name: 'Abbas',
      father_name: 'Ryhoravich',
      gender: 'male'
    }
    /* eslint-enable camelcase */
  ];
}

function createUrl(params: PepCheckParams) {
  return 'admin/pepSanctions/?' + qs.stringify(params);
}

function createBody(/* params: PepCheckParams */) {
  return;
}

const {
  reducer: pepCheckResult,
  action: pepCheckIfNeeded
} = registerHttpAction(
  ({
    name: 'PEP_CHECK',
    getMock,
    method: 'get',
    createUrl,
    createBody
  }: RegisterHttpActionParam<PepCheckResult, PepCheckParams>)
);

export type PepCheckState = ActionState<PepCheckResult, PepCheckParams>;

export { pepCheckResult, pepCheckIfNeeded };
