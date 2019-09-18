import assert from 'assert';
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { enterKyc, leaveKyc, KycActions } from '../../redux/modules/actions';
import KycAdmin from './kyc';

class KycAdminWrapper extends Component {
  static propTypes = {
    params: PropTypes.object
  }
  getComponentByType = (type/* , secType */) => {
    switch (type) {
      case 'kyc':
        return <KycAdmin {...this.props} />;
      default:
        assert(false, 'unknown kyc type');
        return null;
    }
  };

  render() {
    return this.getComponentByType(this.props.params.type);
  }
}

const mapStateToProps = (/* state */) => {
  return {
    params: { type: 'kyc' }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterKyc: () => dispatch(enterKyc()),
    leaveKyc: () => dispatch(leaveKyc()),

    // TODO: make use of redux
    getNextKyc: (query) => KycActions.getNextKYC(query),
    setKyc: ({ data }) => KycActions.setKYC(data),
    
    getKycSummary: (startDate) => KycActions.getKYCSummary(startDate),
    getKycReport: (startDate) => KycActions.getKYCReport(startDate)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KycAdminWrapper);
