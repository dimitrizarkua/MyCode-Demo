// @flow weak

import assert from 'assert';
import $ from 'jquery';
import _ from 'lodash';

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Input, Select, Button, Switch } from 'react-blur-admin';
import {
  TableComponent, PromiseComponent, ConfirmModalComponent, OverflowPopupComponent
} from '../../components';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import LogsModalComponent from './logsModalComponent';
import BalanceHistoryModalComponent from './balanceHistoryModalComponent';
import EditPaymentModalComponent from './editPaymentModalComponent';
import EditWalletModalComponent from './editWalletModalComponent';
import EditTokenbuyModalComponent from './editTokenbuyModalComponent';
import EditBalanceHistoryItemModalComponent from './editBalanceHistoryItemModalComponent';

class CommandPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      filter: 'name',
      isAdvancedMode: false,
      balanceHistoryWalletIdToDisplay: null
    };
  }

  componentWillMount() {
    const { actions: { enterCommandPanel } } = this.props;
    enterCommandPanel();
  }

  componentWillUnmount() {
    const { actions: { leaveCommandPanel } } = this.props;
    leaveCommandPanel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.needRefetch) {
      this.searchData();
    }
  }

  searchData = () => {
    this.props.actions.fetchSearchResultIfNeeded(
      this.state.filter,
      this.state.name
    );
  };

  queuePaymentForProcessing = async paymentId => {
    try {
      await this.awaitConfirmation();
    } catch(err) {
      if (!err) {
        // nothing wrong if user doesn't confirm, so trivial handler
        return;
      }
      throw err;
    }
    await this.props.actions.updatePaymentIfNeeded({
      _id: paymentId,
      manualProcessed: false
    });

    await this.searchData();
  }

  updatePayment = async (paymentId, payment) => {
    try {
      await this.awaitConfirmation('Are you sure you want to edit payment?');
    } catch(err) {
      if (!err) {
        // nothing wrong if user doesn't confirm, so trivial handler
        return;
      }
      throw err;
    }
    await this.props.actions.updatePaymentIfNeeded({
      ...payment,
      _id: paymentId
    });
  }

  updateWallet = async (walletId, wallet) => {
    try {
      await this.awaitConfirmation('Are you sure you want to edit wallet?');
    } catch(err) {
      if (!err) {
        // nothing wrong if user doesn't confirm, so trivial handler
        return;
      }
      throw err;
    }
    await this.props.actions.updateWalletIfNeeded({
      ...wallet,
      _id: walletId
    });
  }

  updateTokenbuy = async (tokenbuyId, tokenbuy) => {
    try {
      await this.awaitConfirmation('Are you sure you want to edit tokenbuy?');
    } catch(err) {
      if (!err) {
        // nothing wrong if user doesn't confirm, so trivial handler
        return;
      }
      throw err;
    }
    await this.props.actions.updateTokenbuyIfNeeded({
      ...tokenbuy,
      _id: tokenbuyId
    });
  }

  userData = () => {
    const { userInfo } = this.props;

    let userData = [];

    if (userInfo && userInfo._id) {
      userData = [
        [
          (userInfo.profile) ? userInfo.profile.username : '',
          userInfo.email,
          (userInfo.email_verified) ? 'True' : 'False',
          this.renderDate(userInfo.createdAt),
          userInfo.ips.toString(),
          userInfo._id
        ]
      ];
    } else {
      return { userHeadData: [], userData: [] };
    }

    const userHeadData = ['Name', 'Email', 'Email Verified', 'Created', 'IPs', 'UserId'];

    return { userHeadData, userData };
  }

  getPaymentHtmlId = (id) => {
    return `payment-${id}`;
  }

  getTokenBuyHtmlId = (id) => {
    return `tokenbuy-${id}`;
  }

  tokenBuysData = () => {
    const renderIdSpan = (id, content) => {
      return (
        // This is a marker for scrolling
        <span id={this.getTokenBuyHtmlId(id)}>{content}</span>
      );
    };

    const { tokenBuys } = this.props;
    let tokenBuysData = [];

    if (tokenBuys && tokenBuys.length) {
      tokenBuysData = tokenBuys.map(e => [
        e.coinAmount,
        e.coinPrice,
        e.creditAmount,
        e.creditPrice,
        e.currency || '',
        this.renderBoolean(e.credited),
        this.renderPaymentId(e.paymentId),
        e.purchaseAmount,
        this.renderCurrencyType(e.purchaseCurrency),
        renderIdSpan(e._id, this.renderDate(e.createdAt)),
        this.renderTokenbuyActions(e)
      ]);
    } else {
      return { tokenBuysHeadData: [], tokenBuysData: [] };
    }

    const tokenBuysHeadData = [
      'Coin Amount',
      'Coin Price',
      'Credit Amount',
      'Credit Price',
      'Currency',
      'Credited',
      'Payment ID',
      'Purchase Amount',
      'Purchase Currency',
      'Created',
      'Actions'
    ];

    return { tokenBuysHeadData, tokenBuysData };
  }

  walletsData = () => {
    const { wallets } = this.props;

    let walletsData = [];

    if (wallets && wallets.length) {
      walletsData = wallets.map(e => [
        e.balance,
        this.renderCurrencyType(e.currency),
        this.renderBoolean(e.disabled),
        e.label,
        e.newBalance,
        e.pendingBalance,
        this.renderDate(e.createdAt),
        this.renderUserWalletActions(e)
      ]);
    } else {
      return { walletsHeadData: [], walletsData: [] };
    }
    const walletsHeadData = [
      'Balance',
      'Currency',
      'Disabled',
      'Label',
      'New Balance',
      'Pending Balance',
      'Created',
      'Actions'
    ];
    return { walletsHeadData, walletsData };
  }

  renderPaymentActions = (payment) => {
    return (
      <div>
        {this.renderQueuePayment(payment)}
        {this.renderShowLogsPayment(payment)}
        {this.renderEditPayment(payment)}
      </div>
    );
  }

  renderUserWalletActions = (userwallet) => {
    return (
      <div>
        {this.renderShowBalanceHistory(userwallet)}
        {this.renderEditWallet(userwallet)}
      </div>
    );
  }

  renderBalanceHistoryItemActions = (userwallet, balanceHistoryItem) => {
    return (
      <div>
        {this.renderEditBalanceHistoryItem(userwallet, balanceHistoryItem)}
      </div>
    );
  }

  renderTokenbuyActions = (tokenbuy) => {
    return (
      <div>
        {this.renderEditTokenbuy(tokenbuy)}
      </div>
    );
  }

  paymentsData = () => {
    const renderIdSpan = (id, content) => {
      return (
        // This is a marker for scrolling
        <span id={this.getPaymentHtmlId(id)}>{content}</span>
      );
    };

    const { payments, tokenBuys } = this.props;

    const mapPaymentIdTokenBuyId = {};
    for (let tokenbuy of tokenBuys) {
      if (!tokenbuy.paymentId) {
        continue;
      }
      mapPaymentIdTokenBuyId[tokenbuy.paymentId] = tokenbuy._id;
    }

    let paymentsData = [];

    if (payments && payments.length) {
      paymentsData = payments.map(e => [
        this.renderCurrencyType(e.currency),
        !e.amount ? null : e.amount.gross,
        !e.amount ? null : e.amount.credited,
        this.renderBoolean(e.debited),
        this.renderBoolean(e.credited),
        this.renderBoolean(e.isValid),
        this.renderOverflowPopup(e.txHash, 'txHash'),
        this.renderOverflowPopup(e.address, 'Address'),
        this.renderDate(e.addressAssigned, true),
        this.renderTokenBuyId(mapPaymentIdTokenBuyId[e._id]),
        renderIdSpan(e._id, this.renderDate(e.createdAt)),
        this.renderPaymentActions(e)
      ]);
    } else {
      return { paymentsHeadData: [], paymentsData: [] };
    }
    const paymentsHeadData = [
      'Currency',
      'Amount Gross',
      'Amount Credited',
      'Debited',
      'Credited',
      'Valid',
      'txHash',
      'Address',
      'Address Assigned',
      'Tokenbuy ID',
      'Created',
      'Actions'
    ];

    return { paymentsHeadData, paymentsData };
  }

  highlightTableRow = (sel) => {
    const $element = $(sel);
    const $parent = $element.closest('tr').css('transition', 'box-shadow 1s');
    $parent.css('box-shadow', '0px 0px 25px red');
    setTimeout(() => {
      $parent.css('box-shadow', 'none');
    }, 1000);
  }

  highlightTokenBuy = (id) => {
    this.highlightTableRow('#'+this.getTokenBuyHtmlId(id));
  }

  highlightPayment = (id) => {
    const htmlId = this.getPaymentHtmlId(id);
    this.highlightTableRow('#'+htmlId);
    const element = document.getElementById(htmlId);
    if (element) {
      scrollToElementMiddle(element);
    }
  }

  renderPaymentId = (id) => {
    if (!id) {
      return null;
    }
    return (
      <span onClick={() => this.highlightPayment(id)}>
        {id}
      </span>
    );
  }

  renderTokenBuyId = (id) => {
    if (!id) {
      return null;
    }
    return (
      <span onClick={() => this.highlightTokenBuy(id)}>
        {this.renderOverflowPopup(id, 'Tokenbuy ID')}
      </span>
    );
  }

  renderCurrencyType = (currency) => {
    if (typeof currency === 'undefined' || currency === null) {
      return null;
    }
    const normalized = currency.toLowerCase();
    switch (normalized) {
    case 'btc':
      return 'bitcoin';
    case 'eth':
      return 'ethereum';
    case 'bch':
      return 'bitcoin-cash';
    case 'ltc':
      return 'litecoin';
    case 'xcm':
      return 'XCM';
    default:
      assert(false, `unknown currency type: ${normalized}`);
      return normalized.toUpperCase();
    }
  }

  renderOverflowPopup = (content, title) => {
    return (
      !content ?
        null :
        <OverflowPopupComponent title={title}>
          <span>{content}</span>
        </OverflowPopupComponent>
    );
  }

  renderBoolean = (bool) => {
    if (typeof bool === 'undefined' || bool === null) {
      return null;
    }
    return bool ? <i className="fa fa-check" /> : <i className="fa fa-times" />;
  }

  renderDate = (date, withPopup = false) => {
    if (!date) {
      return null;
    }
    if (withPopup) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
      const optionsFull = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      // eslint-disable-next-line no-undefined
      const fulldate = new Intl.DateTimeFormat(undefined, optionsFull).format(new Date(date));
      // eslint-disable-next-line no-undefined
      const partdate = new Intl.DateTimeFormat(undefined, options).format(new Date(date));
      const popover = (
        <Popover id={`popover-trigger-${_.uniqueId}`} title="Date">
          <span>{fulldate}</span>
        </Popover>
      );
      return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <span>{partdate}</span>
        </OverlayTrigger>
      );
    } else {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      // eslint-disable-next-line no-undefined
      return new Intl.DateTimeFormat(undefined, options).format(new Date(date));
    }
  }

  renderQueuePayment = (payment) => {
    if (!payment.credited && payment.manualProcessed !== false) {
      const buttonType = payment.debited ? 'default' : 'warning';

      return (<Button type={buttonType} title={'Queue processing'} onClick={() => this.queuePaymentForProcessing(payment._id)} />);
    } else if (payment.manualProcessed === false) {
      return 'Queued for processing';
    } else if (payment.manualProcessed === true) {
      return 'Processed';
    }
    return null;
  }

  renderShowLogsPayment = (payment) => {
    if (payment.logs && payment.logs.length) {
      return (<Button title={'Logs'} onClick={() => this.showPaymentLogs(payment)} />);
    } else {
      return null;
    }
  }

  renderEditPayment = (payment) => {
    assert(payment, 'payment must be present');

    if (this.state.isAdvancedMode) {
      return (<Button title={'Edit'} onClick={() => this.showEditPayment(payment)} />);
    } else {
      return null;
    }
  }

  renderEditWallet = (wallet) => {
    assert(wallet, 'wallet must be present');

    if (this.state.isAdvancedMode) {
      return (<Button title={'Edit'} onClick={() => this.showEditWallet(wallet)} />);
    } else {
      return null;
    }
  }

  renderEditBalanceHistoryItem = (wallet, balanceHistoryItem) => {
    assert(wallet, 'wallet must be present');
    assert(balanceHistoryItem, 'balanceHistoryItem must be present');

    if (this.state.isAdvancedMode) {
      return (<Button title={'Edit'} onClick={() => this.showEditBalanceHistoryItem(wallet, balanceHistoryItem)} />);
    } else {
      return null;
    }
  }

  renderEditTokenbuy = (tokenbuy) => {
    assert(tokenbuy, 'tokenbuy must be present');

    if (this.state.isAdvancedMode) {
      return (<Button title={'Edit'} onClick={() => this.showEditTokenbuy(tokenbuy)} />);
    } else {
      return null;
    }
  }

  renderShowBalanceHistory = (userwallet) => {
    if (userwallet.balanceHistory && userwallet.balanceHistory.length) {
      return (<Button title={'Balance History'} onClick={() => this.showWalletBalanceHistory(userwallet)} />);
    } else {
      return null;
    }
  }

  showPaymentLogs = (payment) => {
    assert(this.logsModal, 'modal component for logs is falsy');
    assert(payment.logs, 'payment logs must be present here');
    return this.logsModal.start({
      data: payment.logs.map(l => ([
        this.renderDate(l.timestamp), l.message
      ])),
      headData: ['Timestamp', 'Message']
    });
  }

  showEditPayment = payment => {
    assert(payment, 'payment must be present');
    assert(this.editPaymentModal, 'modal for editing payments must be present');

    this.editPaymentModal.start({
      payment: {
        amountCredited: payment.amount.credited,
        address: payment.address,
        txHash: payment.txHash,
        debited: payment.debited,
        credited: payment.credited
      }
    }).then(form => {
      return this.updatePayment(payment._id, {
        address: form.address,
        txHash: form.txHash,
        debited: form.debited,
        credited: form.credited,
        amount: {
          ...payment.amount,
          credited: form.amountCredited
        }
      });
    }, err => {
      if (err.code === 'CANCELLED_BY_USER') {
        /* no-op */
      } else {
        // TODO: show notification?
        throw err;
      }
    });
  }

  showEditWallet = wallet => {
    assert(wallet, 'wallet must be present');
    assert(this.editWalletModal, 'modal for editing wallets must be present');

    this.editWalletModal.start({
      wallet: {
        balance: wallet.balance
      }
    }).then(form => {
      return this.updateWallet(wallet._id, {
        balance: form.balance
      });
    }, err => {
      if (err.code === 'CANCELLED_BY_USER') {
        /* no-op */
      } else {
        // TODO: show notification?
        throw err;
      }
    });
  }

  showEditBalanceHistoryItem = (wallet, balanceHistoryItem) => {
    assert(wallet, 'wallet must be present');
    assert(balanceHistoryItem, 'balanceHistoryItem must be present');
    assert(this.editBalanceHistoryItemModal, 'modal for editing balance history item must be present');

    this.editBalanceHistoryItemModal.start({
      balanceHistoryItem: {
        newBalance: balanceHistoryItem.newBalance
      }
    }).then(form => {
      const balanceHistory = _.clone(wallet.balanceHistory);
      const newBalanceHistoryItem = balanceHistory.find(i => i._id === balanceHistoryItem._id);
      newBalanceHistoryItem.newBalance = form.newBalance;

      return this.updateWallet(wallet._id, {
        balanceHistory
      });
    }, err => {
      if (err.code === 'CANCELLED_BY_USER') {
        /* no-op */
      } else {
        // TODO: show notification?
        throw err;
      }
    });
  }

  showEditTokenbuy = tokenbuy => {
    assert(tokenbuy, 'tokenbuy must be present');
    assert(this.editTokenbuyModal, 'modal for editing tokenbuys must be present');

    this.editTokenbuyModal.start({
      tokenbuy: {
        purchaseAmount: tokenbuy.purchaseAmount,
        creditPrice: tokenbuy.creditPrice,
        creditAmount: tokenbuy.creditAmount,
        withdrawAddress: tokenbuy.withdrawAddress
      }
    }).then(form => {
      return this.updateTokenbuy(tokenbuy._id, {
        purchaseAmount: form.purchaseAmount,
        creditPrice: form.creditPrice,
        creditAmount: form.creditAmount,
        withdrawAddress: form.withdrawAddress
      });
    }, err => {
      if (err.code === 'CANCELLED_BY_USER') {
        /* no-op */
      } else {
        // TODO: show notification?
        throw err;
      }
    });
  }

  showWalletBalanceHistory = (userwallet) => {
    this.setState({ balanceHistoryWalletIdToDisplay: userwallet._id });
  }

  awaitConfirmation = (content) => {
    assert(this.confirmModal, 'modal component is falsy');
    return this.confirmModal.start({ content });
  }

  toggleAdvancedMode = () => {
    this.setState((prevState) => ({ isAdvancedMode: !prevState.isAdvancedMode }));
  }

  balanceHistoryData = (walletId) => {
    const { wallets } = this.props;
    let balanceHistoryHeadData = [];
    let balanceHistoryData = [];

    if (walletId) {
      const wallet = wallets.find(w => w._id === walletId);
      if (wallet) {
        balanceHistoryHeadData = [
          'Timestamp',
          'Payment ID',
          'New Balance',
          'Description',
          'Referral',
          'Actions'
        ];
        balanceHistoryData = wallet.balanceHistory.map(bh => ([
          this.renderDate(bh.timestamp),
          bh.paymentId,
          bh.newBalance,
          bh.description,
          bh.referral,
          this.renderBalanceHistoryItemActions(wallet, bh)
        ]));
      }
    }
    return {
      balanceHistoryHeadData, balanceHistoryData
    };
  }

  render() {
    const { balanceHistoryHeadData, balanceHistoryData } = this.balanceHistoryData(this.state.balanceHistoryWalletIdToDisplay);
    const { userHeadData, userData } = this.userData();
    const { tokenBuysHeadData, tokenBuysData } = this.tokenBuysData();
    const { paymentsHeadData, paymentsData } = this.paymentsData();
    const { walletsHeadData, walletsData } = this.walletsData();

    return (
      <Page title="Command Panel">

        <PromiseComponent ref={ref => (this.logsModal = ref)}>
          <LogsModalComponent />
        </PromiseComponent>
        <BalanceHistoryModalComponent
          show={!!this.state.balanceHistoryWalletIdToDisplay}
          resolve={() => this.setState({ balanceHistoryWalletIdToDisplay: null })}
          reject={() => this.setState({ balanceHistoryWalletIdToDisplay: null })}
          headData={balanceHistoryHeadData}
          data={balanceHistoryData} />
        <PromiseComponent ref={ref => (this.editPaymentModal = ref)}>
          <EditPaymentModalComponent />
        </PromiseComponent>
        <PromiseComponent ref={ref => (this.editWalletModal = ref)}>
          <EditWalletModalComponent />
        </PromiseComponent>
        <PromiseComponent ref={ref => (this.editTokenbuyModal = ref)}>
          <EditTokenbuyModalComponent />
        </PromiseComponent>
        <PromiseComponent ref={ref => (this.editBalanceHistoryItemModal = ref)}>
          <EditBalanceHistoryItemModalComponent />
        </PromiseComponent>
        {/* unfortunately, order of modal dialogs is important - the ones defined later will be shown on top */}
        {/* thats why confirm modal is shown last - in case it will be needed by other modals */}
        <PromiseComponent ref={ref => (this.confirmModal = ref)}>
          <ConfirmModalComponent content="Are you sure you want to force payment to be processed?" />
        </PromiseComponent>

        <Panel title={'Advanced mode'}>
          <Row>
            <Col>
              <Switch
                isOn={this.state.isAdvancedMode}
                onLabel="enabled"
                offLabel="disabled"
                onChange={() => this.toggleAdvancedMode()} />
            </Col>
          </Row>
        </Panel>
        <Panel title={'User search'}>
          <Row>
            <Col>
              <Input
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </Col>
            <Col>
              <Select
                placeholder={'By name'}
                isSearchable={true}
                value={this.state.filter}
                options={[
                  { value: 'name', label: 'By name' },
                  { value: 'email', label: 'By email' },
                  { value: 'userId', label: 'By userId' }
                ]}
                onChange={value => this.setState({ filter: value })}
              />
            </Col>
            <Col grow={false}>
              <Button type="success" title={'Search'} onClick={() => this.searchData()} />
            </Col>
          </Row>
        </Panel>

        <Panel title={'User Information'}>
          <Row>
            <Col>
              {userData.length > 0 && userData[0].length > 0 && (
                <TableComponent
                  headData={userHeadData}
                  data={userData}
                />
              )}
            </Col>
          </Row>
        </Panel>

        <Panel title={'Payment History'}>
          <Row>
            <Col>
              <TableComponent
                headData={paymentsHeadData}
                data={paymentsData}
                border={false}
              />
            </Col>
          </Row>
        </Panel>

        <Panel title={'Credit Information'}>
          <Row>
            <Col>
              <TableComponent
                headData={tokenBuysHeadData}
                data={tokenBuysData}
                border={false}
              />
            </Col>
          </Row>
        </Panel>

        <Panel title={'Wallet'}>
          <Row>
            <Col>
              <TableComponent
                headData={walletsHeadData}
                data={walletsData}
                border={false}
              />
            </Col>
          </Row>
        </Panel>
      </Page>
    );
  }
}

CommandPanel.propTypes = {
  userInfo: PropTypes.object,
  payments: PropTypes.array,
  tokenBuys: PropTypes.array,
  wallets: PropTypes.array,
  needRefetch: PropTypes.bool,

  errors: PropTypes.object,

  actions: PropTypes.shape({
    enterCommandPanel: PropTypes.func.isRequired,
    leaveCommandPanel: PropTypes.func.isRequired,

    fetchSearchResultIfNeeded: PropTypes.func.isRequired,
    updatePaymentIfNeeded: PropTypes.func.isRequired,
    updateWalletIfNeeded: PropTypes.func.isRequired,
    updateTokenbuyIfNeeded: PropTypes.func.isRequired
  })
};

export default CommandPanel;

function scrollToElementMiddle(element) {
  // specific to the way blur admin does cssing with the html, body overflow-x hidden and height 100%
  //  it causes to have scrolling on the body instead of the html, therefore we scrolling on the body here
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + document.body.scrollTop;
  const middle = absoluteElementTop - (window.innerHeight / 2);
  document.body.scrollTo(0, middle);
}
