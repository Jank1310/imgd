'use strict';

var Reflux = require('reflux');

var NewPostActionCreators = Reflux.createActions({
  'postToChannel': {asyncResult: true}
});


module.exports = NewPostActionCreators;
