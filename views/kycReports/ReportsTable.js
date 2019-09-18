// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Button } from 'react-blur-admin';

import { compose, pure, withStateHandlers, wrapDisplayName, setDisplayName, type HOC } from 'recompose';

import {
  TableComponent,
  ModalComponent
} from '../../components';

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

type EnhancedProps = {
  reports: KycReportTableEntry[],
  applySortReports: (reports: KycReportTableEntry[], field: $Keys<KycReportTableEntry>, asc: ?boolean) => void,
};

const withModal = Component => {
  const initialState: { matchToShow: null | KycReportMatchDetails} = { matchToShow: null };

  return compose(
    withStateHandlers(
      initialState,
      { showMatch: () => matchToShow => ({ matchToShow }) }
    ),
    setDisplayName(wrapDisplayName(Component, 'withModal'))
  )(({ matchToShow, showMatch, ...props }) => (
    <div>
      <ModalComponent
        type="info"
        title="Match Details"
        isOpen={matchToShow !== null}
        onClose={() => showMatch(null)}
      >
        <pre>{JSON.stringify(matchToShow, null, 2)}</pre>
      </ModalComponent>
      <Component {...props} showMatch={showMatch} />
    </div>
  ));
};

const enhance: HOC<*, EnhancedProps> = compose(
  withModal,
  pure
);

const ReportsTable = ({ reports, applySortReports, showMatch }) => {
  const schema = {
    'id': {
      display: 'Id',
      render: entry => entry.id,
      onSort: (asc: ?boolean) => applySortReports(reports, 'id', asc),
      width: '200px'
    },
    'docNum': {
      display: 'Doc Num',
      render: entry => entry.docNum,
      onSort: (asc: ?boolean) => applySortReports(reports, 'docNum', asc),
      width: '100px'
    },
    'name': {
      display: 'Name',
      render: entry => entry.name,
      onSort: (asc: ?boolean) => applySortReports(reports, 'name', asc),
      width: '100px'
    },
    'match': {
      display: 'Match Name',
      render: entry => (
        <div>
          {entry.matchDetails && <Button
            type="info"
            title=""
            onClick={() => showMatch(entry.matchDetails)}
          />}
          {entry.match}
        </div>
      ),
      onSort: (asc: ?boolean) => applySortReports(reports, 'match', asc),
      width: '100px'
    },
    'citizenship': {
      display: 'Citizenship',
      render: entry => entry.citizenship,
      onSort: (asc: ?boolean) => applySortReports(reports, 'citizenship', asc),
      width: '80px'
    },
    'residence': {
      display: 'Residence',
      render: entry => entry.residence,
      onSort: (asc: ?boolean) => applySortReports(reports, 'residence', asc),
      width: '80px'
    },
    'outcome': {
      display: 'Outcome',
      render: entry => entry.outcome,
      onSort: (asc: ?boolean) => applySortReports(reports, 'outcome', asc),
      width: '80px'
    },
    'sentOn': {
      display: 'Sent On',
      render: entry => entry.sentOn,
      onSort: (asc: ?boolean) => applySortReports(reports, 'sentOn', asc),
      width: '200px'
    },
    'solvedOn': {
      display: 'Solved On',
      render: entry => entry.solvedOn,
      onSort: (asc: ?boolean) => applySortReports(reports, 'solvedOn', asc),
      width: '200px'
    },
    'solvedBy': {
      display: 'Solved By',
      render: entry => entry.solvedBy,
      onSort: (asc: ?boolean) => applySortReports(reports, 'solvedBy', asc),
      width: '150px'
    },
    'comment': {
      display: 'Comment',
      render: entry => entry.comment,
      onSort: (asc: ?boolean) => applySortReports(reports, 'comment', asc),
      width: '500px'
    }
  };

  const data = reports.map(entry => Object.keys(schema).map(k => schema[k].render(entry)));
  const headData = Object.keys(schema).map(k => schema[k].display);
  const onSort = Object.keys(schema).map(k => schema[k].onSort);
  const widthColumns = Object.keys(schema).map(k => schema[k].width);

  return (
    <Row>
      <div style={{ width: '100%' }}>
        <Col grow={false} shrink={false} basis={'100%'}>
          <TableComponent
            onSort={onSort}
            headData={headData}
            widthColumns={widthColumns}
            data={data}
          />
        </Col>
      </div>
    </Row>
  );
};

ReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
  applySortReports: PropTypes.func.isRequired,
  showMatch: PropTypes.func.isRequired
};

export default enhance(ReportsTable);
