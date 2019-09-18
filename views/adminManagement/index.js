// @flow

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../redux/modules/actions';

import AdminManagement from './adminManagement';

const mapStateToProps = (state) => {
  return {
    ...state.adminManagement,

    getAdminsResult: state.getAdminsResult,
    addAdminResult: state.addAdminResult,
    editAdminResult: state.editAdminResult,
    deleteAdminResults: state.deleteAdminResults
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        enterAdminManagement: actions.enterAdminManagement,
        leaveAdminManagement: actions.leaveAdminManagement,

        getAdminsIfNeeded: actions.getAdminsIfNeeded,
        addAdminIfNeeded: actions.addAdminIfNeeded,
        editAdminIfNeeded: actions.editAdminIfNeeded,
        deleteAdminIfNeeded: actions.deleteAdminIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminManagement);
