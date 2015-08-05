'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var ImgdApp = require('./ImgdApp');
var NewPost = require('components/NewPost');
var Channel = require('components/Channel');
var Signup = require('components/Signup');
var Login = require('components/Login');


var content = document.getElementById('content');

var Routes = (
  <Route handler={ImgdApp}>
      <DefaultRoute handler={Channel}/>
      <Route name="newPost" handler={NewPost}/>
      <Route name="/c/:channel" handler={Channel}/>
      <Route name="/signup" handler={Signup}/>
      <Route name="/login" handler={Login}/>
  </Route>
);

Router.run(Routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, content);
});
