// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Page, Tabs, Tab } from 'react-blur-admin';

import PepCheckTab from './PepCheckTab';
import FindKycReportTab from './FindKycReportTab';

type Props = {
  actions: {
    enterPepCheck(): void,
    leavePepCheck(): void
  }
};

type State = {
  tab: number
};

export default class PepCheck extends PureComponent<Props, State> {
  static propTypes = {
    actions: PropTypes.shape({
      enterPepCheck: PropTypes.func.isRequired,
      leavePepCheck: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    tab: 0
  }

  // lifecycle hooks
  componentWillMount() {
    const { actions: { enterPepCheck } } = this.props;
    enterPepCheck();
  }

  componentWillUnmount() {
    const { actions: { leavePepCheck } } = this.props;
    leavePepCheck();
  }

  // functions

  // event handlers

  // render functions
  render() {
    return (
      <Page title="Pep Check">
        <Tabs>
          <Tab name="pepCheck" title="By Name">
            <PepCheckTab />
          </Tab>
          <Tab name="findKycReport" title="Find KYC">
            <FindKycReportTab />
          </Tab>
        </Tabs>
      </Page>
    );
  }
}
