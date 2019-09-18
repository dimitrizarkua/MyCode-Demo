import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';

import KycReports from './kycReports';

const mapStateToProps = (state) => {
  return {
    getKycReportResult: state.getKycReportResult,
    getKycReportCsvResult: state.getKycReportCsvResult,
    getKycReportExcelResult: state.getKycReportExcelResult,
    getKycReportHtmlResult: state.getKycReportHtmlResult,
    getKycSummaryResult: state.getKycSummaryResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterKycReports: actions.enterKycReports,
        leaveKycReports: actions.leaveKycReports,

        getKycReportIfNeeded: actions.getKycReportIfNeeded,
        getKycReportCsvIfNeeded: actions.getKycReportCsvIfNeeded,
        getKycReportExcelIfNeeded: actions.getKycReportExcelIfNeeded,
        getKycReportHtmlIfNeeded: actions.getKycReportHtmlIfNeeded,
        getKycSummaryIfNeeded: actions.getKycSummaryIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KycReports);
