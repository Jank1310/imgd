'use strict';

var ImgdApp = require('./ImgdApp');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var content = document.getElementById('content');

var Routes = (
  <Route handler={ImgdApp}>
    <Route name="/" handler={ImgdApp}>
    </Route>
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, content);
});
