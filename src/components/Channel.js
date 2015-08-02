'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Router = require('react-router');

var Post = require('components/Post');
var PostsStore = require('stores/PostsStore');
var PostsActions = require('actions/PostsActionCreators');

require('styles/Channel.scss');
var paragraphImage = require('../images/short-paragraph.png');

var Channel = React.createClass({
  mixins: [
    Reflux.connect(PostsStore, 'postStore'),
    Router.Navigation
  ],

  componentWillMount: function() {
    this.loadPosts(this.props.params.channel);
  },

  componentWillUpdate: function(nextProps) {
    if(nextProps.params.channel !== this.props.params.channel) {
      this.loadPosts(nextProps.params.channel);
    }
  },

  handleNewPost: function() {
    this.transitionTo('newPost', null, {channel: this.props.params.channel});
  },

  loadPosts: function(channel) {
    PostsActions.getPostsOfChannel(channel);
  },

  render: function () {
    var channelName = '/global';
    if(this.props.params.channel) {
      channelName = '/c/' + this.props.params.channel;
    }

    var channelContent;
    if(this.state.postStore.loading) {
      channelContent = (
          <div className="ui segment">
            <div className="ui active inverted dimmer">
              <div className="ui loader" />
            </div>
            <img className="ui wireframe image" src={paragraphImage}/>
          </div>
      );
    } else {
      if(this.state.postStore.posts.length > 0) {
        channelContent = (
          <div>
              {this.state.postStore.posts.map(function(post) {
                return <Post key={post.id} data={post} />;
              })}
          </div>
        );
      } else {
        channelContent = (
            <h2 className="ui center aligned icon header">
              <i className="frown icon"></i>
              <div className="content">
                No posts
                <div className="sub header">Post an image and start a new channel.</div>
              </div>
            </h2>
        );
      }
    }

    return (
        <div className="channel">
          <h2>{channelName}</h2>
          <div onClick={this.handleNewPost} className="fluid ui blue button">
            <i className="add icon"></i>
            Post image
         </div>
         <div className="ui divider"></div>
         {channelContent}
        </div>
      );
  }
});

module.exports = Channel;
