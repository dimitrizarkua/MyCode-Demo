// @flow weak

import React, {
  PureComponent
}                      from 'react';
import PropTypes       from 'prop-types';
import Highcharts      from 'highcharts/highstock';
import { Panel } from 'react-blur-admin';


class StockChart extends PureComponent {
  static propTypes = {
    title:    PropTypes.string,
    data:     PropTypes.array
  };

  chart = null;
  linechart = null;

  componentDidMount() {
    const { data } = this.props;
    this.drawChart( data );
  }

  componentWillReceiveProps(newProps) {
    const { data } = this.props;
    if ((newProps.data.length > 0) && (data.length === 0)) {
      this.drawChart(newProps.data);
    }
  }

  render() {
    return (
      <Panel title={this.props.title}>
        <div
          ref={this.getCanvaRef}
          id="linechart"
        >
        </div>
      </Panel>
    );
  }

  getCanvaRef = ref => (this.linechart = ref)

  drawChart(data) {
    this.chart = Highcharts.stockChart(this.linechart, {
      chart: {
        backgroundColor: 'transparent'
      },
      rangeSelector: {
        selected: 4
      },
      yAxis: {
      },
      plotOptions: {
        series: {
          showInNavigator: true
        }
      },
      tooltip: {
        pointFormat: '<span style="color: {series.color}">{series.name}</span>: <b>{point.y}</b> XCM </br>',
        valueDecimals: 2,
        split: true
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: this.props.title,
          data: data
        }
      ]
    });
  }
}

export default StockChart;
