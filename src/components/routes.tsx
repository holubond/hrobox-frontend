import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Role from '../pages/role';
import Home from '../pages/Home';
import Games from '../pages/Games';
import Registration from '../pages/Registration';
import Forgot from '../pages/Forgot';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/role" exact component={Role} />
    <Route path="/games" exact component={Games} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/forgot" exact component={Forgot} />
  </Switch>
);
export default Routes;
