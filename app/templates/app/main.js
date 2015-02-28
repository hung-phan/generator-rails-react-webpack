'use strict'

// expose jQuery for jquery_ujs and React for react_ujs
require('expose?jQuery!expose?$!jquery');
require('expose?React!react/addons');

let $      = require('jquery');
let React  = require('react/addons');
let Router = require('react-router');

// component
let Home = require('./home/home');

$(document).ready(function() {
  // define routing
  let routes = (
    <Router.Route name='main_page' path='/' handler={Home}></Router.Route>
  );

  Router.run(routes, Router.HashLocation, function(Handler) {
    React.render(React.createFactory(Handler)(), document.getElementById('route'));
  });
});
