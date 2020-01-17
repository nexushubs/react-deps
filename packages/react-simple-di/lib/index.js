import React from 'react'
import ReactCreateClass from 'create-react-class'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

const getDisplayName = function (Comp) {
  return Comp.displayName || Comp.name || 'Component'
}

const hasOwnProperty = function (props, key) {
  return Object.prototype.hasOwnProperty.call(props, key)
}

export function injectDeps (context, _actions) {
  const actions = {}

  for (const key in _actions) {
    if (hasOwnProperty(_actions, key)) {
      const actionMap = _actions[key]
      const newActionMap = {}
      for (const actionName in actionMap) {
        if (hasOwnProperty(actionMap, actionName)) {
          newActionMap[actionName] = actionMap[actionName].bind(null, context)
        }
      }
      actions[key] = newActionMap
    }
  }

  return function (Component) {
    const ComponentWithDeps = ReactCreateClass({
      childContextTypes: {
        context: PropTypes.object,
        actions: PropTypes.object
      },

      getChildContext () {
        return {
          context,
          actions
        }
      },

      render () {
        return (
          <Component {...this.props} />
        )
      }
    })

    ComponentWithDeps.displayName = `WithDeps(${getDisplayName(Component)})`

    return hoistStatics(ComponentWithDeps, Component)
  }
}

const defaultMapper = (context, actions) => ({
  context: () => context,
  actions: () => actions
})

export function useDeps (mapper = defaultMapper) {
  return function (Component) {
    const ComponentUseDeps = ReactCreateClass({
      contextTypes: {
        context: PropTypes.object,
        actions: PropTypes.object
      },

      render () {
        const { context, actions } = this.context

        const mappedProps = mapper(context, actions)

        const newProps = {
          ...this.props,
          ...mappedProps
        }

        return (<Component {...newProps} />)
      }
    })

    ComponentUseDeps.displayName = `UseDeps(${getDisplayName(Component)})`

    return hoistStatics(ComponentUseDeps, Component)
  }
}
