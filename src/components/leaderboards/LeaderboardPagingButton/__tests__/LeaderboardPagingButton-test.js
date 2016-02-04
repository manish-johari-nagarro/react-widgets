'use strict';

jest.autoMockOff();

var React                   = require('react');
var ReactDOM                = require('react-dom');
var LeaderboardPagingButton = require('../');
var TestUtils               = require('react-addons-test-utils');
var findByClass             = TestUtils.findRenderedDOMComponentWithClass;

describe('LeaderboardPagingButton', function() {
  var leaderboardPagingButton;
  var component;
  var callback = jest.genMockFunction();

  var prevActiveClass = 'LeaderboardPagingButton__prev--active';
  var nextActiveClass = 'LeaderboardPagingButton__next--active';

  describe('paging defaults', function() {
    beforeEach(function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="next" action={ callback } currentPage={ 1 } pageCount={ 4 } />;

      component  = TestUtils.renderIntoDocument(leaderboardPagingButton);
    });

    it('renders a component', function() {
      expect(component).not.toBeNull();
    });

    it('triggers a callback when the button is clicked', function() {
      var pagingButton = findByClass(component, 'LeaderboardPagingButton__next');

      TestUtils.Simulate.click(pagingButton);
      expect(callback).toBeCalled();
    });
  });

  describe('next button', function() {
    it('displays a right pointing caret icon', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="next" action={ callback } currentPage={ 1 } pageCount={ 4 } />;
      component = TestUtils.renderIntoDocument(leaderboardPagingButton);

      var nextIcon = findByClass(component, 'fa-caret-right').getDOMNode();
      expect(nextIcon).not.toBeNull();
    });

    it('has an active modifier class by default', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="next" action={ callback } currentPage={ 1 } pageCount={ 4 } />;

      component = TestUtils.renderIntoDocument(leaderboardPagingButton);
      expect(component.getDOMNode().className).toContain(nextActiveClass);
    });

    it('has no active modifier class if the last page is displayed', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="next" action={ callback } currentPage={ 4 } pageCount={ 4 } />;

      component = TestUtils.renderIntoDocument(leaderboardPagingButton);
      expect(component.getDOMNode().className).not.toContain(nextActiveClass);
    });
  });

  describe('previous button', function() {
    it('displays a left pointing caret icon', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="prev" action={ callback } currentPage={ 4 } pageCount={ 4 } />;
      component = TestUtils.renderIntoDocument(leaderboardPagingButton);

      var prevIcon = findByClass(component, 'fa-caret-left').getDOMNode();
      expect(prevIcon).not.toBeNull();
    });

    it('has no active modifier class by default', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="prev" action={ callback } currentPage={ 1 } pageCount={ 4 } />;

      component = TestUtils.renderIntoDocument(leaderboardPagingButton);
      expect(component.getDOMNode().className).not.toContain(prevActiveClass);
    });

    it('has an active modifier class if the last page is displayed', function() {
      leaderboardPagingButton = <LeaderboardPagingButton type="prev" action={ callback } currentPage={ 4 } pageCount={ 4 } />;

      component = TestUtils.renderIntoDocument(leaderboardPagingButton);
      expect(component.getDOMNode().className).toContain(prevActiveClass);
    });
  });
});
