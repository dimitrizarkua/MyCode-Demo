// @flow weak

import React, {
  PureComponent
}                                        from 'react';
import PropTypes                         from 'prop-types';
import { Row, Col }                      from 'react-flex-proto';
import { Page, Panel, Input, Select }    from 'react-blur-admin';
import _                                 from 'lodash';

class CalculatorPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstValue: 0,
      secondValue: 0,
      firstCurrency: 'btc',
      secondCurrency: 'xcm'
    };
  }

  supportedCurrencies = ['btc', 'eth', 'ltc', 'bch'];

  static propTypes = {
    saleStats: PropTypes.object
  };

  componentWillMount() {
    const { actions: { enterCalculatorPanel } } = this.props;
    enterCalculatorPanel();
  }

  componentWillUnmount() {
    const { actions: { leaveCalculatorPanel } } = this.props;
    leaveCalculatorPanel();
  }

  isCrypto(currency) {
    if (this.supportedCurrencies.indexOf(currency) !== -1) {
      return true;
    }
    return false;
  }

  getEuroRate(currency) {
    if (currency === 'eur') {
      return 1;
    } else if (currency === 'xcm') {
      return this.props.saleStats.data.token.price / 100;
    } else {
      const quotes = this.props.saleStats.quotes;
      if (quotes) {
        let result = _.find(quotes, function (price) {
          if (price.n.indexOf(currency) !== -1 && price.n.indexOf('eur') !== -1) {
            return price;
          }
          return null;
        });
        if (result !== null) {
          return result.v / 100;
        }
      }
      return -1;
    }
  }

  getExchangeRate() {
    if (this.props.saleStats.quotes) {
      const firstCurrency = this.state.firstCurrency;
      const secondCurrency = this.state.secondCurrency;

      const firstCurrencyRate = this.getEuroRate(firstCurrency);
      const secondCurrencyRate = this.getEuroRate(secondCurrency);
      if (firstCurrencyRate !== -1 && secondCurrencyRate !== -1) {
        return firstCurrencyRate / secondCurrencyRate;
      } else {
        return -1;
      }
    }
    return -1;
  }

  onFirstValueChanged(event) {
    this.setState({
      firstValue: event.currentTarget.value,
      secondValue: event.currentTarget.value * this.getExchangeRate()
    });
  }

  onSecondValueChanged(event) {
    this.setState({
      firstValue: event.currentTarget.value / this.getExchangeRate(),
      secondValue: event.currentTarget.value
    });
  }

  onFirstCurrencyChanged(value) {
    this.setState({
      firstCurrency: value
    });
    this.emptyInputBox();
  }

  onSecondCurrencyChanged(value) {
    this.setState({
      secondCurrency: value
    });
    this.emptyInputBox();
  }

  emptyInputBox() {
    this.setState({
      firstValue: 0,
      secondValue: 0
    });
  }

  render() {
    return(
      <Page title={'Currency Calculator'}>
        <Panel title={'Currency Converter'}>
          <h5>From</h5>
          <Row>
            <Col>
              <Input
                onChange={e => this.onFirstValueChanged(e)}
                onValidate={value => !isNaN(value)}
                value={this.state.firstValue}
                className={'currencyValue'}
                />
            </Col>
            <Col>
              <Select
                placeholder={'From'}
                isSearchable={true}
                value={this.state.firstCurrency}
                onChange={value => this.onFirstCurrencyChanged(value)}
                options={[
                  { value: 'xcm', label: 'XCM' },
                  { value: 'btc', label: 'BTC' },
                  { value: 'eth', label: 'ETH' },
                  { value: 'bch', label: 'BCH' },
                  { value: 'ltc', label: 'LTC' },
                  { value: 'eur', label: 'EUR' },
                ]}
              />
            </Col>
          </Row>

          <h5>To</h5>
          <Row>
            <Col>
              <Input
                onChange={e => this.onSecondValueChanged(e)}
                onValidate={e => true}
                value={this.state.secondValue}
                className={'currencyValue'}
              />
            </Col>
            <Col>
              <Select
                placeholder={'To'}
                isSearchable={true}
                value={this.state.secondCurrency}
                onChange={value => this.onSecondCurrencyChanged(value)}
                options={[
                  { value: 'xcm', label: 'XCM' },
                  { value: 'btc', label: 'BTC' },
                  { value: 'eth', label: 'ETH' },
                  { value: 'bch', label: 'BCH' },
                  { value: 'ltc', label: 'LTC' },
                  { value: 'eur', label: 'EUR' },
                ]}
              />
            </Col>
          </Row>
        </Panel>
      </Page>
    );
  }
}

CalculatorPanel.propTypes= {
  actions: PropTypes.shape({
    enterCalculatorPanel: PropTypes.func.isRequired,
    leaveCalculatorPanel: PropTypes.func.isRequired
  })
};

export default CalculatorPanel;
