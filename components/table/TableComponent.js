// @flow

import React, {
  PureComponent
}                                                   from 'react';
import PropTypes                                    from 'prop-types';
import { Table, TableBody, TableRow }               from 'react-blur-admin';
import TableHeadComponent                           from './TableHeadComponent';

type Props<T: React$Node> = {
  headData: Array<React$Node>,
  data: Array<Array<T>>,
  widthColumns?: Array<string | null>,
  border: boolean,
  onSort?: Array<?(asc: ?boolean) => void>
}

type State = {|
  sortColumnIndex: ?number,
  sortOrderAsc: ?boolean
|}

class TableComponent<T: React$Node> extends PureComponent<Props<T>, State> {
  static propTypes = {
    headData: PropTypes.array,
    widthColumns: PropTypes.array,
    data: PropTypes.array,
    border: PropTypes.bool,
    onSort: PropTypes.array
  }

  static defaultProps = {
    border: false,
    sortable: false
  }

  state: State = {
    sortColumnIndex: null,
    sortOrderAsc: null
  }

  componentDidMount() {

  }

  // componentWillReceiveProps(newProps) {
  //   // TODO
  // }

  isSortable(onSort: ?Array<?(asc: ?boolean) => void> = this.props.onSort, index?: number) {
    if (!onSort || !onSort.some(f => f)) {
      return false;
    }
    if (typeof index !== 'undefined') {
      return !!onSort[index];
    }
    return true;
  }

  getNextSortOrder(newSortIndex: number, oldSortIndex: ?number = this.state.sortColumnIndex, oldSortOrderAsc: ?boolean = this.state.sortOrderAsc) {
    if (newSortIndex === oldSortIndex) {
      if (oldSortOrderAsc === null) {
        return true;
      } else if (oldSortOrderAsc === true) {
        return false;
      } else {
        return null;
      }
    } else {
      return true;
    }
  }

  factoryForSortColumn(index: number) {
    return (/* e: Event */) => {
      this.setState(({
        sortColumnIndex,
        sortOrderAsc
      }) => ({
        sortColumnIndex: index,
        sortOrderAsc: this.getNextSortOrder(index, sortColumnIndex, sortOrderAsc)
      }), () => {
        if (index === this.state.sortColumnIndex) {
          const onSort = this.props.onSort;
          if (onSort) {
            const actualOnSort = onSort[index];
            if (actualOnSort) {
              actualOnSort(this.state.sortOrderAsc);
            }
          }
        }
      });
    };
  }

  render() {
    if (this.props.data) {
      return (
        <Table border={this.props.border} style={{ tableLayout: this.props.widthColumns ? 'fixed': 'auto' }}>
          <TableHeadComponent sortable={this.isSortable(this.props.onSort)}>
            {
              this.props.headData.map((item: React$Node, index: number) => {
                if (this.isSortable(this.props.onSort, index)) {
                  let classes = '';
                  if (this.state.sortColumnIndex === index) {
                    if (this.state.sortOrderAsc === true) {
                      classes = classes + ' st-sort-ascent';
                    } else if (this.state.sortOrderAsc === false) {
                      classes = classes + ' st-sort-descent';
                    }
                  }
                  let width;
                  if (this.props.widthColumns) {
                    width = this.props.widthColumns[index];
                  }
                  return (
                    <th
                      onClick={this.factoryForSortColumn(index)}
                      className={classes}
                      style={{ width }}
                      key={index}
                    >{item}</th>
                  );
                } else {
                  return <th key={index}>{item}</th>;
                }
              })
            }
          </TableHeadComponent>
          <TableBody>
            {
              this.props.data.map(function (item: Array<T>, rowId: number) {
                const row = item.map(function (data: T, dataId: number) {
                  return <td key={dataId}>{data}</td>;
                });
                return (
                  <TableRow key={rowId}>
                    {row}
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      );
    } else {
      return (
        <h5>No Data Found...</h5>
      );
    }
  }
}

export default TableComponent;
