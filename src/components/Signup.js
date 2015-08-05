'use strict';

var React = require('react/addons');
var Link = require('react-router').Link;

//var Actions = require('actions/xxx')

require('styles/Signup.scss');

var Signup = React.createClass({
  componentDidMount: function() {
    $('.ui.checkbox').checkbox();
    $('.ui.form').form({});
  },

  render: function () {
    return (
      <div className="ui segment">
        <div className="ui form">
          <h3 className="ui header">Signup</h3>
          <div className="field">
            <label>Your name</label>
            <input type="text" name="name" placeholder="Your name" />
          </div>
          <div className="field">
            <label>Your e-mail</label>
            <input type="text" name="email" placeholder="Your e-mail" />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="two fields">
              <div className="field">
                <input type="password" name="password" placeholder="Your password"/>
              </div>
              <div className="field">
                <input type="password" name="password" placeholder="Retype your password"/>
              </div>
            </div>
          </div>
          <div className="inline field">
            <div className="ui checkbox">
              <input type="checkbox" tabindex="0" className="hidden" />
              <label>I agree to the terms and conditions</label>
            </div>
          </div>
          <div className="field">
            <div className="ui fluid blue submit button">Sign up</div>
          </div>
          <div className="field"><Link to='/login'>Already have an account?</Link></div>
          <div className="ui horizontal divider">
             Or
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Signup;
