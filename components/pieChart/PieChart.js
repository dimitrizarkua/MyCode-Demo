// @flow weak

import React, {
  PureComponent
}                      from 'react';
import PropTypes       from 'prop-types';
import Highcharts      from 'highcharts';
import {
  saleStatsMockData
}                      from '../../models';
import { Panel } from 'react-blur-admin';


class PieChart extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    data:  PropTypes.array,
  };

  static defaultProps = {
    title: 'undefined',
    data:  saleStatsMockData.data
  };

  chart = null;
  pieChart = null;

  componentDidMount() {
    const { data } = this.props;
    this.drawChart({data});
    setInterval(this.drawChart( data ), 1000);
  }

  componentWillReceiveProps(newProps) {
    const { data } = this.props;
    if ((newProps.data.length > 0) &&
        (data.length === 0)) {
      this.drawChart(newProps.data);
    }
  }

  render() {
    return (
      <Panel title={this.props.title}>
        <div id="pieChart" ref={this.getCanvaRef}></div>
      </Panel>
    );
  }

  getCanvaRef = ref => (this.pieChart = ref)

  pieColors() {
    let colors = [],
      base = Highcharts.getOptions().colors[0],
      i;

    for (i = 0; i < 10; i += 1) {
      // Start out with a darkened base color (negative brighten), and end
      // up with a much brighter color
      colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;
  }

  drawChart(data) {
    if (this.pieChart) {
      this.chart = Highcharts.chart('pieChart', {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: 'transparent',
          plotBorderWidth: null,
          plotShadow: false,
          width: 400,
          type: 'pie'
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: 'Amount: <b>{point.y} €</b><br>Proposition: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
          itemStyle: {
            color: 'white',
            fontWeight: 'bold'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            colors: this.pieColors(),
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
              distance: -50,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 1
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            data: data
          }
        ]
      })
    }
  }
}

export default PieChart;
