// @flow

import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Input, Button } from 'react-blur-admin';

import {
  type Sanction,
  type PepCheckParams,
  type PepCheckResult,
  type PepCheckState
} from '../../../redux/modules/pepCheck';
import {
  TableComponent,
  ModalComponent
} from '../../../components';

type Props = {
  pepCheckResult: PepCheckState,

  actions: {
    pepCheckIfNeeded(params: PepCheckParams): void
  }
};

type PepCheckMatchDetails = Sanction;

type State = {
  fullName: string,
  matches: PepCheckMatchDetails[],
  matchToShow: null | PepCheckMatchDetails
};

// using PureComponent here doesn't rerender on sort update (sorts in-place), therefore Component
export default class PepCheck extends Component<Props, State> {
  static propTypes = {
    pepCheckResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.array,
      error: PropTypes.string,
      params: PropTypes.object
    }),

    actions: PropTypes.shape({
      pepCheckIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    fullName: '',
    matches: [],
    matchToShow: null
  }

  initialSort() {
    return {
      sortField: 'id',
      sortOrderAsc: true
    };
  }

  // lifecycle hooks
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.pepCheckResult.isFetching === true) {
      if (nextProps.pepCheckResult.isFetching === false) {
        const sortOptions = this.initialSort();
        this.setState({
          matches: this.sortMatches(this.mapMatch(nextProps.pepCheckResult.payload || []), sortOptions.sortField, sortOptions.sortOrderAsc)
        });
      }
    }
  }

  // functions
  mapMatch = (results: PepCheckResult): PepCheckMatchDetails[] => {
    return results;
  }

  pepCheck = (fullName: string) => {
    const { pepCheckIfNeeded } = this.props.actions;
    pepCheckIfNeeded({ fullName });
  }

  getInfo = (fullName: string = this.state.fullName) => {
    this.pepCheck(fullName);
  }

  sortMatches = (matches: PepCheckResult = this.state.matches, sortField: string, sortOrderAsc: boolean) => {
    return matches.sort((a, b) => {
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

  applySortReports = (matches: PepCheckResult, field: string, asc: ?boolean) => {
    if (asc === null || typeof asc === 'undefined') {
      const initialSort = this.initialSort();
      this.setState({
        matches: this.sortMatches(matches, initialSort.sortField, initialSort.sortOrderAsc)
      });
    } else {
      this.setState({
        matches: this.sortMatches(matches, field, asc)
      });
    }
  }

  // event handlers
  onValidateFullName = () => !!this.state.fullName

  onChangeFullName = (e: SyntheticEvent<HTMLInputElement>) => {
    const fullName = e.currentTarget.value;

    this.setState({ fullName });
  }

  onSubmitGetInfo = (e: Event) => {
    e.preventDefault();

    this.getInfo();
  }

  // render functions
  render() {
    const {
      fullName
    } = this.state;
    const {
      pepCheckResult
    } = this.props;

    const isValid = !!fullName;
    const isFetching = pepCheckResult.isFetching;

    return (
      <div>
        <form onSubmit={this.onSubmitGetInfo}>
          <Row>
            <Col>
              <Input
                value={fullName}
                placeholder="Full name"
                onValidate={this.onValidateFullName}
                onChange={this.onChangeFullName}
              />
            </Col>
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
    const result = this.props.pepCheckResult;
    const matches = this.state.matches;
    const matchToShow = this.state.matchToShow;

    if (result.isFetching) {
      return 'Fetching...';
    }

    if (result.error) {
      return `Failed to pep check: ${result.error}`;
    }

    if (!matches || matches.length === 0) {
      return 'No matches';
    }

    const schema = {
      'id': {
        display: 'Id',
        render: entry => entry.id,
        onSort: (asc: ?boolean) => this.applySortReports(matches, 'id', asc),
        width: null
      },
      'name': {
        display: 'Name',
        render: entry => entry.name,
        onSort: (asc: ?boolean) => this.applySortReports(matches, 'name', asc),
        width: null
      },
      'source': {
        display: 'Source',
        render: entry => entry.source,
        onSort: (asc: ?boolean) => this.applySortReports(matches, 'source', asc),
        width: null
      },
      'timestamp': {
        display: 'Timestamp',
        render: entry => entry.timestamp,
        onSort: (asc: ?boolean) => this.applySortReports(matches, 'timestamp', asc),
        width: null
      },
      'match': {
        display: 'Match',
        render: entry => (
          <div>
            {entry && <Button
              type="info"
              title=""
              onClick={() => this.setState({ matchToShow: entry })}
            />}
          </div>
        ),
        onSort: null,
        width: null
      }
    };

    const data = matches.map(entry => Object.keys(schema).map(k => schema[k].render(entry)));
    const headData = Object.keys(schema).map(k => schema[k].display);
    const onSort = Object.keys(schema).map(k => schema[k].onSort);
    const widthColumns = Object.keys(schema).map(k => schema[k].width);

    return (
      <div>
        <ModalComponent
          type="info"
          title="Match Details"
          isOpen={matchToShow !== null}
          onClose={() => this.setState({ matchToShow: null })}
        >
          <pre>{JSON.stringify(matchToShow, null, 2)}</pre>
        </ModalComponent>

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
      </div>
    );
  }
}
