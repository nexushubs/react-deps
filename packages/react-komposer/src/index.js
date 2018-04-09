/* eslint import/prefer-default-export: 0 */
import {
  setStubbingMode as _setStubbingMode,
  stub as _stub,
} from '@lvfang/react-stubber';
import _compose from './compose';
import {
  composeWithTracker as _composeWithTracker,
  getTrackerLoader as _getTrackerLoader
} from './composers';

export const setStubbingMode = _setStubbingMode;
export const stub = _stub;
export const compose = _compose;

export function setDefaults(mainOptions = {}) {
  return function (dataLoader, otherOptions = {}) {
    const options = {
      ...mainOptions,
      ...otherOptions,
    };

    return _compose(dataLoader, options);
  };
}

export function merge(...enhancers) {
  // TODO: Try to get a single HOC merging all the composers together
  return function (Child) {
    return enhancers.reduce((C, enhancer) => {
      return enhancer(C);
    }, Child);
  };
}

export const composeAll = merge;
export const composeWithTracker = _composeWithTracker;
export const getTrackerLoader = getTrackerLoader;
