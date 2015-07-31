'use strict';

var Reflux = require('reflux');
var Actions = require('actions/NewPostActionCreators');
var agent = require('superagent');

var NewPostStore = Reflux.createStore({
  listenables: Actions,
  state: {
        posting: false,
        postSuccess: null
  },

  getInitialState: function() {
    return this.state;
  },

  onPostToChannel: function(channel, message) {
    console.log('Post!', channel, message);
    var url = '/api/c/' + channel;
    this.state.posting = true;
    this.state.postSuccess = null;
    this.trigger(this.state);
    agent.post(url).send({message: message}).end(function(err, res) {
      if(res.ok) {
        Actions.postToChannel.completed(res.body);
      } else {
        Actions.postToChannel.failed(res.error);
      }
    });
  },

  onPostToChannelCompleted: function(result) {
    console.log('Posted!', result);
    this.state.posting = false;
    this.state.postSuccess = true;
    this.trigger(this.state);
  },

  onPostToChannelFailed: function(error) {
    console.error('Post failed', error);
    this.state.posting = false;
    this.state.postSuccess = false;
    this.trigger(this.state);
  }
});

module.exports = NewPostStore;
