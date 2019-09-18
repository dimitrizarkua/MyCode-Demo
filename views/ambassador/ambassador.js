// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Input, Button } from 'react-blur-admin';
import type { ApplyReferralBonusParams, ApplyReferralBonusState } from '../../redux/modules/ambassador';
import { validateEmail } from '../../services/validate';

import * as toastr from 'toastr';

type Props = {
  applyReferralBonusResult: ApplyReferralBonusState,
  actions: {
    enterAmbassador(): void,
    leaveAmbassador(): void,

    applyReferralBonusIfNeeded(params: ApplyReferralBonusParams): void
  }
};

type State = {|
  ambassadorEmail: string,
  ambassadorEmailValid: boolean | null,
  referralEmail: string,
  referralEmailValid: boolean | null
|};

export default class Ambassador extends PureComponent<Props, State> {
  static propTypes = {
    applyReferralBonusResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({
        result: PropTypes.bool,
        message: PropTypes.string
      }),
      error: PropTypes.string
    }).isRequired,
    actions: PropTypes.shape({
      enterAmbassador: PropTypes.func.isRequired,
      leaveAmbassador: PropTypes.func.isRequired,

      applyReferralBonusIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    ambassadorEmail: '',
    ambassadorEmailValid: null,
    referralEmail: '',
    referralEmailValid: null
  }


  componentWillMount() {
    const { actions: { enterAmbassador } } = this.props;
    enterAmbassador();
  }

  componentWillUnmount() {
    const { actions: { leaveAmbassador } } = this.props;
    leaveAmbassador();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.applyReferralBonusResult.isFetching === true) {
      if (nextProps.applyReferralBonusResult.isFetching === false) {
        if (!nextProps.applyReferralBonusResult.error) {
          const payload = nextProps.applyReferralBonusResult.payload;
          // flow is too stupid to realize that payload must not be null here
          const message = (payload && payload.message) || 'Referral bonus successfully applied';
          toastr.success(message);
        }
      }
    }
  }


  applyReferralBonus = () => {
    const {
      ambassadorEmail,
      ambassadorEmailValid,
      referralEmail,
      referralEmailValid
    } = this.state;
    const { actions: { applyReferralBonusIfNeeded } } = this.props;

    if (ambassadorEmailValid && referralEmailValid) {
      applyReferralBonusIfNeeded({ ambassadorEmail, referralEmail });
    } else {
      toastr.error('Fix validation errors');
    }
  }


  onChangeAmbassadorEmail = (e: Event) => {
    const { target } = e;
    if (target instanceof window.HTMLInputElement) {
      this.setState({ ambassadorEmail: target.value, ambassadorEmailValid: validateEmail(target.value) });
    } else {
      throw new Error('shouldn\'t happen');
    }
  }

  onChangeReferralEmail = (e: Event) => {
    const { target } = e;
    if (target instanceof window.HTMLInputElement) {
      this.setState({ referralEmail: target.value, referralEmailValid: validateEmail(target.value) });
    } else {
      throw new Error('shouldn\'t happen');
    }
  }


  render() {
    const { ambassadorEmail, referralEmail } = this.state;

    return (
      <Page title="Ambassador">
        <Panel title={'Form'}>
          <Row>
            <Col>
              <Input
                label="Ambassador email"
                value={ambassadorEmail}
                onChange={this.onChangeAmbassadorEmail}
                onValidate={validateEmail}
              />
            </Col>
            <Col>
              <Input
                label="Referral email"
                value={referralEmail}
                onChange={this.onChangeReferralEmail}
                onValidate={validateEmail}
              />
            </Col>
          </Row>
          <div className="row">
            <div className="col-12 larger" style={{textAlign: 'center'}}>
              <Button
                type={'primary'}
                isIconHidden={true}
                size="lg"
                title={'Apply referral bonus'}
                onClick={this.applyReferralBonus}
              />
            </div>
          </div>
        </Panel>
      </Page>
    );
  }
}
