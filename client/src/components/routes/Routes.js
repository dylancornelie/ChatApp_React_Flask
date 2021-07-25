import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Home from '../Home';
import Chat from '../Chat';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import MyAccount from '../MyAccount';
import ChangePassword from '../ChangePassword';
import CreateMeeting from '../CreateMeeting';
import JoinMeeting from '../JoinMeeting';

const Routes = () => {

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={SignIn} />
        <Route path='/signup' exact component={SignUp} />
        <Route path='/home' exact component={Home} />
        <Route path='/chat' exact component={Chat} />
        <Route path='/account' exact component={MyAccount} />
        <Route path='/meeting/create' exact component={CreateMeeting} />
        <Route path='/meeting/join' exact component={JoinMeeting} />
        <Route path='/account/password' exact component={ChangePassword} />
        <Redirect to='/home' />
      </Switch>
    </Router>
  );
};

export default Routes;
