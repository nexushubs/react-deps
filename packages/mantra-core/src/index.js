import {
  useDeps as _useDeps
} from '@lvfang/react-simple-di';

import {
  compose as _compose,
  composeWithTracker as _composeWithTracker,
  composeAll as _composeAll,
  disable as _disable,
  setDefaults as _setDefaults,
  setStubbingMode as _setStubbingMode,
  setOptions as _setOptions,
} from '@lvfang/react-komposer';

import App from './app';

// export this module's functions
export const createApp = (...args) => (new App(...args));

// export react-simple-di functions
export const useDeps = _useDeps;

// export react-komposer functions
export const compose = _compose;
export const composeWithTracker = _composeWithTracker;
export const composeAll = _composeAll;
export const disable = _disable;
export const setDefaults = _setDefaults;
export const setStubbingMode = _setStubbingMode;
export const setOptions = _setOptions;
