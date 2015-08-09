'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _this = this;

var moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

var imapStream = require(moduleRoot);

describe('imapStream', function () {
  it('works', function callee$1$0() {
    var result;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(imapStream());

        case 2:
          result = context$2$0.sent;

          result.should.be.equal(42);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});