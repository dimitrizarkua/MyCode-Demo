// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import CalculatorPanel           from './calculatorPanel';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    saleStats:    state.saleStats
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterCalculatorPanel: actions.enterCalculatorPanel,
        leaveCalculatorPanel: actions.leaveCalculatorPanel
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculatorPanel);
