// @flow

import _ from 'lodash';

import React, {
  // PureComponent,
  Component
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Input, Button, Switch } from 'react-blur-admin';

import {
  type FindKycReportParams,
  type FindKycReportResult,
  type FindKycReportState
} from '../../../redux/modules/pepCheck';
import ReportsTable from '../../kycReports/ReportsTable';

type Props = {
  findKycReportResult: FindKycReportState,

  actions: {
    findKycReportIfNeeded(params: FindKycReportParams): void
  }
};

type KycReportMatchDetails = {};

type KycReportTableEntry = {
  'id': string,
  'docNum': string,
  'sentOn': string,  // date
  'solvedOn': string, // date
  'solvedBy': string,
  'comment': string,
  'name': string,
  'citizenship': string,
  'residence': string,
  'outcome': "PENDING" | "FAIL" | "OK",
  'match': string,
  'matchDetails': null | KycReportMatchDetails
};

type State = {
  fullName: string,
  address: string,
  byFullName: boolean,
  reports: KycReportTableEntry[]
};

// using PureComponent here doesn't rerender on sort update, therefore Component
export default class FindKycReportTab extends Component<Props, State> {
  static propTypes = {
    findKycReportResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.array,
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      findKycReportIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    fullName: '',
    address: '',
    byFullName: true,
    reports: []
  }

  initialSort() {
    return {
      sortField: 'id',
      sortOrderAsc: true
    };
  }

  // lifecycle hooks
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.findKycReportResult.isFetching === true) {
      if (nextProps.findKycReportResult.isFetching === false) {
        const sortOptions = this.initialSort();
        this.setState({
          reports: this.sortReports(this.mapKycReport(nextProps.findKycReportResult.payload || []), sortOptions.sortField, sortOptions.sortOrderAsc)
        });
      }
    }
  }

  // functions
  mapKycReport = (results: FindKycReportResult): KycReportTableEntry[] => {
    return _.flatMap(results, (entry) => {
      const fields = ['id', 'name', 'citizenship', 'residence', 'docNum', 'sentOn', 'solvedOn', 'solvedBy', 'outcome', 'comment'];
      if (!entry.matches) {
        return [{
          ..._.pick(entry, fields),
          match: '',
          matchDetails: null
        }];
      }
      const matches = JSON.parse(entry.matches);
      if (!matches || matches.length === 0) {
        return [{
          ..._.pick(entry, fields),
          match: '',
          matchDetails: null
        }];
      }
      return matches.map((match) => ({
        ..._.pick(entry, fields),
        match: match.name,
        matchDetails: match
      }));
    });
  }

  findKycReport = (fullName: string = this.state.fullName, address: string = this.state.address) => {
    const { findKycReportIfNeeded } = this.props.actions;
    findKycReportIfNeeded({
      fullName,
      address
    });
  }

  sortReports = (reports: FindKycReportResult = this.state.reports, sortField: string, sortOrderAsc: boolean) => {
    return reports.sort((a, b) => {
      let res;
      if (a[sortField] > b[sortField]) {
        res = 1;
      } else if (a[sortField] < b[sortField]) {
        res = -1;
      } else {
        res = 0;
      }
      return res * (sortOrderAsc ? 1 : -1);
    });
  }

  applySortReports = (reports: FindKycReportResult, field: string, asc: ?boolean) => {
    if (asc === null || typeof asc === 'undefined') {
      const initialSort = this.initialSort();
      this.setState({
        reports: this.sortReports(reports, initialSort.sortField, initialSort.sortOrderAsc)
      });
    } else {
      this.setState({
        reports: this.sortReports(reports, field, asc)
      });
    }
  }

  // event handlers
  onChangeFullName = (e: SyntheticEvent<HTMLInputElement>) => {
    const fullName = e.currentTarget.value;

    this.setState({ fullName });
  }

  onChangeAddress = (e: SyntheticEvent<HTMLInputElement>) => {
    const address = e.currentTarget.value;

    this.setState({ address });
  }

  onValidateFullName = () => !!this.state.fullName

  onValidateAddress = () => !!this.state.address

  onSubmitFindKycReport = (e: Event) => {
    e.preventDefault();

    this.findKycReport();
  }

  toggleInputMode = () => this.setState(prevState => ({ byFullName: !prevState.byFullName }))

  // render functions
  render() {
    const {
      fullName,
      address,
      byFullName
    } = this.state;
    const {
      findKycReportResult
    } = this.props;

    const isValid = !!fullName || !!address;
    const isFetching = findKycReportResult.isFetching;

    return (
      <div>
        <form onSubmit={this.onSubmitFindKycReport}>
          <Row>
            <Col>
              <Switch
                isOn={byFullName}
                onLabel="by Full name"
                offLabel="by Address"
                onChange={this.toggleInputMode}
              />
            </Col>
          </Row>
          <Row>
            {byFullName && <Col>
              <Input
                value={fullName}
                placeholder="Full name"
                onValidate={this.onValidateFullName}
                onChange={this.onChangeFullName}
              />
            </Col>}
            {!byFullName && <Col>
              <Input
                value={address}
                placeholder="Address"
                onValidate={this.onValidateAddress}
                onChange={this.onChangeAddress}
              />
            </Col>}
            <Col grow={false}>
              <Button type="success" title="Go" disabled={isFetching || !isValid}/>
            </Col>
          </Row>
        </form>
        {this.renderResults()}
      </div>
    );
  }

  renderResults() {
    const result = this.props.findKycReportResult;
    const reports = this.state.reports;

    if (result.isFetching) {
      return 'Fetching...';
    }

    if (result.error) {
      return `Failed to get report information: ${result.error}`;
    }

    if (!reports || reports.length === 0) {
      return 'No reports information';
    }

    return (
      <ReportsTable reports={reports} applySortReports={this.applySortReports} />
    );
  }
}
