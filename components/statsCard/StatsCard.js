// @flow weak

import React            from 'react';
import PropTypes        from 'prop-types';
import { Panel }  from 'react-blur-admin';
import CoinImg          from '../../img/coin-icn.png';

const StatsCard = ({
  statValue,
  statLabel,
  image,
  backColor
}) => (
  <Panel>
    <span className={ `sm-st-icon st-${ backColor }` }>
      <img src={ image } />
    </span>
    <div className="sm-st-info">
      <span>
        { statValue }
      </span>
      <div className="st-info-label">
        { statLabel }
      </div>
    </div>
  </Panel>
);

StatsCard.propTypes = {
  statValue:  PropTypes.any,
  statLabel:  PropTypes.string,
  image:      PropTypes.string,
  backColor:  PropTypes.oneOf([
    'red',
    'blue',
    'violet',
    'green',
    'transparent'
  ])
};

StatsCard.defaultProps = {
  statValue:  '-',
  statLabel:  'unknown',
  image:       CoinImg,
  backColor:  'transparent'
};

export default StatsCard;
