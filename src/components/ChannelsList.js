'use strict';

var React = require('react/addons');

require('font-awesome/css/font-awesome.css');
require('styles/ChannelsList.scss');

var ChannelsList = React.createClass({

  render: function () {
    return (
      <div className="channels-list">
        <form className="pure-form">
          <input type="text" className="pure-input-1" placeholder="Search channel" />
        </form>
          <div className="pure-menu">
            <span className="pure-menu-heading"><i className="fa fa-fire"></i> Trending</span>
            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/germany</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/nsfw</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/cats</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/funny</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/eurovision</a></li>
              <li className="pure-menu-heading"><i className="fa fa-clock-o"></i> New</li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/world</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/party</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/e3</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/holiday</a></li>
              <li className="pure-menu-item"><a href="/c/germany" className="pure-menu-link">/somereallycoolchannel</a></li>
            </ul>
        </div>
      </div>
    );
  }
});

module.exports = ChannelsList;
