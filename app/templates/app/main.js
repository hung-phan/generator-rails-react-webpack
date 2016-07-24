import './libs';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

$(document).ready(() => {
  ReactDOM.render(<div>{routes}</div>, document.getElementById('route'));
});
