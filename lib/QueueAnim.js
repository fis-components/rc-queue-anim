'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _velocityAnimate = require('velocity-animate');

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

var _utils = require('./utils');

var _animTypes = require('./animTypes');

var _animTypes2 = _interopRequireDefault(_animTypes);

var BackEase = {
  easeInBack: [0.6, -0.28, 0.735, 0.045],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55]
};

var placeholderKeyPrefix = 'ant-queue-anim-placeholder-';

var QueueAnim = (function (_React$Component) {
  _inherits(QueueAnim, _React$Component);

  function QueueAnim() {
    var _this = this;

    _classCallCheck(this, QueueAnim);

    _get(Object.getPrototypeOf(QueueAnim.prototype), 'constructor', this).apply(this, arguments);

    this.keysToEnter = [];
    this.keysToLeave = [];
    this.keysAnimating = [];
    this.placeholderTimeoutIds = {};

    // 第一次进入，默认进场
    var children = (0, _utils.toArrayChildren)((0, _utils.getChildrenFromProps)(this.props));
    children.forEach(function (child) {
      if (!child || !child.key) {
        return;
      }
      _this.keysToEnter.push(child.key);
    });

    this.originalChildren = (0, _utils.toArrayChildren)((0, _utils.getChildrenFromProps)(this.props));

    this.state = {
      children: children,
      childrenShow: {}
    };

    ['performEnter', 'performLeave', 'enterBegin', 'leaveComplete'].forEach(function (method) {
      return _this[method] = _this[method].bind(_this);
    });
  }

  _createClass(QueueAnim, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.componentDidUpdate();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var nextChildren = (0, _utils.toArrayChildren)(nextProps.children);
      var currentChildren = this.originalChildren;
      var newChildren = (0, _utils.mergeChildren)(currentChildren, nextChildren);

      this.keysToEnter = [];
      this.keysToLeave = [];
      this.keysAnimating = [];

      // need render to avoid update
      this.setState({
        children: newChildren
      });

      nextChildren.forEach(function (c) {
        if (!c) {
          return;
        }
        var key = c.key;
        var hasPrev = (0, _utils.findChildInChildrenByKey)(currentChildren, key);
        if (!hasPrev && key) {
          _this2.keysToEnter.push(key);
        }
      });

      currentChildren.forEach(function (c) {
        if (!c) {
          return;
        }
        var key = c.key;
        var hasNext = (0, _utils.findChildInChildrenByKey)(nextChildren, key);
        if (!hasNext && key) {
          _this2.keysToLeave.push(key);
        }
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.originalChildren = (0, _utils.toArrayChildren)((0, _utils.getChildrenFromProps)(this.props));
      var keysToEnter = Array.prototype.slice.call(this.keysToEnter);
      var keysToLeave = Array.prototype.slice.call(this.keysToLeave);
      if (this.keysAnimating.length === 0) {
        this.keysAnimating = keysToEnter.concat(keysToLeave);
      }
      keysToEnter.forEach(this.performEnter);
      keysToLeave.forEach(this.performLeave);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      if (this.originalChildren && this.originalChildren.length > 0) {
        this.originalChildren.forEach(function (child) {
          if (_this3.refs[child.key]) {
            (0, _velocityAnimate2['default'])((0, _reactDom.findDOMNode)(_this3.refs[child.key]), 'stop');
          }
        });
        Object.keys(this.placeholderTimeoutIds).forEach(function (key) {
          clearTimeout(_this3.placeholderTimeoutIds[key]);
        });
      }
    }
  }, {
    key: 'getVelocityConfig',
    value: function getVelocityConfig(index) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.props.animConfig) {
        return _utils.transformArguments.apply(undefined, [this.props.animConfig].concat(args))[index];
      }
      return _animTypes2['default'][_utils.transformArguments.apply(undefined, [this.props.type].concat(args))[index]];
    }
  }, {
    key: 'getVelocityEnterConfig',
    value: function getVelocityEnterConfig() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.getVelocityConfig.apply(this, [0].concat(args));
    }
  }, {
    key: 'getVelocityLeaveConfig',
    value: function getVelocityLeaveConfig() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var config = this.getVelocityConfig.apply(this, [1].concat(args));
      var ret = {};
      Object.keys(config).forEach(function (key) {
        if (Array.isArray(config[key])) {
          ret[key] = Array.prototype.slice.call(config[key]).reverse();
        } else {
          ret[key] = config[key];
        }
      });
      return ret;
    }
  }, {
    key: 'getVelocityEasing',
    value: function getVelocityEasing() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _utils.transformArguments.apply(undefined, [this.props.ease].concat(args)).map(function (easeName) {
        if (typeof easeName === 'string') {
          return BackEase[easeName] || easeName;
        }
      });
    }
  }, {
    key: 'performEnter',
    value: function performEnter(key, i) {
      var interval = (0, _utils.transformArguments)(this.props.interval, key, i)[0];
      var delay = (0, _utils.transformArguments)(this.props.delay, key, i)[0];
      this.placeholderTimeoutIds[key] = setTimeout(this.performEnterBegin.bind(this, key, i), interval * i + delay);
      if (this.keysToEnter.indexOf(key) >= 0) {
        this.keysToEnter.splice(this.keysToEnter.indexOf(key), 1);
      }
    }
  }, {
    key: 'performEnterBegin',
    value: function performEnterBegin(key, i) {
      var childrenShow = this.state.childrenShow;
      childrenShow[key] = true;
      this.setState({ childrenShow: childrenShow }, this.realPerformEnter.bind(this, key, i));
    }
  }, {
    key: 'realPerformEnter',
    value: function realPerformEnter(key, i) {
      var node = (0, _reactDom.findDOMNode)(this.refs[key]);
      if (!node) {
        return;
      }
      var duration = (0, _utils.transformArguments)(this.props.duration, key, i)[0];
      node.style.visibility = 'hidden';
      (0, _velocityAnimate2['default'])(node, 'stop');
      (0, _velocityAnimate2['default'])(node, this.getVelocityEnterConfig(key, i), {
        duration: duration,
        easing: this.getVelocityEasing(key, i)[0],
        visibility: 'visible',
        begin: this.enterBegin.bind(this, key),
        complete: this.enterComplete.bind(this, key)
      });
    }
  }, {
    key: 'performLeave',
    value: function performLeave(key, i) {
      clearTimeout(this.placeholderTimeoutIds[key]);
      delete this.placeholderTimeoutIds[key];
      var node = (0, _reactDom.findDOMNode)(this.refs[key]);
      if (!node) {
        return;
      }
      var interval = (0, _utils.transformArguments)(this.props.interval, key, i)[1];
      var delay = (0, _utils.transformArguments)(this.props.delay, key, i)[1];
      var duration = (0, _utils.transformArguments)(this.props.duration, key, i)[1];
      var order = this.props.leaveReverse ? this.keysToLeave.length - i - 1 : i;
      (0, _velocityAnimate2['default'])(node, 'stop');
      (0, _velocityAnimate2['default'])(node, this.getVelocityLeaveConfig(key, i), {
        delay: interval * order + delay,
        duration: duration,
        easing: this.getVelocityEasing(key, i)[1],
        begin: this.leaveBegin.bind(this),
        complete: this.leaveComplete.bind(this, key)
      });
    }
  }, {
    key: 'enterBegin',
    value: function enterBegin(key, elements) {
      var _this4 = this;

      elements.forEach(function (elem) {
        elem.className += ' ' + _this4.props.animatingClassName[0];
      });
    }
  }, {
    key: 'enterComplete',
    value: function enterComplete(key, elements) {
      var _this5 = this;

      if (this.keysAnimating.indexOf(key) >= 0) {
        this.keysAnimating.splice(this.keysAnimating.indexOf(key), 1);
      }
      elements.forEach(function (elem) {
        elem.className = elem.className.replace(_this5.props.animatingClassName[0], '').trim();
      });
    }
  }, {
    key: 'leaveBegin',
    value: function leaveBegin(elements) {
      var _this6 = this;

      elements.forEach(function (elem) {
        elem.className += ' ' + _this6.props.animatingClassName[1];
      });
    }
  }, {
    key: 'leaveComplete',
    value: function leaveComplete(key, elements) {
      var _this7 = this;

      if (this.keysAnimating.indexOf(key) < 0) {
        return;
      }
      this.keysAnimating.splice(this.keysAnimating.indexOf(key), 1);
      var childrenShow = this.state.childrenShow;
      childrenShow[key] = false;
      if (this.keysToLeave.indexOf(key) >= 0) {
        this.keysToLeave.splice(this.keysToLeave.indexOf(key), 1);
      }
      var needLeave = this.keysToLeave.some(function (c) {
        return childrenShow[c];
      });
      if (!needLeave) {
        var currentChildren = (0, _utils.toArrayChildren)((0, _utils.getChildrenFromProps)(this.props));
        this.setState({
          children: currentChildren,
          childrenShow: childrenShow
        });
      }
      elements.forEach(function (elem) {
        elem.className = elem.className.replace(_this7.props.animatingClassName[1], '').trim();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var childrenToRender = (0, _utils.toArrayChildren)(this.state.children).map(function (child) {
        if (!child || !child.key) {
          return child;
        }
        return _this8.state.childrenShow[child.key] ? (0, _react.cloneElement)(child, {
          ref: child.key,
          key: child.key
        }) : (0, _react.createElement)('div', {
          ref: placeholderKeyPrefix + child.key,
          key: placeholderKeyPrefix + child.key
        });
      });
      return (0, _react.createElement)(this.props.component, this.props, childrenToRender);
    }
  }]);

  return QueueAnim;
})(_react2['default'].Component);

var numberOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.array]);
var stringOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.array]);
var objectOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.object, _react2['default'].PropTypes.array]);
var funcOrStringOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, stringOrArray]);
var funcOrObjectOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, objectOrArray]);
var funcOrNumberOrArray = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, numberOrArray]);

QueueAnim.propTypes = {
  component: _react2['default'].PropTypes.string,
  interval: numberOrArray,
  duration: funcOrNumberOrArray,
  delay: funcOrNumberOrArray,
  type: funcOrStringOrArray,
  animConfig: funcOrObjectOrArray,
  ease: funcOrStringOrArray,
  leaveReverse: _react2['default'].PropTypes.bool,
  animatingClassName: _react2['default'].PropTypes.array
};

QueueAnim.defaultProps = {
  component: 'div',
  interval: 100,
  duration: 500,
  delay: 0,
  type: 'right',
  animConfig: null,
  ease: 'easeOutQuart',
  leaveReverse: false,
  animatingClassName: ['queue-anim-entering', 'queue-anim-leaving']
};

exports['default'] = QueueAnim;
module.exports = exports['default'];