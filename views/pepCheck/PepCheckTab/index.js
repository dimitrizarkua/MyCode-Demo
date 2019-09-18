import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../../redux/modules/actions';

import PepCheckTab from './PepCheckTab';

const mapStateToProps = (state) => {
  return {
    pepCheckResult: state.pepCheckResult
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        pepCheckIfNeeded: actions.pepCheckIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PepCheckTab);
