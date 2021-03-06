import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Role from '../pages/role';
import Home from '../pages/Home';
import Games from '../pages/Games';
import Tags from '../pages/Tags';
import ResetPass from '../pages/ResetPass';
import Registration from '../pages/Registration';
import Forgot from '../pages/Forgot';
import GameDetail from '../pages/GameDetail';
import CreateGame from '../pages/CreateGame';
import EditGame from '../pages/EditGame';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/role" exact component={Role} />
    <Route path="/games" exact component={Games} />
    <Route path="/tags" exact component={Tags} />
    <Route path="/registration" exact component={Registration} />
    <Route path="/forgot" exact component={Forgot} />
    <Route
      path="/renewPassword/:resetKey"
    >
      <ResetPass />
    </Route>
    <Route
      path="/game/:id/version/:version"
    >
      <GameDetail />
    </Route>
    <Route path="/game/add" exact component={CreateGame} />
    <Route path="/game/edit/:id/version/:version">
      <EditGame />
    </Route>
  </Switch>
);
export default Routes;
