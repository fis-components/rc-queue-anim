'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.toArrayChildren = toArrayChildren;
exports.findChildInChildrenByKey = findChildInChildrenByKey;
exports.mergeChildren = mergeChildren;
exports.transformArguments = transformArguments;
exports.getChildrenFromProps = getChildrenFromProps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function toArrayChildren(children) {
  var ret = [];
  _react2['default'].Children.forEach(children, function (c) {
    ret.push(c);
  });
  return ret;
}

function findChildInChildrenByKey(children, key) {
  var ret = null;
  if (children) {
    children.forEach(function (c) {
      if (ret || !c) {
        return;
      }
      if (c.key === key) {
        ret = c;
      }
    });
  }
  return ret;
}

function mergeChildren(prev, next) {
  var ret = [];
  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  var nextChildrenPending = {};
  var pendingChildren = [];
  prev.forEach(function (c) {
    if (!c) {
      return;
    }
    if (findChildInChildrenByKey(next, c.key)) {
      if (pendingChildren.length) {
        nextChildrenPending[c.key] = pendingChildren;
        pendingChildren = [];
      }
    } else if (c.key) {
      pendingChildren.push(c);
    }
  });

  next.forEach(function (c) {
    if (!c) {
      return;
    }
    if (nextChildrenPending.hasOwnProperty(c.key)) {
      ret = ret.concat(nextChildrenPending[c.key]);
    }
    ret.push(c);
  });

  // 保持原有的顺序
  pendingChildren.forEach(function (c) {
    var originIndex = prev.indexOf(c);
    if (originIndex >= 0) {
      ret.splice(originIndex, 0, c);
    }
  });

  return ret;
}

function transformArguments(arg, key, i) {
  var result = undefined;
  if (typeof arg === 'function') {
    result = arg({
      key: key,
      index: i
    });
  } else {
    result = arg;
  }
  if (Array.isArray(result) && result.length === 2) {
    return result;
  }
  return [result, result];
}

function getChildrenFromProps(props) {
  return props && props.children;
}