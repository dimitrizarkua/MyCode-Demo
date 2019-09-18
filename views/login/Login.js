import React, {
  PureComponent
}                            from 'react';
import PropTypes             from 'prop-types';
import {
  Row,
  Col
}                            from 'react-flex-proto';
import { Page, Panel, Input, Select, Button, Alert, Notifications }  from 'react-blur-admin';
import { NotificationContainer, NotificationManager }                from 'react-notifications';
import auth                  from '../../services/auth';
import eventBus              from '../../lib/eventBus';
import CMLogo                from '../../img/cm-logo.svg';

type Props = {
  match: any,
  location: any,
  history: any,

  currentView: string,
  enterLogin: () => void,
  leaveLogin: () => void,

  isAuthenticated: boolean,
  isFetching: boolean,
  isLogging: boolean,
  disconnectUser: () => any,
  logUserIfNeeded: () => any
};

type State = {
  email: string,
  password: string
}

class Login extends PureComponent<Props, State> {
  // #region propTypes
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views props:
    currentView: PropTypes.string.isRequired,
    enterLogin:  PropTypes.func.isRequired,
    leaveLogin:  PropTypes.func.isRequired,

    // userAuth:
    isAuthenticated: PropTypes.bool,
    isFetching:      PropTypes.bool,
    isLogging:       PropTypes.bool,
    disconnectUser:  PropTypes.func.isRequired,
    logUserIfNeeded: PropTypes.func.isRequired
  };
  // #endregion

  static defaultProps = {
    isFetching:      false,
    isLogging:       false
  }

  state = {
    email:          '',
    password:       ''
  };

  // #region lifecycle methods
  componentDidMount() {
    const {
      enterLogin
      // disconnectUser
    } = this.props;

    // disconnectUser(); // diconnect user: remove token and user info
    enterLogin();
  }

  componentWillUnmount() {
    const { leaveLogin } = this.props;
    leaveLogin();
  }

  render() {
    const {
      email,
      password
    } = this.state;

    const {
      isLogging
    } = this.props;

    return (

      <Page>
        <Panel className={'cm-login-panel'}>
          <Row>
            <Col align={'center'}>
              <img src={CMLogo} className={'cm-login-logo'}/>
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                type={'text'}
                label={'Email'}
                value={email}
                placeholder={'Email'}
                onChange={this.handlesOnEmailChange}
              />
              <Input
                type={'password'}
                label={'Password'}
                placeholder={'Password'}
                value={password}
                onChange={this.handlesOnPasswordChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Button
                type='default'
                size='xm'
                title={'Go home'}
                onClick={this.goHome}
              />
            </Col>
            <Col align={'right'}>
              <Button
                type='success'
                size='lg'
                title={ isLogging ? 'Loging in...' : 'Login' }
                disabled={ isLogging }
                icon={ isLogging ? 'fa fa-spinner fa-pulse fa-fw' : '' }
                onClick={this.handlesOnLogin}
              />
            </Col>
          </Row>
        </Panel>
        <Notifications />
      </Page>
    );
  }

  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() });
    }
  }

  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ password: event.target.value.trim() });
    }
  }

  handlesOnLogin = async (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
    }

    const { history, logUserIfNeeded } = this.props;

    const {
      email,
      password
    } = this.state;

    logUserIfNeeded(email, password, (response) => {
      try {
        console.log('response: ', response);
        const { data } = response;
        const token = data.data.token;
        const {
          userId,
          lifetime
        } = data.data;

        const user = { userId, lifetime };
        auth.setToken(token);
        auth.setUserInfo(user);

        history.push({ pathname: '/' }); // back to Home
      } catch (error) {
        console.log('login went wrong..., error: ', error);
      }
    });
  }

  goHome = ( event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    const { history } = this.props;

    if (auth.isAuthorized()) {
      history.push({ pathname: '/' });
    } else {
      NotificationManager.warning('Error', 'You must login first!');
      return;
    }
  }
}

export default Login;
