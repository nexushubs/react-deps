import React, { Component } from 'react'
import { composeAll, composeWithTracker, useDeps } from '@lvfang/mantra-core'
import { mount } from '../../../config'
import { LayoutContainer } from '../common'

const HomeTracker = ({ Collections, LocalState }, onData) => {
  if (!Meteor.subscribe('posts1').ready()) return

  const timestamp = LocalState.get('timestamp').toString()
  const posts = Collections.Posts.find().fetch()
  onData(null, { timestamp, posts })
}

const HomeDeps = (context, actions) => ({
  ...context,
  ...actions,
})

class HomeComp extends Component {
  setTimestamp = ts => evt => {
    this.props.home.setTimestamp(ts)
  }

  render() {
    const { timestamp, posts } = this.props
    return (
      <div>
        <h3>home</h3>
        <div>{this.props.timestamp}</div>

        <button onClick={this.setTimestamp(Date.now())}>
          set new timestamp
        </button>

        {posts.map(post => (
          <div key={post._id}>{post.title}</div>
        ))}
      </div>
    )
  }
}

const HomeContainer = composeAll(
  composeWithTracker(HomeTracker),
  useDeps(HomeDeps),
)(HomeComp)

export default {
  routes: injectDeps => {
    const LayoutInjected = injectDeps(LayoutContainer)
    const HomeInjected = injectDeps(HomeContainer)

    FlowRouter.route('/', {
      action() {
        mount(LayoutInjected, {
          children: () => <HomeInjected />
        })
      }
    })
  },

  actions: {
    home: {
      setTimestamp: ({ LocalState }, timestamp) => {
        LocalState.set('timestamp', timestamp)
      }
    }
  },
}
