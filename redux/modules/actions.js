export {fetchDailyStatsIfNeeded} from './dailyStats';
export {fetchSaleStatsDataIfNeeded} from './saleStats';
export {fetchSearchResultDataIfNeeded} from './searchResult';
export {applyReferralBonusIfNeeded} from './ambassador';
export {
  getAdminsIfNeeded,
  addAdminIfNeeded,
  editAdminIfNeeded,
  deleteAdminIfNeeded
} from './adminManagement';
export {updatePaymentIfNeeded} from './updatePayment';
export {updateWalletIfNeeded} from './updateWallet';
export {updateTokenbuyIfNeeded} from './updateTokenbuy';

export {
  getKycReportIfNeeded,
  getKycReportCsvIfNeeded,
  getKycReportExcelIfNeeded,
  getKycReportHtmlIfNeeded,
  getKycSummaryIfNeeded
} from './kycReports';
export {KycActions} from './kycActions';
export { pepCheckIfNeeded, findKycReportIfNeeded } from './pepCheck';

// sideMenu:
export {
  openSideMenu,
  closeSideMenu,
  toggleSideMenu,
  getSideMenuCollpasedStateFromLocalStorage
}                                      from './sideMenu';
// userInfos:
export {fetchUserInfoDataIfNeeded}     from './userInfos';
// views:
export {
  enterHome,
  leaveHome,

  enterCommandPanel,
  leaveCommandPanel,

  enterAmbassador,
  leaveAmbassador,

  enterAdminManagement,
  leaveAdminManagement,

  enterCalculatorPanel,
  leaveCalculatorPanel,

  enterLogin,
  leaveLogin,

  enterKyc,
  leaveKyc,

  enterKycReports,
  leaveKycReports,

  enterPepCheck,
  leavePepCheck
}                                     from './views';
