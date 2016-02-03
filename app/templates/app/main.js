import 'babel-polyfill';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

$(document).ready(() => {
  ReactDOM.render(<div>{routes}</div>, document.getElementById('route'));
});

// expose jQuery for jquery_ujs and React for react_ujs
Object.assign(window, {
  $,
  jQuery: $,
  React
});
