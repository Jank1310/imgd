'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var Post = require('components/Post');
var postsStore = require('stores/PostsStore');
var PostsActions = require('actions/PostsActionCreators');

require('styles/Channel.scss');
var paragraphImage = require('../images/short-paragraph.png');

var Channel = React.createClass({
  mixins: [Reflux.connect(postsStore, 'postsStatus')],

  componentWillMount: function() {
    this.loadPosts(this.props.params.channel);
  },

  componentWillUpdate: function(nextProps) {
    if(nextProps.params.channel !== this.props.params.channel) {
      this.loadPosts(nextProps.params.channel);
    }
  },

  loadPosts: function(channel) {
    PostsActions.getPostsOfChannel(channel);
  },

  render: function () {
    var channelName = '/global';
    if(this.props.params.channel) {
      channelName = '/' + this.props.params.channel;
    }

    var channelContent;
    if(this.state.postsStatus.loading) {
      channelContent = (
          <div className="ui segment">
            <div className="ui active inverted dimmer">
              <div className="ui loader" />
            </div>
            <img className="ui wireframe image" src={paragraphImage}/>
          </div>
      );
    } else {
      if(this.state.postsStatus.posts.length > 0) {
        channelContent = (
          <div>
              {this.state.postsStatus.posts.map(function(post) {
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
          <Link to="newPost" query={{channel: this.props.params.channel}}>
              <div className="fluid ui blue button">
                <i className="add icon"></i>
                Post image
             </div>
          </Link>
          {channelContent}
        </div>
      );
  }
});

module.exports = Channel;
