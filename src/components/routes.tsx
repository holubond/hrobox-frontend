import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Role from '../pages/role';
import Home from '../pages/Home';
import Games from '../pages/Games';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/role" exact component={Role} />
    <Route path="/games" exact component={Games} />
  </Switch>
);
export default Routes;
