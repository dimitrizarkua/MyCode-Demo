// @flow weak

import { routerReducer }    from 'react-router-redux';
import { combineReducers }  from 'redux';
import dailyStats           from './dailyStats';
import saleStats            from './saleStats';
import sideMenu             from './sideMenu';
import userInfos            from './userInfos';
import views                from './views';
import userAuth             from './userAuth';
import searchResult         from './searchResult';
import updatePaymentResult  from './updatePayment';
import updateWalletResult   from './updateWallet';
import updateTokenbuyResult from './updateTokenbuy';
import { applyReferralBonusResult } from './ambassador';
import {
  getAdminsResult,
  addAdminResult,
  editAdminResult,
  deleteAdminResults,
  adminManagement
} from './adminManagement';
import {
  getKycReportResult,
  getKycReportCsvResult,
  getKycReportExcelResult,
  getKycReportHtmlResult,
  getKycSummaryResult
} from './kycReports';
import {
  pepCheckResult,
  findKycReportResult
} from './pepCheck';

export const reducers = {
  dailyStats,
  saleStats,
  sideMenu,
  userInfos,
  views,
  userAuth,

  // command panel
  searchResult,
  updatePaymentResult,
  updateWalletResult,
  updateTokenbuyResult,

  // ambassador
  applyReferralBonusResult,

  // admin management
  getAdminsResult,
  addAdminResult,
  editAdminResult,
  deleteAdminResults,
  adminManagement,

  // kyc reports
  getKycReportResult,
  getKycReportCsvResult,
  getKycReportExcelResult,
  getKycReportHtmlResult,
  getKycSummaryResult,

  // pep check
  pepCheckResult,
  findKycReportResult
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
