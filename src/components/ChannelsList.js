'use strict';

var React = require('react/addons');

require('font-awesome/css/font-awesome.css');
require('styles/ChannelsList.scss');

var ChannelsList = React.createClass({

  render: function () {
    return (
      <div className="channels-list">
        <form className="uk-form">
          <input type="text" placeholder="Search channel" />
        </form>
        <ul className="uk-list">
          <li><i className="fa fa-fire"></i> Popular</li>
          <li><a href="/c/germany">/germany</a></li>
          <li><a href="/c/germany">/nsfw</a></li>
          <li><a href="/c/germany">/cats</a></li>
          <li><a href="/c/germany">/funny</a></li>
          <li><a href="/c/germany">/eurovision</a></li>
        </ul>
        <ul className="uk-list">
          <li><i className="fa fa-clock-o"></i> Recent</li>
          <li><a href="/c/germany">/world</a></li>
          <li><a href="/c/germany">/party</a></li>
          <li><a href="/c/germany">/e3</a></li>
          <li><a href="/c/germany">/holiday</a></li>
          <li><a href="/c/germany">/somereallycoolchannel</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = ChannelsList;
