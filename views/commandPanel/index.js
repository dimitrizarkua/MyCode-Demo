// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import CommandPanel           from './commandPanel';

const mapStateToProps = (state) => {
  let needRefetch = false;
  if (state.updatePaymentResult && state.updatePaymentResult.isFetching === false) {
    if (state.updatePaymentResult.time > state.searchResult.time) {
      needRefetch = true;
    }
  }
  if (state.updateWalletResult && state.updateWalletResult.isFetching === false) {
    if (state.updateWalletResult.time > state.searchResult.time) {
      needRefetch = true;
    }
  }
  if (state.updateTokenbuyResult && state.updateTokenbuyResult.isFetching === false) {
    if (state.updateTokenbuyResult.time > state.searchResult.time) {
      needRefetch = true;
    }
  }

  return {
    currentView:  state.views.currentView,
    userInfo:     state.searchResult.userInfo,
    payments:     state.searchResult.payments,
    tokenBuys:    state.searchResult.tokenBuys,
    wallets:      state.searchResult.wallets,
    needRefetch:  needRefetch
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterCommandPanel: actions.enterCommandPanel,
        leaveCommandPanel: actions.leaveCommandPanel,

        fetchSearchResultIfNeeded: actions.fetchSearchResultDataIfNeeded,
        updatePaymentIfNeeded: actions.updatePaymentIfNeeded,
        updateWalletIfNeeded: actions.updateWalletIfNeeded,
        updateTokenbuyIfNeeded: actions.updateTokenbuyIfNeeded
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommandPanel);
