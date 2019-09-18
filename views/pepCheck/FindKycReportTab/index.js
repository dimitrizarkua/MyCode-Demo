import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../../redux/modules/actions';

import FindKycReportTab from './FindKycReportTab';

const mapStateToProps = (state) => {
  return {
    findKycReportResult: state.findKycReportResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        findKycReportIfNeeded: actions.findKycReportIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindKycReportTab);
