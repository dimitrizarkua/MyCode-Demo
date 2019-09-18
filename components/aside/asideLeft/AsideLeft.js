// @flow weak

/* eslint no-console: 0 */
import React      from 'react';
import PropTypes  from 'prop-types';
import cx         from 'classnames';
import Menu       from './menu/Menu';


const AsideLeft = ({
  currentView,
  sideMenu
}) => (
  <aside className="al-sidebar">
    <ul className="al-sidebar-list">
      {
        sideMenu.map(
          ({name, linkTo, faIconName}, id) => {
            return (

              <Menu
                key={id}
                name={name}
                linkTo={linkTo}
                faIconName={faIconName}
                activeView={currentView}
                id={id}
              />
            );
          }
        )
      }
    </ul>
  </aside>
);

AsideLeft.propTypes = {
  sideMenu:     PropTypes.arrayOf(
    PropTypes.shape({
      name:       PropTypes.string.isRequired,
      linkTo:     PropTypes.string.isRequired,
      faIconName: PropTypes.string.isRequired
    })
  ).isRequired,
  currentView:      PropTypes.string
};

AsideLeft.defaultProps = {
};

export default AsideLeft;
