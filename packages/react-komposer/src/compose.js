import React from 'react';
import shallowEqual from 'shallowequal';
import pick from 'lodash.pick';
import { mayBeStubbed } from '@lvfang/react-stubber';
import { inheritStatics, isStateless } from './utils';

let _options = {
  errorHandler: (err) => { throw err; },
  loadingHandler: () => null,
  env: {},
  pure: false,
  propsToWatch: null, // Watch all the props.
  shouldSubscribe: null,
  shouldUpdate: null,
  withRef: true
};

export function setOptions(options) {
  _options = { ..._options, ...options };
}

export default function compose(dataLoader, options = {}) {
  return function (Child) {
    options = { ..._options, ...options };

    if (isStateless(Child)) {
      withRef = false;
    }

    class Container extends React.Component {
      constructor(props, ...args) {
        super(props, ...args);
        this.state = {};
        this.propsCache = {};

        this._subscribe(props);
      }

      componentDidMount() {
        this._mounted = true;
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (shouldUpdate) {
          return shouldUpdate(this.props, nextProps);
        }

        if (!pure) {
          return true;
        }

        return (
          !shallowEqual(this.props, nextProps) ||
          this.state.error !== nextState.error ||
          !shallowEqual(this.state.data, nextState.data)
        );
      }

      componentDidUpdate() {
        this._subscribe(this.props);
      }

      componentWillUnmount() {
        this._unmounted = true;
        this._unsubscribe();
      }

      _shouldSubscribe(props) {
        const firstRun = !this._cachedWatchingProps;
        const nextProps = propsToWatch === null ? props : pick(props, propsToWatch);
        const currentProps = this._cachedWatchingProps || {};
        this._cachedWatchingProps = nextProps;

        if (firstRun) return true;
        if (typeof shouldSubscribe === 'function') {
          return shouldSubscribe(currentProps, nextProps);
        }

        if (propsToWatch !== null && propsToWatch.length === 0) return false;
        return !shallowEqual(currentProps, nextProps);
      }

      _subscribe(props) {
        if (!this._shouldSubscribe(props)) return;

        const onData = (error, data) => {
          if (this._unmounted) {
            throw new Error(`Trying to set data after component(${Container.displayName}) has unmounted.`);
          }

          const payload = { error, data };

          if (!this._mounted) {
            this.state = {
              ...this.state,
              ...payload,
            };
            return;
          }

          this.setState(payload);
        };

        // We need to do this before subscribing again.
        this._unsubscribe();
        this._stop = dataLoader(props, onData, env);
      }

      _unsubscribe() {
        if (this._stop) {
          this._stop();
        }
      }

      render() {
        const props = this.props;
        const { data, error } = this.state;

        if (error) {
          return errorHandler(error);
        }

        if (!data) {
          return loadingHandler();
        }

        const finalProps = {
          ...props,
          ...data,
        };

        const setChildRef = (c) => {
          this.child = c;
        };

        return withRef
          ? <Child ref={setChildRef} {...finalProps} />
          : <Child {...finalProps} />;
      }
    }

    Container.__komposerData = {
      dataLoader, options,
    };

    inheritStatics(Container, Child);
    return mayBeStubbed(Container);
  };
}
