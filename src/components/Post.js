'use strict';

var React = require('react/addons');

require('font-awesome/css/font-awesome.css');
require('styles/Post.scss');

var Post = React.createClass({
  render: function () {
    return (
        <div className="post">
          <div className="post-image">
            <img src={this.props.data.image} />
          </div>
          <div className="info uk-grid">
            <div className="uk-width-4-5"><strong>{this.props.data.user}</strong></div>
            <div className="uk-width-1-5 uk-text-right">{this.props.data.created}</div>
          </div>
          <div className="description">
            <div className="pure-u-1">{this.props.data.message}</div>
          </div>
          <div className="like">
              <a href="#"> <i className="fa fa-heart-o"></i></a> {this.props.data.likes}</div>
        </div>
      );
  }
});

module.exports = Post;
