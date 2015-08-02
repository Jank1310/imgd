'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Dropzone = require('react-dropzone');
var classNames = require('classnames');

var Actions = require('actions/PostsActionCreators');
var Router = require('react-router');

require('styles/NewPost.scss');

var NewPost = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenTo(Actions.postToChannel.completed, 'postToChannelCompleted'),
    Reflux.listenTo(Actions.postToChannel.failed, 'postToChannelFailed')
  ],

  componentWillMount: function() {
    this.setState({channel: this.props.query.channel});
  },

  getInitialState: function() {
    return {
      posting: false,
      postError: false
    };
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
    this.setState({posting: true, postError: false});
    Actions.postToChannel(channel, message);
  },

  postToChannelCompleted: function() {
    this.setState({posting: false});
    this.goBackToChannel(true);
  },

  postToChannelFailed: function() {
    this.setState({postError: true, posting: false});
  },

  handleCancel: function() {
    this.goBackToChannel();
  },

  handleChannelChange: function(event) {
    this.setState({channel: event.target.value});
  },

  onDrop: function(files) {
    this.setState({file: files[0]});
  },

  render: function () {
    console.log("render");
    var postButton = (
      <button onClick={this.handlePost} className="ui primary button">
        Post
      </button>
    );
    if(this.state.posting) {
      postButton = (
        <button onClick={this.handlePost} className="ui primary loading button">
          Post
        </button>
      );
    }

    var image = (
      <div>
        <h2 className="ui center aligned icon header">
          <i className="circular photo icon"></i>
          Select image
        </h2>
      </div>);
    if(this.state.file) {
      image = (
        <div className="image">
          <img width='100%' src={this.state.file.preview} />
        </div>
      );
    }

    var formClasses = classNames('ui', {'error': this.state.postError}, 'form');

    var error;
    if(this.state.postError === true) {
      error = (
        <div className="ui error message">
           <div className="header">Could not post image</div>
           <p>Something went wrong <i className="frown icon"></i></p>
         </div>
       );
    }



    return (
      <div className="ui card">
        <div className="content">
          <div className="header">Post image</div>
          <div className={formClasses}>
            <div className="field">
              <label>channel</label>
              <input ref="channel" onChange={this.handleChannelChange} type="text" value={this.state.channel}/>
            </div>
            <div className="field">
              <label>Image</label>
              <Dropzone className="center aligned" onDrop={this.onDrop}>
                {image}
              </Dropzone>
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
            {error}
         </div>
       </div>
      </div>
      );
  }
});

module.exports = NewPost;
