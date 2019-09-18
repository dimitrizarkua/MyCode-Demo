// @flow

import qs from 'qs';

import { registerHttpAction } from './registerHttpAction';
import { type RegisterHttpActionParam, type ActionState } from './registerHttpAction';

export type GetKycReportParams = {
  startDate: ?Date,
  endDate: ?Date
}

type GetKycReportResult = Array<{
  "name": string,
  "citizenship": string,
  "residence": string,
  "outcome": "PENDING" | "FAIL" | "OK",
  "matches": string
}>

function getMock(/* params: GetKycReportParams */): GetKycReportResult {
  return [
    {
      'id': '5aa00919f780ab65cb1f8692',
      'name': 'Dunhao Zhuang',
      'citizenship': 'China',
      'residence': 'China',
      'outcome': 'PENDING',
      // eslint-disable-next-line max-len
      'matches': '[{"function":"Pres.","updated_at":"2015-07-22","program":"Zimbabwe","source":"us-cia-world-leaders","type":"individual","url":"https://www.cia.gov/library/publications/resources/world-leaders-1/ZI.html","timestamp":"2018-03-30T03:41:04.924465","name":"Robert Gabriel MUGABE","id":"us-cia-world-leaders.76884a9fea93b07103036eeae1729d26f9c339af","nationalities":[{"country":"Zimbabwe","country_code":"ZW"}]},{"birth_dates":[{"date":"1924-02-21","quality":"strong"}],"identifiers":[{"number":"AD001095","country":"Zimbabwe","country_code":"ZW","description":"passport"}],"second_name":"Gabriel","function":"President.","updated_at":"2017-12-26","program":"Ordinance  of 19 March 2002 on measures against Zimbabwe (SR 946.209.2), annex 2","timestamp":"2018-03-30T03:41:19.607536","first_name":"Robert","source":"ch-seco-sanctions","type":"individual","last_name":"Mugabe","summary":"Head of Government and responsible for activities that seriously undermine democracy, respect for human rights and the rule of law.","name":"Robert Gabriel Mugabe","id":"ch-seco-sanctions.6095"},{"birth_dates":[{"date":"1924-02-21","quality":"strong"}],"identifiers":[{"number":"AD002119","country":"Zimbabwe","type":"passport","country_code":"ZW","description":"Passport"}],"function":"President of the Republic of Zimbabwe","updated_at":"2018-03-23","program":"ZIMBABWE","first_name":"Robert Gabriel","source":"us-ofac","type":"individual","last_name":"MUGABE","timestamp":"2018-03-30T03:42:03.316320","name":"Robert Gabriel MUGABE","id":"us-ofac.9636dcc826452e8c7754762c3180f1e637d210ea"},{"birth_dates":[{"date":"1924-02-21"}],"identifiers":[{"number":"AD001095","type":"passport"}],"second_name":"Gabriel","updated_at":"2018-02-16","program":"Zimbabwe","timestamp":"2018-03-30T03:42:30.894582","first_name":"Robert","source":"gb-hmt-sanctionslist","addresses":[{}],"type":"individual","last_name":"MUGABE","summary":"Former President.","name":"Robert Gabriel MUGABE","id":"gb-hmt-sanctionslist.7321"},{"birth_dates":[{"date":"1924-02-21"},{"date":"1924-02-21"}],"identifiers":[{"number":"AD001095 (passport-National passport) ((passport))","type":"passport"}],"second_name":"Gabriel","function":"Former President","updated_at":"2018-02-16","program":"ZWE","gender":"male","timestamp":"2018-03-30T03:42:57.355450","first_name":"Robert","aliases":[{"name":"Robert Gabriel Mugabe","second_name":"Gabriel","last_name":"Mugabe","first_name":"Robert"}],"source":"eu-eeas-sanctions","type":"individual","last_name":"Mugabe","url":"http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32018R0223&from=EN","summary":"(Entity is sanctioned in regime 310/2002 (OJ L50) of programme ZWE, in regime 314/2004 (OJ L55) of programme ZWE)","name":"Robert Gabriel Mugabe","birth_places":[{"place":"Kutama"}],"id":"eu-eeas-sanctions.1"}]'
    },
    {
      'id': '5aa00919f780ab65cb1f8693',
      'name': 'Robert Daniel Mugabe',
      'citizenship': 'Canada',
      'residence': 'Canada',
      'outcome': 'PENDING',
      // eslint-disable-next-line max-len
      'matches': '[{"function":"Pres.","updated_at":"2015-07-22","program":"Zimbabwe","source":"us-cia-world-leaders","type":"individual","url":"https://www.cia.gov/library/publications/resources/world-leaders-1/ZI.html","timestamp":"2018-03-30T03:41:04.924465","name":"Robert Gabriel MUGABE","id":"us-cia-world-leaders.76884a9fea93b07103036eeae1729d26f9c339af","nationalities":[{"country":"Zimbabwe","country_code":"ZW"}]},{"birth_dates":[{"date":"1924-02-21","quality":"strong"}],"identifiers":[{"number":"AD001095","country":"Zimbabwe","country_code":"ZW","description":"passport"}],"second_name":"Gabriel","function":"President.","updated_at":"2017-12-26","program":"Ordinance  of 19 March 2002 on measures against Zimbabwe (SR 946.209.2), annex 2","timestamp":"2018-03-30T03:41:19.607536","first_name":"Robert","source":"ch-seco-sanctions","type":"individual","last_name":"Mugabe","summary":"Head of Government and responsible for activities that seriously undermine democracy, respect for human rights and the rule of law.","name":"Robert Gabriel Mugabe","id":"ch-seco-sanctions.6095"},{"birth_dates":[{"date":"1924-02-21","quality":"strong"}],"identifiers":[{"number":"AD002119","country":"Zimbabwe","type":"passport","country_code":"ZW","description":"Passport"}],"function":"President of the Republic of Zimbabwe","updated_at":"2018-03-23","program":"ZIMBABWE","first_name":"Robert Gabriel","source":"us-ofac","type":"individual","last_name":"MUGABE","timestamp":"2018-03-30T03:42:03.316320","name":"Robert Gabriel MUGABE","id":"us-ofac.9636dcc826452e8c7754762c3180f1e637d210ea"},{"birth_dates":[{"date":"1924-02-21"}],"identifiers":[{"number":"AD001095","type":"passport"}],"second_name":"Gabriel","updated_at":"2018-02-16","program":"Zimbabwe","timestamp":"2018-03-30T03:42:30.894582","first_name":"Robert","source":"gb-hmt-sanctionslist","addresses":[{}],"type":"individual","last_name":"MUGABE","summary":"Former President.","name":"Robert Gabriel MUGABE","id":"gb-hmt-sanctionslist.7321"},{"birth_dates":[{"date":"1924-02-21"},{"date":"1924-02-21"}],"identifiers":[{"number":"AD001095 (passport-National passport) ((passport))","type":"passport"}],"second_name":"Gabriel","function":"Former President","updated_at":"2018-02-16","program":"ZWE","gender":"male","timestamp":"2018-03-30T03:42:57.355450","first_name":"Robert","aliases":[{"name":"Robert Gabriel Mugabe","second_name":"Gabriel","last_name":"Mugabe","first_name":"Robert"}],"source":"eu-eeas-sanctions","type":"individual","last_name":"Mugabe","url":"http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32018R0223&from=EN","summary":"(Entity is sanctioned in regime 310/2002 (OJ L50) of programme ZWE, in regime 314/2004 (OJ L55) of programme ZWE)","name":"Robert Gabriel Mugabe","birth_places":[{"place":"Kutama"}],"id":"eu-eeas-sanctions.1"}]'
    },
    {
      'id': '5aa00919f780ab65cb1f8694',
      'name': 'Dunhao Zhuang',
      'citizenship': 'China',
      'residence': 'China',
      'outcome': 'PENDING',
      // eslint-disable-next-line max-len
      'matches': '[]'
    },
    {
      'id': '5aa00919f780ab65cb1f8695',
      'name': 'Dunhao Zhuang',
      'citizenship': 'China',
      'residence': 'China',
      'outcome': 'PENDING',
      // eslint-disable-next-line max-len
      'matches': JSON.stringify(null)
    },
    {
      'id': '5aa00919f780ab65cb1f8696',
      'name': 'Dunhao Zhuang',
      'citizenship': 'China',
      'residence': 'China',
      'outcome': 'PENDING',
      // eslint-disable-next-line no-undefined
      'matches': JSON.stringify(undefined)
    }
  ];
}

function createUrl(params: GetKycReportParams) {
  return 'admin/kycReport/?' + qs.stringify(params);
}

function createBody(/* params: GetKycReportParams */) {
  return;
}

const { reducer: getKycReportResult, action: getKycReportIfNeeded } = registerHttpAction(({
  name: 'GET_KYC_REPORT',
  getMock,
  method: 'get',
  createUrl,
  createBody
}: RegisterHttpActionParam<GetKycReportResult, GetKycReportParams>));

export type GetKycReportState = ActionState<GetKycReportResult, GetKycReportParams>

export {
  getKycReportResult,
  getKycReportIfNeeded
};
