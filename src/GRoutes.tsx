import React from 'react';
import "./firebase";
import {AuthContextProvider} from './context/AuthContext'
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import Login from './pages/Login'
import App from './App'

export default function GRoutes() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/app" component={App}/>
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}
