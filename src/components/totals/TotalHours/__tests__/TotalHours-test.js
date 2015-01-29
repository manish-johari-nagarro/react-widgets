"use strict";
jest.autoMockOff();
jest.mock('../../../../api/campaigns');

describe('TotalDistance', function() {
  var React       = require('react/addons');
  var TotalHours  = require('../');
  var campaigns   = require('../../../../api/campaigns');
  var TestUtils   = React.addons.TestUtils;
  var findByClass = TestUtils.findRenderedDOMComponentWithClass;

  describe('Component when handed multiple uids', function() {
    var totalHours;
    var element;

    beforeEach(function() {
      campaigns.findByUids.mockClear();
      totalHours = <TotalHours campaignUids={ ["us-22", "us-24"] } />;
      element = TestUtils.renderIntoDocument(totalHours);
    });

    it('renders something', function() {
      expect(element).not.toBeNull();
    });

    it('renders an icon by default', function() {
      var icon = findByClass(element, 'TotalHours__icon');
      expect(icon).not.toBeNull();
    });

    it('renders a loading icon', function() {
      element.setState({isLoading: true});
      findByClass(element, 'TotalHours__loading');
    });

    it('loads data for multiple campaigns', function() {
      expect(campaigns.findByUids.mock.calls.length).toEqual(1);
      expect(campaigns.findByUids).toBeCalledWith(["us-22", "us-24"], element.onSuccess);
    });
  });

  describe('Component when handed one uid', function() {
    var totalHours;
    var element;

    beforeEach(function() {
      campaigns.findByUids.mockClear();
      totalHours = <TotalHours campaignUid="us-22" />;
      element = TestUtils.renderIntoDocument(totalHours);
    });

    it('handles loads data for a single campaign', function() {
      expect(campaigns.findByUids.mock.calls.length).toEqual(1);
      expect(campaigns.findByUids).toBeCalledWith(["us-22"], element.onSuccess);
    });
  });

  describe('Custom component props', function() {
    var totalHours;
    var element;
    var translation = {
      title: 'Kilometers'
    };

    beforeEach(function() {
      totalHours = <TotalHours i18n={ translation } renderIcon={ false } />;
      element = TestUtils.renderIntoDocument(totalHours);
    });

    it('renders a custom title', function() {
      element.setState({
        isLoading: false,
        total: 123
      });
      var title = findByClass(element, 'TotalHours__title');

      expect(title.getDOMNode().textContent).toBe(translation.title);
    });
  });

  describe('Number formatting options', function() {
    it('renders in a human readable format by default', function() {
      var totalHours = <TotalHours campaignUid="au-0" />;
      var element = TestUtils.renderIntoDocument(totalHours);

      element.setState({
        isLoading: false,
        hasResults: true,
        total: 37800
      });

      var total = findByClass(element, 'TotalHours__total');
      expect(total.getDOMNode().textContent).toBe('10.5');
    });

    it('renders a different format if given acceptable numeral.js string', function() {
      var totalHours = <TotalHours campaignUid="au-0" format="0,0[.]00" />;
      var element = TestUtils.renderIntoDocument(totalHours);

      element.setState({
        isLoading: false,
        hasResults: true,
        total: 37800
      });

      var total = findByClass(element, 'TotalHours__total');
      expect(total.getDOMNode().textContent).toBe('10.50');
    });
  });
});
