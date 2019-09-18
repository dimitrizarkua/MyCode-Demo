// @flow weak

import React, {
  Component
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  Route,
  Redirect,
  withRouter
}                         from 'react-router-dom';
import { connect }              from 'react-redux';
import {
  compose
}                               from 'redux';

import auth               from '../../services/auth';

class PrivateRoute extends Component {
  static propTypes = {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    component:  PropTypes.any.isRequired,
    path:       PropTypes.string,

    isAuthenticated: PropTypes.bool
  };

  render() {
    const {
      component: InnerComponent,
      ...rest
    } = this.props;
    const { location, isAuthenticated } = this.props;
    return (
      <Route
        {...rest}
        render={
          props => (
            auth.isAuthorized() && (isAuthenticated || isAuthenticated === null)
              ? <InnerComponent {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: location } }} />
          )
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated:         state.userAuth.isAuthenticated
  };
};

// we use here compose (from redux) just for conveniance (since compose(f,h, g)(args) looks better than f(g(h(args))))
export default compose(
  withRouter,
  connect(mapStateToProps)
)(PrivateRoute);
