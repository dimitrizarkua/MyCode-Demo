// @flow

import _ from 'lodash';
import moment from 'moment';

import React, {
  // PureComponent,
  Component
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Button } from 'react-blur-admin';

import DatePicker from 'react-datepicker';

import {
  type GetKycReportParams,
  type GetKycReportResult,
  type GetKycReportState,

  type GetKycReportCsvParams,
  type GetKycReportCsvState,
  type GetKycReportExcelParams,
  type GetKycReportExcelState,
  type GetKycReportHtmlParams,
  type GetKycReportHtmlState,

  type GetKycSummaryParams,
  type GetKycSummaryState
} from '../../redux/modules/kycReports';
import {
  TableComponent
} from '../../components';
import ReportsTable from './ReportsTable';

import fileDownload from 'js-file-download';

type Props = {
  getKycReportResult: GetKycReportState,
  getKycReportCsvResult: GetKycReportCsvState,
  getKycReportExcelResult: GetKycReportExcelState,
  getKycReportHtmlResult: GetKycReportHtmlState,
  getKycSummaryResult: GetKycSummaryState,

  actions: {
    enterKycReports(): void,
    leaveKycReports(): void,

    getKycReportIfNeeded(params: GetKycReportParams): void,
    getKycReportCsvIfNeeded(params: GetKycReportCsvParams): void,
    getKycReportExcelIfNeeded(params: GetKycReportExcelParams): void,
    getKycReportHtmlIfNeeded(params: GetKycReportHtmlParams): void,
    getKycSummaryIfNeeded(params: GetKycSummaryParams): void
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
  startDate: null | moment$Moment,
  endDate: null | moment$Moment,
  reports: KycReportTableEntry[]
};

// using PureComponent here doesn't rerender on sort update, therefore Component
export default class KycReports extends Component<Props, State> {
  static propTypes = {
    getKycReportResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.array,
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    getKycReportCsvResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.string,
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    getKycReportExcelResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.string,
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    getKycReportHtmlResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.string,
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    getKycSummaryResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({
        averageTime: PropTypes.number,
        count: PropTypes.shape({
          OK: PropTypes.number,
          FAIL: PropTypes.number,
          PENDING: PropTypes.number,
          TOTAL: PropTypes.number
        })
      }),
      error: PropTypes.string,
      params: PropTypes.object
    }).isRequired,
    actions: PropTypes.shape({
      enterKycReports: PropTypes.func.isRequired,
      leaveKycReports: PropTypes.func.isRequired,

      getKycReportIfNeeded: PropTypes.func.isRequired,
      getKycReportCsvIfNeeded: PropTypes.func.isRequired,
      getKycReportExcelIfNeeded: PropTypes.func.isRequired,
      getKycReportHtmlIfNeeded: PropTypes.func.isRequired,
      getKycSummaryIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    startDate: null,
    endDate: null,
    reports: []
  }

  initialSort() {
    return {
      sortField: 'id',
      sortOrderAsc: true
    };
  }

  // lifecycle hooks
  componentWillMount() {
    const { actions: { enterKycReports } } = this.props;
    enterKycReports();

    this.getInfo();
  }

  componentWillUnmount() {
    const { actions: { leaveKycReports } } = this.props;
    leaveKycReports();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.getKycReportResult.isFetching === true) {
      if (nextProps.getKycReportResult.isFetching === false) {
        const sortOptions = this.initialSort();
        this.setState({
          reports: this.sortReports(this.mapKycReport(nextProps.getKycReportResult.payload || []), sortOptions.sortField, sortOptions.sortOrderAsc)
        });
      }
    }

    if (this.props.getKycReportCsvResult.isFetching === true) {
      if (nextProps.getKycReportCsvResult.isFetching === false && nextProps.getKycReportCsvResult.payload) {
        fileDownload(nextProps.getKycReportCsvResult.payload, `kycreports-${moment().format()}.csv`);
      }
    }

    if (this.props.getKycReportExcelResult.isFetching === true) {
      if (nextProps.getKycReportExcelResult.isFetching === false && nextProps.getKycReportExcelResult.payload) {
        fileDownload(nextProps.getKycReportExcelResult.payload, `kycreports-${moment().format()}.csv`);
      }
    }

    if (this.props.getKycReportHtmlResult.isFetching === true) {
      if (nextProps.getKycReportHtmlResult.isFetching === false && nextProps.getKycReportHtmlResult.payload) {
        fileDownload(nextProps.getKycReportHtmlResult.payload, `kycreports-${moment().format()}.html`);
      }
    }
  }

  // functions
  mapKycReport = (results: GetKycReportResult): KycReportTableEntry[] => {
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

  getKycSummary = (startDate: ?string, endDate: ?string) => {
    const { getKycSummaryIfNeeded } = this.props.actions;
    getKycSummaryIfNeeded({
      startDate,
      endDate
    });
  }

  getKycReport = (startDate: ?string, endDate: ?string) => {
    const { getKycReportIfNeeded } = this.props.actions;
    getKycReportIfNeeded({
      startDate,
      endDate
    });
  }

  getKycReportCsv = () => {
    const {
      startDate,
      endDate
    } = this.props.getKycReportResult.params;

    const { getKycReportCsvIfNeeded } = this.props.actions;

    // HACK: this approach is very memory-inefficient - all the csv data is
    //  stored in memory until page reload.
    getKycReportCsvIfNeeded({
      startDate,
      endDate
    });
  }

  getKycReportExcel = () => {
    const {
      startDate,
      endDate
    } = this.props.getKycReportResult.params;

    const { getKycReportExcelIfNeeded } = this.props.actions;

    // HACK: this approach is very memory-inefficient - all the csv data is
    //  stored in memory until page reload.
    getKycReportExcelIfNeeded({
      startDate,
      endDate
    });
  }

  getKycReportHtml = () => {
    const {
      startDate,
      endDate
    } = this.props.getKycReportResult.params;

    const { getKycReportHtmlIfNeeded } = this.props.actions;

    // HACK: this approach is very memory-inefficient - all the csv data is
    //  stored in memory until page reload.
    getKycReportHtmlIfNeeded({
      startDate,
      endDate
    });
  }

  getInfo = (startDate: ?moment$Moment = this.state.startDate, endDate: ?moment$Moment = this.state.endDate) => {
    const startDateDto = startDate ? startDate.format() : null;
    const endDateDto = endDate ? endDate.format() : null;

    this.getKycReport(startDateDto, endDateDto);
    this.getKycSummary(startDateDto, endDateDto);
  }

  sortReports = (reports: GetKycReportResult = this.state.reports, sortField: string, sortOrderAsc: boolean) => {
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

  applySortReports = (reports: GetKycReportResult, field: string, asc: ?boolean) => {
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
  onChangeStartDate = (momentDate: moment$Moment) => {
    this.setState({ startDate: momentDate });
  }

  onChangeEndDate = (momentDate: moment$Moment) => {
    this.setState({ endDate: momentDate });
  }

  onSubmitGetInfo = (e: Event) => {
    e.preventDefault();

    this.getInfo();
  }

  onClickDownloadCsv = () => {
    this.getKycReportCsv();
  }

  onClickDownloadExcel = () => {
    this.getKycReportExcel();
  }

  onClickDownloadHtml = () => {
    this.getKycReportHtml();
  }

  // render functions
  render() {
    const {
      startDate,
      endDate
    } = this.state;
    const {
      getKycSummaryResult
    } = this.props;

    return (
      <Page title="Kyc Reports">
        <Panel title="Form">
          <form onSubmit={this.onSubmitGetInfo}>
            <Row>
              <Col grow={false}>
                <DatePicker
                  selected={startDate}
                  placeholderText="Start Date"
                  onChange={this.onChangeStartDate}
                  showYearDropdown
                />
              </Col>
              <Col grow={false}>
                <DatePicker
                  selected={endDate}
                  placeholderText="End Date"
                  onChange={this.onChangeEndDate}
                  showYearDropdown
                />
              </Col>
              <Col grow={false}>
                <Button type="success" title="Go" />
              </Col>
            </Row>
          </form>
        </Panel>
        <Panel title="Summary">
          {this.renderKycSummary(getKycSummaryResult)}
        </Panel>
        <Panel title="Report">
          {this.renderKycReport()}
        </Panel>
      </Page>
    );
  }

  renderKycSummary(result: GetKycSummaryState) {
    if (result.isFetching) {
      return 'Fetching...';
    }

    if (result.error) {
      return `Failed to get summary information: ${result.error}`;
    }

    if (!result.payload) {
      return 'No summary information';
    }

    const data = [];
    data.push(['averageTime', result.payload.averageTime]);
    data.push(['OK', result.payload.count.OK]);
    data.push(['FAIL', result.payload.count.FAIL]);
    data.push(['PENDING', result.payload.count.PENDING]);
    data.push(['TOTAL', result.payload.count.TOTAL]);

    return (
      <Row>
        <Col>
          <TableComponent data={data} headData={[]} />
        </Col>
      </Row>
    );
  }

  renderKycReport() {
    const result = this.props.getKycReportResult;
    const getKycReportCsvResult = this.props.getKycReportCsvResult;
    const getKycReportExcelResult = this.props.getKycReportExcelResult;
    const getKycReportHtmlResult = this.props.getKycReportHtmlResult;
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
      <div>
        <Row>
          <Col grow={false}>
            <Button
              type="success"
              title={getKycReportCsvResult.isFetching ? 'Downloading' : 'Download csv'}
              disabled={getKycReportCsvResult.isFetching}
              onClick={this.onClickDownloadCsv}
            />
          </Col>
          <Col grow={false}>
            <Button
              type="success"
              title={getKycReportExcelResult.isFetching ? 'Downloading' : 'Download excel'}
              disabled={getKycReportExcelResult.isFetching}
              onClick={this.onClickDownloadExcel}
            />
          </Col>
          <Col>
            <Button
              type="success"
              title={getKycReportHtmlResult.isFetching ? 'Downloading' : 'Download html'}
              disabled={getKycReportHtmlResult.isFetching}
              onClick={this.onClickDownloadHtml}
            />
          </Col>
        </Row>

        <ReportsTable reports={reports} applySortReports={this.applySortReports} />
      </div>
    );
  }
}
