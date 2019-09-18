import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';

import Ambassador from './ambassador';

const mapStateToProps = (state) => {
  return {
    applyReferralBonusResult:  state.applyReferralBonusResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterAmbassador: actions.enterAmbassador,
        leaveAmbassador: actions.leaveAmbassador,
        applyReferralBonusIfNeeded: actions.applyReferralBonusIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ambassador);
