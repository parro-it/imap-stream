"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _Promise = require("babel-runtime/core-js/promise")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function imapStream() {
  return _regeneratorRuntime.async(function imapStream$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt("return", _Promise.resolve(42));

      case 1:
      case "end":
        return context$1$0.stop();
    }
  }, null, this);
};

module.exports = exports["default"];