import _ from 'lodash'
import React from 'react'
import cx from 'classnames'
import fetchStaticLeaderboard from '../../../api/routes/staticLeaderboard'
import I18nMixin from '../../mixins/I18n'
import DOMInfoMixin from '../../mixins/DOMInfo'
import LeaderboardMixin from '../../mixins/Leaderboard'
import Icon from '../../helpers/Icon'
import LeaderboardItem from '../LeaderboardItem'
import LeaderboardEmpty from '../LeaderboardEmpty'
import LeaderboardFailed from '../LeaderboardFailed'
import numeral from 'numbro'
import addEventListener from '../../../lib/addEventListener'
import removeEventListener from '../../../lib/removeEventListener'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default React.createClass({
  displayName: 'Leaderboard',
  mixins: [I18nMixin, DOMInfoMixin, LeaderboardMixin],
  propTypes: {
    campaignSlug: React.PropTypes.string,
    campaignUid: React.PropTypes.string,
    campaignUids: React.PropTypes.array,
    charitySlug: React.PropTypes.string,
    charityUid: React.PropTypes.string,
    groupValues: React.PropTypes.array,
    groupValue: React.PropTypes.string,
    leaderboardId: React.PropTypes.string,
    country: React.PropTypes.oneOf(['au', 'ie', 'nz', 'uk', 'us']),
    limit: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    textColor: React.PropTypes.string,
    childWidth: React.PropTypes.number,
    currencyFormat: React.PropTypes.string,
    showCharity: React.PropTypes.bool,
    renderImage: React.PropTypes.bool,
    i18n: React.PropTypes.object,
    onHasContent: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      limit: 48,
      pageSize: 12,
      backgroundColor: null,
      textColor: null,
      childWidth: 250,
      showCharity: false,
      renderImage: true,
      currencyFormat: '0,0[.]00',
      groupValue: '',
      groupValues: [],
      defaultI18n: {
        heading: 'Top Individuals',
        emptyText: 'There are no individual supporters for this campaign yet. Be the first and register now!',
        emptyButtonText: 'Register',
        failedText: 'Unable to load leaderboard. Try back later.'
      }
    }
  },

  getInitialState () {
    return {
      isLoading: false,
      failedToLoad: false,
      boardData: [],
      currentPage: 1,
      childWidth: this.props.childWidth
    }
  },

  componentWillMount () {
    if (this.props.leaderboardId) {
      fetchStaticLeaderboard({
        id: this.props.leaderboardId
      }).then((pages) => {
        this.setState({
          boardData: this.paginateLeaderboard(pages),
          resultCount: pages.length,
          isLoading: false
        })
      })
    } else {
      this.loadLeaderboard('individual')
    }
  },

  componentDidMount () {
    addEventListener('resize', this.setChildWidth)
    this.setChildWidth()
  },

  componentWillUnmount () {
    removeEventListener('resize', this.setChildWidth)
  },

  setChildWidth: _.debounce(function () {
    this.setState({
      childWidth: this.getChildrenWidth(this.props.childWidth, this.props.pageSize)
    })
  }, 100, { trailing: true }),

  renderLoadingState () {
    return <Icon className='Leaderboard__loading' icon='refresh' />
  },

  renderEmptyState () {
    let emptyText = this.t('emptyText')
    let emptyButtonText = this.t('emptyButtonText')

    return <LeaderboardEmpty emptyText={emptyText} emptyButtonText={emptyButtonText} {...this.props} />
  },

  renderLeaderboardItems () {
    let currentPage = this.state.currentPage - 1
    let board = this.state.boardData[currentPage]

    return (
      <ReactCSSTransitionGroup
        className='Leaderboard__items'
        transitionName='Leaderboard__animation'
        transitionEnterTimeout={666}
        transitionLeaveTimeout={100}
        component='ol'>
        {
          board.map(function (item) {
            let formattedAmount = this.formatAmount(item.amount, item.symbol)
            let formattedRank = numeral(item.rank).format('0o')

            return (
              <LeaderboardItem
                key={item.id}
                rank={formattedRank}
                name={item.name}
                charityName={this.props.showCharity && item.charityName ? item.charityName : null}
                url={item.url}
                isoCode={item.isoCode}
                amount={formattedAmount}
                imgSrc={item.medImgSrc}
                width={String(this.state.childWidth)}
                renderImage={this.props.renderImage} />
            )
          }, this)
        }
      </ReactCSSTransitionGroup>
    )
  },

  renderFailedState () {
    return <LeaderboardFailed text={this.t('failedText')} />
  },

  render () {
    let state = this.state
    let heading = this.t('heading')
    let customStyle = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.textColor
    }

    let classes = cx({
      'Leaderboard': true,
      'Leaderboard--loading': state.isLoading,
      'Leaderboard--empty': !state.boardData.length
    })

    let content = state.failedToLoad
      ? this.renderFailedState
      : state.isLoading
      ? this.renderLoadingState
      : state.boardData.length
      ? this.renderLeaderboardItems
      : this.renderEmptyState

    return (
      <div className={classes} style={customStyle}>
        <h3 className='Leaderboard__heading'>{ heading }</h3>
        { content() }
        { this.renderPaging() }
      </div>
    )
  }
})
