'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrackerLoader = exports.composeWithTracker = undefined;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composeWithTracker = exports.composeWithTracker = function composeWithTracker(reactiveFn, L, E, options) {
  var onPropsChange = function onPropsChange(props, onData, context) {
    var trackerCleanup = void 0;
    var handler = Tracker.nonreactive(function () {
      return Tracker.autorun(function () {
        trackerCleanup = reactiveFn(props, onData, context);
      });
    });

    return function () {
      if (typeof trackerCleanup === 'function') {
        trackerCleanup();
      }
      return handler.stop();
    };
  };

  return (0, _compose2.default)(onPropsChange, L, E, options);
};

var getTrackerLoader = exports.getTrackerLoader = function getTrackerLoader(reactiveMapper) {
  return function (props, onData, env) {
    var trackerCleanup = null;
    var handler = Tracker.nonreactive(function () {
      return Tracker.autorun(function () {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env);
      });
    });

    return function () {
      if (typeof trackerCleanup === 'function') trackerCleanup();
      return handler.stop();
    };
  };
};