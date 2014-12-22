"use strict";

var _                 = require('lodash');
var React             = require('react');
var I18nMixin         = require('../../mixins/I18n');
var pages             = require('../../../api/pages');
var Icon              = require('../../helpers/Icon');
var FundraiserImage   = require('../FundraiserImage');

module.exports = React.createClass({
  mixins: [I18nMixin],
  displayName: "RecentFundraisers",
  propTypes: {
    campaignUid: React.PropTypes.string,
    page: React.PropTypes.string,
    pageSize: React.PropTypes.string,
    renderIcon: React.PropTypes.bool,
    i18n: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      campaignUid: '',
      page: '1',
      pageSize: '6',
      type: 'individual',
      backgroundColor: '#EBEBEB',
      textColor: '#333333',
      defaultI18n: {
        heading: 'Fundraisers',
        emptyLabel: 'No fundraisers to display.'
      }
    };
  },

  getInitialState: function() {
    return {
      isLoading: false,
      hasResults: false,
      pageResults: []
    };
  },

  componentWillMount: function() {
    this.setState({
      isLoading: true
    });

    var props = this.props;

    pages.findByCampaign(props.campaignUid, props.type, props.pageSize, props.page, this.onSuccess);
  },

  onSuccess: function(result) {
    this.setState({
      isLoading: false,
      pageResults: result.pages
    },

    function() {
      if (!_.isEmpty(this.state.pageResults)) {
        this.setState({
          hasResults: true
        });
      }
    }.bind(this));
  },

  renderFundraiserImage: function() {
    var emptyLabel = this.t('emptyLabel');

    if (this.state.isLoading) {
      return <Icon className="RecentFundraisers__loading" icon="refresh" />;
    } else {
      if (this.state.hasResults) {
        return this.state.pageResults.map(function(d) {
          return <FundraiserImage key={ d.id } pageUrl={ d.url } imgSrc={ d.image.large_image_url } imgTitle={ d.name } />;
        });
      } else {
        return (
          <p className="RecentFundraisers__empty-label">{ emptyLabel }</p>
        );
      }
    }
  },

  render: function() {
    var heading = this.t('heading');
    var customStyle = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.textColor
    };

    return (
      <div className="RecentFundraisers" style={ customStyle }>
        <h3 className="RecentFundraisers__heading">{ heading }</h3>
        <div className="RecentFundraisers__content">
          { this.renderFundraiserImage() }
        </div>
      </div>
    );
  }
});
