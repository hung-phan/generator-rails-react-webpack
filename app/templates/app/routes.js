import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Home from './home/home';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
  </Router>
);
