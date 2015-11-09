// expose jQuery for jquery_ujs and React for react_ujs
import 'expose?React!react';
import 'expose?jQuery!expose?$!jquery';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

$(document).ready(() => {
  ReactDOM.render(<div>{routes}</div>, document.getElementById('route'));
});
