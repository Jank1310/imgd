'use strict';

require('styles/Post.scss');

var React = require('react/addons');
var moment = require('moment');
var Router = require('react-router');
var Link = Router.Link;


var Post = React.createClass({
  render: function () {
    var timeStr = moment(this.props.data.created).fromNow();
    var channelUrl = '/c/' + this.props.data.channel;
    var channelText = '/' + this.props.data.channel;
    return (
        <div className="post ui card post">
          <div className="content">
              <img className="ui avatar image" src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/c33.33.411.411/s40x40/408350_473766092643340_1600889771_n.jpg?oh=e684b43d60de443cc8437593ae6bb601&oe=5642D99A&__gda__=1444094634_cefee95dc312085bbd733afd58a5e5fc" />
              {this.props.data.user}
            <div className="right floated">
              <div><strong><Link to={channelUrl}>{channelText}</Link></strong></div>
              <span className="meta">{timeStr}</span></div>
          </div>
          <a className="image" href={this.props.data.image} target='_new'>
            <img src={this.props.data.image} />
          </a>
          <div className="content">
            <div className="description">
              {this.props.data.message}
            </div>
          </div>
          <div className="content">
            <span className="right floated">
              <i className="heart outline like icon"></i>
              {this.props.data.likes} likes
            </span>
            <i className="comment icon"></i>
            3 comments
          </div>
          <div className="extra content">
            <div className="ui large transparent left icon input">
              <i className="comment outline icon"></i>
              <input type="text" placeholder="Add Comment..." />
            </div>
          </div>
      </div>);
  }
});

module.exports = Post;
