// @flow weak

import React      from 'react';
import PropTypes  from 'prop-types';

const UserMenu = ({
  picture,
  onLogout
}) => (
  <div className="al-user-profile dropdown">
    <a className="profile-toggle-link dropdown-toggle" data-toggle="dropdown">
      <img src={picture}/>
    </a>
    <ul className="top-dropdown-menu profile-dropdown dropdown-menu">
      <li><i className="dropdown-arr"></i></li>
      <li>
        <a href="#" className="signout" onClick={onLogout}>
          <i className="fa fa-power-off"></i>Sign out
        </a>
      </li>
    </ul>
  </div>
);

UserMenu.propTypes = {
  picture:    PropTypes.string,
  onLogout:   PropTypes.func
};

UserMenu.defaultProps = {
  onLogout: () => {}
};

UserMenu.displayName = 'UserMenu';

export default UserMenu;
