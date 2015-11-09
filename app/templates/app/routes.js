import React from 'react';
import { Router, Route } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import Home from './home/home';

export default (
  <Router history={createHistory()}>
    <Route path='/' component={Home} />
  </Router>
);
