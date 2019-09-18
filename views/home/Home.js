// flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import { Row, Col }       from 'react-flex-proto';
import { Page }           from 'react-blur-admin';
import {
  StatsCard,
  StockChart,
  PieChart
}                         from '../../components';
import CoinImg            from '../../img/coin-icn.png';
import ContributionImg    from '../../img/contributions-icn.png';
import InvestedImg        from '../../img/invested-icn.png';
import PriceImg           from '../../img/price-icn.png';

class Home extends PureComponent {
  static propTypes = {
    dailyTokenSold:       PropTypes.array,
    saleStats:            PropTypes.object,
    quotes:               PropTypes.array,

    actions: PropTypes.shape({
      enterHome: PropTypes.func,
      leaveHome: PropTypes.func,
      fetchDailyStatsDataIfNeeded:  PropTypes.func,
      fetchSaleStatsDataIfNeeded: PropTypes.func
    })
  };

  componentWillMount() {
    const { actions: { enterHome } } = this.props;
    enterHome();
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    const { actions: { leaveHome } } = this.props;
    leaveHome();
  }

  getPercentPerCurrencies(data, prices) {
    let collected = {};
    let btcEur, ethEur, bchEur, ltcEur;
    let values = [];

    prices.forEach(function (price) {
      if (price.n === 'btceur') {
        btcEur = price.v / 100;
      }
      if (price.n === 'etheur') {
        ethEur = price.v / 100;
      }
      if (price.n === 'bcheur') {
        bchEur = price.v / 100;
      }
      if (price.n === 'ltceur') {
        ltcEur = price.v / 100;
      }
    });

    if (data.collected) {
      collected = data.collected;
    }

    if (collected.btc) values.push({
      name: 'BTC',
      y:    collected.btc * btcEur
    });
    if (collected.eth) values.push({
      name: 'ETH',
      y:    collected.eth * ethEur,
      sliced: true,
      selected: true
    });
    if (collected.bch) values.push({
      name: 'BCH',
      y:    collected.bch * bchEur
    });
    if (collected.ltc) values.push({
      name: 'LTC',
      y:    collected.ltc * ltcEur
    });

    return values;
  }

  render() {
    const {
      saleStats,
      dailyTokenSold,
      quotes
    } = this.props;

    let collected = saleStats.collected;
    let token = saleStats.token;

    return(
      <Page title="Dashboard">
        <Row
          style={{marginBottom: '5px'}}>
          <Col>
            <StatsCard
              statValue={ collected ? collected.eur.toFixed(4).toString() : '-' }
              statLabel={'Euro Collected'}
              image={ InvestedImg }
              backColor={'transparent'}
            />
          </Col>
          <Col>
            <StatsCard
              statValue={ token ? token.sold.toString() : '-' }
              statLabel={'XCM Sold'}
              image={ CoinImg }
              backColor={'transparent'}
            />
          </Col>
          <Col>
            <StatsCard
              statValue={ token ? (token.price / 100).toString() : '-' }
              statLabel={'Current Price'}
              image={ PriceImg }
              backColor={'transparent'}
            />
          </Col>
          <Col>
            <StatsCard
              statValue={ saleStats ? saleStats.contributors : '-' }
              statLabel={'Contributors'}
              image={ ContributionImg }
              backColor={'transparent'}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <StockChart
              title={'Daily Token Sold'}
              data={dailyTokenSold}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <PieChart
              title={'Collected Per Currencies'}
              data={this.getPercentPerCurrencies(saleStats, quotes)}
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default Home;
