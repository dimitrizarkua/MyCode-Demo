// this is a copy from https://github.com/knledg/react-blur-admin/blob/master/src/table-head.js
// with some modifications to allow proper size change

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class TableHeadComponent extends React.Component {
  static propTypes = {
    blackMutedBackground: PropTypes.bool,
    children: PropTypes.array,
    sortable: PropTypes.bool
  }

  static defaultProps = {
    blackMutedBackground: true
  }

  render() {
    const classes = cx({
      'black-muted-bg': this.props.blackMutedBackground,
      'sortable': this.props.sortable
    });

    return (
      <thead>
        <tr className={classes}>
          {this.props.children}
        </tr>
      </thead>
    );
  }
}
