// @flow weak

import React, {
  PureComponent
}                      from 'react';
import PropTypes       from 'prop-types';
import { Panel }       from 'react-blur-admin';


class Ticker extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    value:  PropTypes.number,
    symbol: PropTypes.string
  };


  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return (
      <div>
        <span className={'priceName'}>{this.props.name}</span>: {this.props.symbol}
        <span className={'priceValue'}>{this.props.value}</span>
      </div>
    );
  }
}

export default Ticker;
