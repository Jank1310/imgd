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
      postError: false,
      addedImage: false,
      imagePreview: null,
      imageFile: null
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
    if(!this.state.posting && this.state.addedImage) {
      var message = React.findDOMNode(this.refs.message).value;
      var channel = React.findDOMNode(this.refs.channel).value;
      this.setState({posting: true, postError: false});
      Actions.postToChannel(channel, message, this.state.imageFile);
    }
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
    this.setState({
      addedImage: true,
      imagePreview: files[0].preview,
      imageFile: files[0]
    });
  },

  handleRemoveImage: function() {
    this.setState({addedImage: false, imagePreview: null, imageFile: null});
  },

  componentDidUpdate: function() {
    $('#previewImage').dimmer({
      on: 'hover'
    });
  },

  render: function () {
    var submitButtonClasses = classNames('ui', 'primary', {'disabled': !this.state.addedImage}, {'loading': this.state.posting}, 'button');
    var postButton = (
      <button onClick={this.handlePost} className={submitButtonClasses}>
        Post
      </button>
    );

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

    var dropzoneContent = null;
    if(this.state.addedImage) {
      dropzoneContent = (
        <div id="previewImage" className="blurring dimmable image">
          <div className="ui dimmer">
            <div className="content">
              <div className="center">
                <div className="ui inverted icon button" onClick={this.handleRemoveImage}><i className="remove circle outline icon"></i> Remove</div>
              </div>
            </div>
          </div>
          <img className="image" style={{width: '100%'}} src={this.state.imagePreview}/>
        </div>
      );
    } else {
      dropzoneContent = (
        <Dropzone ref="dropzone" className="clickable" accept='image/*' onDrop={this.onDrop}>
          <div className="ui center aligned icon header">
            <i className="circular photo icon"></i>
            Select image
          </div>
        </Dropzone>
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
                {dropzoneContent}
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
