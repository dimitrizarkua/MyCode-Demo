// @flow weak

import moment from 'moment';

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import type { RouterHistory } from 'react-router';

import DatePicker from 'react-datepicker';

import formSerialize from 'form-serialize';

import { Page, Panel, Button } from 'react-blur-admin';
import Switch from '../../components/switch/SwitchComponent';

import Preview from './preview';
import { start } from 'pretty-error';
import * as toastr from 'toastr';

type KycModel = {

}

type Props = {
  history: RouterHistory,

  enterKyc: () => void,
  leaveKyc: () => void,

  getNextKyc: (query) => Promise<KycModel>,
  setKyc: (KycModel: KycModel) => Promise<void>,

  getKycSummary: (startDate) => Promise<any>,
  getKycReport: (startDate) => Promise<any>
}
const propTypes = {
  history: PropTypes.object.isRequired,

  enterKyc: PropTypes.func.isRequired,
  leaveKyc: PropTypes.func.isRequired,

  getNextKyc: PropTypes.func,
  setKyc: PropTypes.func
};

type State = {
  IDOK: boolean,
  POAOK: boolean,
  selectedDate: null | moment$Moment,
  userKYC: null | KycModel
}

const initialState: State = {
  IDOK: false,
  POAOK: false,
  selectedDate: null,
  userKYC: null
};

class KycAdmin extends PureComponent<Props, State> {
  static propTypes = propTypes

  state = initialState
  form: ?HTMLFormElement

  preventEnter = e => {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13)
      e.preventDefault();
  };

  componentDidMount() {
    window.addEventListener("keydown", this.preventEnter);
    if (!!this.props.location.search)
      this.getNextKYC({ id: this.props.location.search.replace("?", "") });
    else
      this.getNextKYC();
  }

  componentWillMount() {
    const { enterKyc } = this.props;
    enterKyc();
  }

  componentWillUnmount() {
    const { leaveKyc } = this.props;
    window.removeEventListener("keydown", this.preventEnter);
    leaveKyc();
  }

  getNextKYC = (query) => {
    const { getNextKyc, history } = this.props;

    return getNextKyc(query).then(result => {
      if (result) {
        this.setState({
          selectedDate: moment.utc(result.ID.providedData.DOB),
          userKYC: result,
          IDOK: result.ID.outcome == "OK",
          POAOK: result.POA.outcome == "OK"
        });
      } else
        this.setState(initialState);

      this.form && this.form.reset();
    }).catch(err => {
      toastr.error(err || 'Error get next KYC.');
    });
  }

  handleDateChange = (momentDate) => {
    this.setState({ selectedDate: momentDate });
  }

  toggleIDOK = () => {
    this.setState((prevState: State) => ({
      IDOK: !prevState.IDOK
    }));
  }

  togglePOAOK = () => {
    this.setState((prevState: State) => ({
      POAOK: !prevState.POAOK
    }));
  }

  formSubmit = (e) => {
    e.preventDefault();
    const data = formSerialize(e.target, { hash: true });

    const kyc = this.state.userKYC;

    const selectedDate = this.state.selectedDate ? this.state.selectedDate.toDate() : null;

    kyc.ID.providedData = {
      firstName: data.kycFirstName,
      lastName: data.kycLastName,
      DOB: selectedDate,
      gender: data.kycGender,
      nationality: data.kycCountry
    };
    kyc.ID.outcome = this.state.IDOK ? 'OK' : 'FAIL';
    kyc.ID.docType = data.kycIDType;
    kyc.ID.docNum = data.kycIDNum;

    kyc.POA.providedData = {
      street: data.kycStreet,
      street2: data.kycStreet2,
      city: data.kycLocality,
      state: data.kycRegion,
      zipCode: data.kycPostal,
      country: data.kycCountryResidence,
      fullAddress: data.kycFullAddress
    };
    kyc.POA.docType = data.kycPOAType;
    kyc.POA.outcome = this.state.POAOK ? 'OK' : 'FAIL';

    kyc.comment = data.kycComment;

    this.props.setKyc({
      data: kyc
    }).then(
      () => this.getNextKYC(),
      (err) => toastr.error(err || 'Error KYC submit.')
    );
  }


  render() {
    const { userKYC } = this.state;

    return (
      <Page title="Kyc">
        {!userKYC
          ? this.renderNoData()
          : this.renderForm()
        }
        {this.renderSearch()}
        {this.renderKYCBoss()}
      </Page>
    );
  }

  getKYCSummary = startDate => {
    this.props.getKycSummary(startDate).then(response => {
      const x = window.open();
      x.document.open();
      x.document.write(`<pre>${JSON.stringify(response.data.data, null, 1)}</pre>`);
      x.document.close();
    }, err => {
      toastr.error(err || 'Error get KYC summary.');
    });
  }

  getKYCReport = startDate => {
    this.props.getKycReport(startDate).then(response => {
      const x = window.open();
      x.document.open();
      x.document.write(response.data);
      x.document.close();
    }, err => {
      toastr.error(err || 'Error get KYC report.');
    });
  }

  renderKYCBoss() {
    return (
      <div className="col-md-12">
        <p>Only for da boss</p>
        <a onClick={() => this.getKYCSummary()} style={{ cursor: "pointer" }}>Weekly Summary</a><p />
        <a onClick={() => this.getKYCReport()} style={{ cursor: "pointer" }}>Weekly Report</a><p />
        <a onClick={() => this.getKYCSummary(1)} style={{ cursor: "pointer" }}>Summary since beginning</a><p />
        <a onClick={() => this.getKYCReport(1)} style={{ cursor: "pointer" }}>Report since beginning</a><p />
      </div>
    );
  }

  renderNoData() {
    return (
      <Panel>
        No KYC available.
      </Panel>
    );
  }

  searchSubmit = e => {
    e.preventDefault();
    this.getNextKYC({ email: formSerialize(e.target, { hash: true }).searchEmail });
  }

  renderSearch() {
    return (
      <form ref={form => this.searchForm = form} onSubmit={this.searchSubmit} >
        <div className="col-md-4">
          <label htmlFor="searchEmail">Search by email</label>
          <input type="text" className="form-control"
            id="searchEmail" name="searchEmail" required />
          <button type="submit" className="form-control primary fa fa-search fa-5x" />
        </div>
      </form>
    );
  }

  renderForm() {
    const { userKYC, selectedDate, IDOK, POAOK } = this.state;
    const faceUrl = userKYC.FACE.url || 'https://www.kathykuohome.com/Content/config/product/comp/zoom/product_9467_1.jpg';

    return (
      <form ref={(form) => this.form = form} onSubmit={this.formSubmit}>
        <div>
          <div className="row">
            <div className="col-md-6">
              <Panel title={'Personal Informations'}>
                <div className="row">
                  <div className="col-md-12" style={{ marginBottom: '20px' }}>
                    <img src={faceUrl} style={{ width: "100%" }} />
                  </div>
                </div>
                <Preview src={userKYC.ID.url} />
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="kycFirstName">First Name</label>
                    <input type="text"
                      className="form-control"
                      id="kycFirstName" name="kycFirstName"
                      defaultValue={userKYC.ID.providedData.firstName}
                      required />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="kycLastName">Last Name</label>
                    <input type="text"
                      className="form-control"
                      id="kycLastName" name="kycLastName"
                      defaultValue={userKYC.ID.providedData.lastName}
                      required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label htmlFor="kycGender">Gender</label>
                    <select
                      className="form-control"
                      id="kycGender" name="kycGender"
                      required >
                      <option value="Male" defaultSelected={userKYC.ID.docType == "Male"} >Male</option>
                      <option value="Female" defaultSelected={userKYC.ID.docType == "Female"} >Female</option>
                      <option value="Unspecified" defaultSelected={userKYC.ID.docType == "Unspecified"} >Other/Unspecified</option>
                    </select>
                  </div>

                  <div className="col-md-8 form-group">
                    <label htmlFor="kycBirthDate">Date of Birth</label>
                    <DatePicker
                      id="kycBirthDate"
                      selected={selectedDate}
                      onChange={this.handleDateChange}
                      showYearDropdown
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label htmlFor="kycCountry">Country of Citizenship</label>
                    <input type="text"
                      className="form-control"
                      defaultValue={userKYC.ID.providedData.nationality}
                      id="kycCountry" name="kycCountry" required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label htmlFor="kycIDType">Document type: </label>
                    <select
                      className="form-control"
                      id="kycIDType" name="kycIDType"
                      required
                    >
                      <option value="Passport" defaultSelected={userKYC.ID.docType == "Passport"} >Passport</option>
                      <option value="Driving license" defaultSelected={userKYC.ID.docType == "Driving license"} >Driving license</option>
                      <option value="National ID card" defaultSelected={userKYC.ID.docType == "National ID card"} >National ID card</option>
                    </select>
                  </div>
                  <div className="col-md-8 form-group">
                    <label htmlFor="kycIDNum">Document #:</label>
                    <input type="text"
                      className="form-control"
                      id="kycIDNum" name="kycIDNum"
                      defaultValue={userKYC.ID.docNum || ""}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 form-group">
                    {this.renderWarning()}
                  </div>
                </div>
                <div className="row larger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px' }}>
                  <Switch
                    size="large"
                    isOn={IDOK}
                    onLabel="ACCEPT"
                    offLabel="REJECT"
                    onChange={this.toggleIDOK}
                  />
                </div>
              </Panel>
            </div>
            <div className="col-md-6">
              <Panel title={'Address'}>
                <Preview src={userKYC.POA.url} />
                {this.renderAddress()}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="kycPOAType">Document type: </label>
                    <select
                      className="form-control"
                      id="kycPOAType" name="kycPOAType"
                      required
                    >
                      <option value="Bank statement" defaultSelected={userKYC.ID.docType == "Bank statement"} >Bank statement</option>
                      <option value="Utility bill" defaultSelected={userKYC.ID.docType == "Utility bill"} >Utility bill</option>
                      <option value="Credit card statement" defaultSelected={userKYC.ID.docType == "Credit card statement"} >Credit card statement</option>
                    </select>
                  </div>
                </div>
                <div className="row larger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px' }}>
                  <Switch
                    size="large"
                    isOn={POAOK}
                    onLabel="ACCEPT"
                    offLabel="REJECT"
                    onChange={this.togglePOAOK}
                  />
                </div>
              </Panel>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 larger" style={{ textAlign: 'center', padding: '30px' }}>
              <Button
                type={'primary'}
                isIconHidden={true}
                size="lg"
                title={'Confirm'}
              />
            </div>
          </div>
          {(!IDOK || !POAOK) && (
            <Panel title={'Comment'}>
              <div className="row">
                <div className="col-md-12 form-group">
                  <textarea
                    className="form-control"
                    id="kycComment" name="kycComment"
                    defaultValue={userKYC.comment}
                    rows="2" required />
                </div>
              </div>
            </Panel>
          )}
        </div>
      </form>
    );
  }

  renderWarning() {
    const { PEPSanctionsOutcome } = this.state.userKYC && this.state.userKYC.ID;
    return (PEPSanctionsOutcome && PEPSanctionsOutcome.length &&
      <div>
        <h4 style={{ color: "red", fontWeight: "bold" }} >WARNING: MATCHES IN THE DATABASE !</h4>
        <pre>{JSON.stringify(PEPSanctionsOutcome, null, 1)}</pre>
      </div>)
      || <h4>No matches found in PEP or International Sanctions databases !</h4>;
  }

  renderAddress() {
    const { userKYC } = this.state;

    if (userKYC.POA.providedData.fullAddress) {
      return (
        <div>
          <div className="col-md-12 form-group">
            <label htmlFor="kycFullAddress">Full Address</label>
            <textarea
              className="form-control"
              id="kycFullAddress" name="kycFullAddress" rows="6"
              defaultValue={userKYC.POA.providedData.fullAddress} required />
          </div>
          <div className="col-md-12 form-group">
            <label htmlFor="kycCountryResidence">Country of Residence</label>
            <input type="text" className="form-control"
              id="kycCountryResidence" name="kycCountryResidence"
              defaultValue={userKYC.POA.providedData.country} required />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-12 form-group">
            <label htmlFor="kycStreet">Street</label>
            <input type="text"
              className="form-control"
              id="kycStreet" name="kycStreet"
              defaultValue={userKYC.POA.providedData.street} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 form-group">
            <label htmlFor="kycStreet2">Street (line 2) </label>
            <input type="text"
              className="form-control"
              defaultValue={userKYC.POA.providedData.street2 || ""}
              id="kycStreet2" name="kycStreet2" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="kycLocality">Locality / City</label>
            <input type="text" className="form-control"
              id="kycLocality" name="kycLocality"
              defaultValue={userKYC.POA.providedData.city || ""}
              required />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="kycRegion">Region / State</label>
            <input type="text" className="form-control"
              defaultValue={userKYC.POA.providedData.state || ""}
              id="kycRegion" name="kycRegion" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 form-group">
            <label htmlFor="kycPostal">Postal Code</label>
            <input type="text" className="form-control"
              defaultValue={userKYC.POA.providedData.zipCode || ""}
              id="kycPostal" name="kycPostal" />
          </div>

          <div className="col-md-8 form-group">
            <label htmlFor="kycCountryResidence">Country of Residence</label>
            <input type="text" className="form-control"
              defaultValue={userKYC.POA.providedData.country}
              id="kycCountryResidence" name="kycCountryResidence" required />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(KycAdmin);
