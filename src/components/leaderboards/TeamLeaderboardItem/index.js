/** @jsx React.DOM */
"use strict";

var _             = require('lodash');
var React         = require('react');

module.exports = React.createClass({
  displayName: 'TeamLeaderboardItem',

  render: function() {
    return (
      <li className="TeamLeaderboard__items-item">
        <div className="TeamLeaderboard__items-image">
          <img src="http://placehold.it/230x230" />
        </div>
        <div className="TeamLeaderboard__items-content">
          <div className="TeamLeaderboard__items-name">{ this.props.name }</div>
          <div className="TeamLeaderboard__items-stats">
            <div className="TeamLeaderboard__items-stat TeamLeaderboard__items-stat--members">
              <div className="TeamLeaderboard__items-stat-content">
                { this.props.totalMembers }
                <div className="TeamLeaderboard__items-stat-title">
                  { this.props.membersTitle }
                </div>
              </div>
            </div>
            <div className="TeamLeaderboard__items-stat TeamLeaderboard__items-stat--total">
              <div className="TeamLeaderboard__items-stat-content">
                { this.props.amount }
                <div className="TeamLeaderboard__items-stat-title">
                  { this.props.raisedTitle }
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
});
