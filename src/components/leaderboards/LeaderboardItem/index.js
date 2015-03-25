"use strict";

var React = require('react');

module.exports = React.createClass({
  displayName: 'LeaderboardItem',

  propTypes: {
    rank: React.PropTypes.string,
    imgSrc: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    isoCode: React.PropTypes.string.isRequired,
    amount: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired
  },

  render: function() {
    var style = {
      width: this.props.width
    };

    return (
      <div className="LeaderboardItem" style={ style }>
        <div className="LeaderboardItem__skin">
          <a href={ this.props.url } className="LeaderboardItem__image">
            <img src={ this.props.imgSrc } />
          </a>
          <div className="LeaderboardItem__content">
            <div className="LeaderboardItem__name">
              { this.props.name }
            </div>
            <div className="LeaderboardItem__amount">
              { this.props.amount }
            </div>
          </div>
          <div className="LeaderboardItem__rank">
            { this.props.rank }
          </div>
        </div>
      </div>
    );
  }
});
