'use strict';

var React = require('react/addons');
var channelsStore = require('stores/ChannelsStore');
var Reflux = require('reflux');
var Link = require('react-router').Link;

require('styles/ChannelsList.scss');

var ChannelsList = React.createClass({
  mixins: [Reflux.connect(channelsStore, 'channels')],

  render: function () {
    return (
      <div className="ui segment channels-list">
        <div className="ui transparent icon input">
          <input type="text" placeholder="Search channel..." />
        </div>
        <div className="ui list">
          <div className="item">
            <div className="content">
              <div className="header"><i className="fire icon"></i> Popular</div>
            </div>
          </div>
          {this.state.channels.popular.map(function(channel) {
            var url = '/c/' + channel;
            var channelName = '/' + channel;
            return <Link className="item" to={url} key={channel}>{channelName}</Link>;
          })}
        </div>
        <div className="ui list">
          <div className="item">
            <div className="content">
              <div className="header"><i className="wait icon"></i> Recent</div>
            </div>
          </div>
          {this.state.channels.recent.map(function(channel) {
            var url = '/c/' + channel;
            var channelName = '/' + channel;
            return <Link className="item" to={url} key={channel}>{channelName}</Link>;
          })}
        </div>
      </div>
    );
  }
});

module.exports = ChannelsList;
