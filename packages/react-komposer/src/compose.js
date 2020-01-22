import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
// import shallowEqual from 'shallowequal'
// import isEqual from 'lodash.isequal'
// import pick from 'lodash.pick'
import { mayBeStubbed } from '@lvfang/react-stubber'
import {
  inheritStatics,
  isStateless,
  isFunction,
  isArray
} from './utils'

let defaultOptions = {
  errorHandler: error => { throw error },
  loadingHandler: () => null,
  context: {},
  pure: false,
  propsToWatch: null,
  shouldTrack: null,
  shouldUpdate: null,
  withRef: true
}

export function setOptions (options = {}) {
  defaultOptions = {
    ...defaultOptions,
    ...options
  }

  return defaultOptions
}

export function compose (tracker, options = {}) {
  return function (Comp) {
    options = {
      ...defaultOptions,
      ...options
    }

    const {
      errorHandler,
      loadingHandler,
      context,
      pure,
      propsToWatch,
      shouldTrack,
      shouldUpdate
    } = options

    let {
      withRef
    } = options

    if (isStateless(Comp)) {
      withRef = false
    }

    const onData = (error, data) => {
      return { error, data }
    }

    function Container (...props) {
      console.log(1)
      const nextProps = useTracker(function () {
        return tracker(props, onData, context)
      }, [])

      return (
        withRef
          ? <Comp ref={setChildRef} {...nextProps} />
          : <Comp {...nextProps} />
      )
    }

    // inheritStatics(Container, Comp)
    return Container

    // return mayBeStubbed(Container)
  }
}

function setChildRef (ref) {
  this.child = ref
}
