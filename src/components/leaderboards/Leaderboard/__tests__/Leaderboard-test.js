jest.disableAutomock()
jest.mock('../../../../api/campaigns')

import _ from 'lodash'
import React from 'react'
import Leaderboard from '../'
import TestUtils from 'react-addons-test-utils'

describe('Leaderboard', function () {
  let findByClass = TestUtils.findRenderedDOMComponentWithClass

  describe('Component defaults', function () {
    let leaderboard
    let element

    beforeEach(function () {
      leaderboard = <Leaderboard campaignUid='au-0' />
      element = TestUtils.renderIntoDocument(leaderboard)
    })

    it('renders something', function () {
      expect(element).not.toBeNull()
    })

    it('renders a default heading', function () {
      let heading = findByClass(element, 'Leaderboard__heading')

      expect(heading.textContent).toBe('Top Individuals')
    })

    it('renders a loading icon', function () {
      element.setState({ isLoading: true })
      findByClass(element, 'Leaderboard__loading')
    })
  })

  describe('Custom component props', function () {
    let leaderboard
    let element
    let translation = {
      heading: 'Top Teams'
    }

    beforeEach(function () {
      leaderboard = <Leaderboard campaignUid='au-0' i18n={translation} />
      element = TestUtils.renderIntoDocument(leaderboard)
    })

    it('renders a custom heading', function () {
      let heading = findByClass(element, 'Leaderboard__heading')
      expect(heading.textContent).toBe(translation.heading)
    })
  })

  describe('standard competition ranking system', function () {
    let element
    let data

    beforeEach(function () {
      element = TestUtils.renderIntoDocument(<Leaderboard campaignUid='au-0' />)
    })

    it('assigns rank in order of amount', function () {
      data = [
        { id: 1, amount: 1100 },
        { id: 2, amount: 1000 },
        { id: 3, amount: 900 }
      ]

      element.rankLeaderboard(data)
      expect(_.map(data, 'rank')).toEqual([1, 2, 3])
    })

    it('gives results with the same amount the same rank', function () {
      data = [
        { id: 1, amount: 1000 },
        { id: 2, amount: 1000 }
      ]

      element.rankLeaderboard(data)
      expect(_.map(data, 'rank')).toEqual([1, 1])
    })

    it('leaves a gap to compensate for items with the same rank', function () {
      data = [
        { id: 1, amount: 1100 },
        { id: 2, amount: 1000 },
        { id: 3, amount: 1000 },
        { id: 4, amount: 1000 },
        { id: 5, amount: 900 }
      ]

      element.rankLeaderboard(data)
      expect(_.map(data, 'rank')).toEqual([1, 2, 2, 2, 5])
    })
  })

  describe('Number formatting options', function () {
    it('renders in a long format with commas by default', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' />
      let element = TestUtils.renderIntoDocument(leaderboard)

      expect(element.formatAmount(100000)).toEqual('$1,000')
    })

    it('renders a different format if given acceptable numeral.js string', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' currencyFormat='0.00' />
      let element = TestUtils.renderIntoDocument(leaderboard)

      expect(element.formatAmount(10000)).toEqual('$100.00')
    })
  })

  describe('paging button rendering', function () {
    it('renders a paging component if multiple pages are available', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' limit={10} pageSize={5} />
      let element = TestUtils.renderIntoDocument(leaderboard)
      element.setState({
        isLoading: false,
        resultCount: 10
      })

      let pagingFunction = element.renderPaging()
      expect(pagingFunction).toBeDefined()
    })

    it('does not render a paging component if only 1 page is available', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' limit={5} pageSize={5} />
      let element = TestUtils.renderIntoDocument(leaderboard)
      element.setState({ isLoading: false })

      let pagingFunction = element.renderPaging()
      expect(pagingFunction).toBeUndefined()
    })
  })

  describe('handleHasContentCallback', function () {
    let element
    let onHasContent = jasmine.createSpy()
    let board = [1]

    describe('callback is not passed in', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' />
      beforeEach(function () {
        element = TestUtils.renderIntoDocument(leaderboard)
      })

      it('should not be called', function () {
        element.handleHasContentCallback(board)
        expect(onHasContent).not.toHaveBeenCalled()
      })
    })

    describe('callback is passed in', function () {
      let leaderboard = <Leaderboard campaignUid='au-0' onHasContent={onHasContent} />
      beforeEach(function () {
        element = TestUtils.renderIntoDocument(leaderboard)
      })

      it('should not be called when leaderboard is empty', function () {
        element.handleHasContentCallback([])
        expect(onHasContent).not.toHaveBeenCalled()
      })

      it('should be called when leaderboard is not empty', function () {
        element.handleHasContentCallback(board)
        expect(onHasContent).toHaveBeenCalled()
      })
    })
  })
})
