'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var Actions = require('actions/NewPostActionCreators');
var Router = require('react-router');
var NewPostsStore = require('stores/NewPostStore');

require('styles/NewPost.scss');

var NewPost = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.connect(NewPostsStore, 'newPostStore')
  ],

  componentWillMount: function() {
    this.setState({channel: this.props.query.channel});
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.newPostStore.posting === false
      && nextState.newPostStore.postSuccess === true)
    {
      this.goBackToChannel(true);
    }
  },

  goBackToChannel: function(posted) {
    if(posted) { //go to channel in which we posted
      var channel = React.findDOMNode(this.refs.channel).value;
      this.transitionTo('/c/' + channel);
    } else {
      if(this.props.query.channel) {
        this.transitionTo('/c/' + this.props.query.channel);
      } else {
        this.transitionTo('/');
      }
    }
  },

  handlePost: function() {
    var message = React.findDOMNode(this.refs.message).value;
    var channel = React.findDOMNode(this.refs.channel).value;
    Actions.postToChannel(channel, message);
  },

  handleCancel: function() {
    this.goBackToChannel();
  },

  handleChannelChange: function(event) {
    this.setState({channel: event.target.value});
  },

  render: function () {
    var postButton = (
      <button onClick={this.handlePost} className="ui primary button">
        Post
      </button>
    );
    if(this.state.newPostStore.posting) {
      postButton = (
        <button onClick={this.handlePost} className="ui primary loading button">
          Post
        </button>
      );
    }

    return (
      <div className="ui card">
        <div className="content">
          <div className="header">Post image</div>
          <div className="ui form">
            <div className="field">
              <label>channel</label>
              <input ref="channel" onChange={this.handleChannelChange} type="text" value={this.state.channel}/>
            </div>
            <div className="">
              Image
            </div>
            <div className="field">
               <label>Message</label>
               <textarea ref="message" rows="2" hint="Your message" />
             </div>
             <div className="right aligned">
               <button onClick={this.handleCancel} className="ui button">
                 Cancel
               </button>
              {postButton}
            </div>
         </div>
       </div>
      </div>
      );
  }
});

module.exports = NewPost;
