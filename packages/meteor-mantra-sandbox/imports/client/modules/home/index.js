import _ from 'lodash'
import React, { Component } from 'react'
import { composeAll, composeWithTracker, useDeps } from '@lvfang/mantra-core/src'
import { mount } from '../../../config'
import { LayoutContainer } from '../common'

import shallowequal from 'shallowequal'

window._ = _
window.shallowequal = shallowequal

const HomeTracker = ({ Collections, LocalState, ...props }, onData) => {
  if (!Meteor.subscribe('posts1').ready()) return

  const timestamp = LocalState.get('timestamp').toString()
  const posts = Collections.Posts.find().fetch()
  onData(null, { timestamp, posts, ...props })
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
    const { timestamp, posts, ts } = this.props
    console.log('render', ts)
    return (
      <div>
        <h3>home</h3>
        <div>{this.props.timestamp}</div>
        <div>{this.props.ts}</div>

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

class HomeCompWrapper extends Component {
  state = {
    ts: Date.now(),
  }

  render() {
    return (
      <>
        <button onClick={() => {
          this.setState({ ts: Date.now() })
        }}>set new ts</button>
        {this.props.children({ ts: this.state.ts })}
      </>
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
          children: () => (
            <HomeCompWrapper>
              {({ ts }) => (
                <HomeInjected ts={ts} />
              )}
            </HomeCompWrapper>
          )
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
