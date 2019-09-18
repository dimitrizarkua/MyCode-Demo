// @flow weak

import React, {
  PureComponent
}                      from 'react';
import PropTypes       from 'prop-types';
import { Panel }       from 'react-blur-admin';
import Ticker          from './ticker/Ticker';
import { Row, Col }    from 'react-flex-proto';
import _               from 'lodash';

class PriceTicker extends PureComponent {
  static propTypes = {
    quotes: PropTypes.array
  };


  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  getPrice(symbol) {
    const quotes = this.props.quotes;
    const price = _.find(quotes, {n: symbol});
    if (price) {
      return price.v;
    }
    return 0;
  }

  render() {
    return (
      <div style={{display: 'inline-block', padding: '5px'}}>
        <Row>
          <Col>
            <Ticker name={'BTC'} value={this.getPrice('btceur') / 100} symbol={'€'}/>
          </Col>
          <Col>
            <Ticker name={'ETH'} value={this.getPrice('etheur') / 100} symbol={'€'}/>
          </Col>
          <Col>
            <Ticker name={'BCH'} value={this.getPrice('bcheur') / 100} symbol={'€'}/>
          </Col>
          <Col>
            <Ticker name={'LTC'} value={this.getPrice('ltceur') / 100} symbol={'€'}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PriceTicker;
