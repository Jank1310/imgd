'use strict';

var Reflux = require('reflux');
//var Actions = require('actions/..');


var PostsStore = Reflux.createStore({
  listenables: Actions,


});

module.exports = PostsStore; 
