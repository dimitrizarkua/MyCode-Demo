// @flow
/* eslint no-process-env:0 */
import React                        from 'react';
import {
  // Route,
  Switch
}                                   from 'react-router-dom';
import PrivateRoute                 from '../components/privateRoute/PrivateRoute';
import HomeConnected                from '../views/home';
import CommandPanelConnected        from '../views/commandPanel';
import Ambassador                   from '../views/ambassador';
import AdminManagement              from '../views/adminManagement';
import CalculatorPanel              from '../views/calc';
import Kyc                          from '../views/kyc';
import KycReports                   from '../views/kycReports';
import PepCheck                     from '../views/pepCheck';

export const MainRoutes = () => (
  <Switch>
    <PrivateRoute exact path="/" component={HomeConnected}/>
    <PrivateRoute path="/commandPanel" component={CommandPanelConnected} />
    <PrivateRoute path="/ambassador" component={Ambassador} />
    <PrivateRoute path="/adminManagement" component={AdminManagement} />
    <PrivateRoute path="/calculatorPanel" component={CalculatorPanel} />
    <PrivateRoute path="/kyc/status" component={Kyc} />
    <PrivateRoute path="/kycReports" component={KycReports} />
    <PrivateRoute path="/pepCheck" component={PepCheck} />
    {/* <Route getComponent={asyncComponent(Kyc)} path="/kyc/:type/:secType"/> */}
    {/* <Route getComponent={asyncComponent(Kyc)} path="/kyc/:type"/> */}
    {/* </Route> */}

  </Switch>
);

export default MainRoutes;
