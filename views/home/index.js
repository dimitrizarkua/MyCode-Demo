// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import Home                   from './Home';

const mapStateToProps = (state) => {
  return {
    currentView:            state.views.currentView,
    dailyStatsIsFetching:   state.dailyStats.isFetching,
    dailyTokenSold:         state.dailyStats.dailyTokenSold,
    saleStats:              state.saleStats.data,
    quotes:                 state.saleStats.quotes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterHome: actions.enterHome,
        leaveHome: actions.leaveHome,

        fetchDailyStatsDataIfNeeded: actions.fetchDailyStatsIfNeeded,
        fetchSaleStatsDataIfNeeded: actions.fetchSaleStatsDataIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
