// @flow weak

// #region imports
import React, {
  Component
}                             from 'react';
import PropTypes              from 'prop-types';
import {
  Header,
  AsideLeft
}                             from '../../components';
import { Notifications }      from 'react-blur-admin';
import { appConfig }          from '../../config';
import { navigation }         from '../../models';
import MainRoutes             from '../../routes/MainRoutes';
import UserIMG                from 'react-blur-admin/dist/assets/img/person.svg';
// #endregion


class App extends Component {
  static propTypes = {
    // react-router 4:
    quotes:   PropTypes.array,
    history:  PropTypes.object.isRequired,

    sideMenuIsCollapsed: PropTypes.bool,
    userInfos:  PropTypes.shape({
      userId:   PropTypes.string,
      lifetime: PropTypes.number
    }),
    userIsConnected: PropTypes.bool,
    currentView:     PropTypes.string,

    actions: PropTypes.shape({
      enterHome: PropTypes.func,
      leaveHome: PropTypes.func,
      fetchEarningGraphDataIfNeeded: PropTypes.func,
      fetchUserInfoDataIfNeeded:     PropTypes.func,
      fetchSaleStatsDataIfNeeded:    PropTypes.func,
      openSideMenu:   PropTypes.func,
      closeSideMenu:  PropTypes.func,
      toggleSideMenu: PropTypes.func,
      disconnectUser: PropTypes.func,
      checkUserIsConnected: PropTypes.func
    })
  };

  state = {
    appName: appConfig.APP_NAME
  };

  componentWillMount() {
  }

  // #region lifecycle methods
  componentDidMount() {
    const {
      actions: {
        checkUserIsConnected,
        fetchUserInfoDataIfNeeded,
        fetchSaleStatsDataIfNeeded,
        fetchDailyStatsIfNeeded,
        getSideMenuCollpasedStateFromLocalStorage
      }
    } = this.props;

    checkUserIsConnected();
    fetchUserInfoDataIfNeeded();
    fetchSaleStatsDataIfNeeded();
    fetchDailyStatsIfNeeded();
    // this.intervalId = setInterval(fetchSaleStatsDataIfNeeded, 5000);
    getSideMenuCollpasedStateFromLocalStorage();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { appName } = this.state;
    const { currentView } = this.props;

    return (
      <div>
        <AsideLeft
          isAnimated={true}
          sideMenu={navigation.sideMenu}
          currentView={currentView}
        />
        <Header
          appName={appName}
          userPicture={UserIMG}
          currentView={currentView}
          toggleSideMenu={this.handlesMenuButtonClick}
          onLogout={this.handlesOnLogout}
          quotes={this.props.quotes}
        />
        <div className="al-main">
          <div className="al-content">
            <MainRoutes />
          </div>
        </div>
        <Notifications />
      </div>
    );
  }
  // #endregion

  handlesMenuButtonClick = (event) => {
    if (event) {
      event.preventDefault();
    }
    const { actions: { toggleSideMenu } } = this.props;
    toggleSideMenu();
  }

  handlesOnLogout = (event: any) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.logout();
  }

  logout = () => {
    const { actions: { disconnectUser } } = this.props;
    disconnectUser();
  }
}

export default App;
