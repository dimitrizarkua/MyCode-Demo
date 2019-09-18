import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';

import PepCheck from './pepCheck';

const mapStateToProps = (/* state */) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterPepCheck: actions.enterPepCheck,
        leavePepCheck: actions.leavePepCheck
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PepCheck);
