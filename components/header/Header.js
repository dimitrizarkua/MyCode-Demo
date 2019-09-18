// @flow weak

import React              from 'react';
import PropTypes          from 'prop-types';
import UserMenu           from './userMenu/UserMenu';
import Button             from './button/Button';
import { Row, Col }       from 'react-flex-proto';
import PriceTicker             from '../priceTicker/PriceTicker';

const Header = ({
  userPicture,
  appName,
  toggleSideMenu,
  onLogout,
  quotes
}) => (
  <div className="page-top clearfix">
    <a href="/" className="al-logo clearfix">
      { appName }
    </a>
    <Button
      toggleSideMenu={toggleSideMenu}
    />
    <div className="user-profile clearfix">
      <ul className="nav navbar-nav">
        <li>
          <PriceTicker quotes={quotes}/>
        </li>
        <li>
          <UserMenu
            picture={userPicture}
            onLogout={onLogout}
          />
        </li>
      </ul>
    </div>


  </div>
);

Header.propTypes = {
  appName:        PropTypes.string,

  userPicture:    PropTypes.string,
  onLogout:       PropTypes.func,

  currentView:    PropTypes.string,
  toggleSideMenu: PropTypes.func,
  quotes:         PropTypes.array
};

Header.defaultProps = {
  appName: 'applicationName'
};

Header.displayName = 'Header';

export default Header;
