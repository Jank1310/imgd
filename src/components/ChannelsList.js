'use strict';

var React = require('react/addons');
var channelsStore = require('stores/ChannelsStore');
var Reflux = require('reflux');

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
              <div className="header">Popular</div>
            </div>
          </div>
          {this.state.channels.popular.map(function(channel) {
            var url = '/c/' + channel;
            return <a className="item" href={url} key={channel}>/{channel}</a>;
          })}
        </div>
        <div className="ui list">
        <div className="item">
          <div className="content">
            <div className="header">Recent</div>
          </div>
        </div>
          {this.state.channels.recent.map(function(channel) {
            return <a className="item" href="/c/{channel}" key={channel}>/{channel}</a>;
          })}
        </div>
      </div>
    );
  }
});

module.exports = ChannelsList;
