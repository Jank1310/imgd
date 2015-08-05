'use strict';

var Reflux = require('reflux');
//var Actions = require('actions/..');


var UserStore = Reflux.createStore({
//  listenables: Actions,

  getInitialState: function() {
    return {
      loggedIn: false
    };
  }

});

module.exports = UserStore;
