'use strict';

var ImgdApp = require('./ImgdApp');
var NewPost = require('components/NewPost');
var Channel = require('components/Channel');

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var content = document.getElementById('content');

var Routes = (
  <Route handler={ImgdApp}>
      <DefaultRoute handler={Channel}/>
      <Route name="newPost" handler={NewPost}/>
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, content);
});
