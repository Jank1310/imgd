'use strict';

var React = require('react/addons');
var Link = require('react-router').Link;
//var Actions = require('actions/xxx')

require('styles/Login.scss');

var Login = React.createClass({

  render: function () {
    return (
      <div className="ui segment">
        <div className="ui form">
          <h3 className="ui header">Log in</h3>
          <div className="field">
            <label>Your e-mail</label>
            <input type="text" name="email" placeholder="Your e-mail" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Your password"/>
          </div>
          <div className="field">
            <div className="ui fluid blue submit button">Log in</div>
          </div>
          <div className="field"><Link to='/signup'>Need an account?</Link></div>

          <div className="ui horizontal divider">
             Or
          </div>
        </div>
      </div>
      );
  }
});

module.exports = Login;
