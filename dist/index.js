'use strict';

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = imapStream;

var _stream = require('stream');

var _imap = require('imap');

var _imap2 = _interopRequireDefault(_imap);

var _thenify = require('thenify');

var _thenify2 = _interopRequireDefault(_thenify);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

function buildBoxesTree(boxes) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  var results = [];

  _Object$keys(boxes).forEach(function (boxName) {
    var origBox = boxes[boxName];
    if (origBox.attribs.indexOf('\\Noselect') !== -1) {
      return;
    }
    var box = {
      text: boxName,
      id: parent + boxName
    };

    if (origBox.children) {
      var children = buildBoxesTree(origBox.children, box.id + origBox.delimiter);

      results.push.apply(results, _toConsumableArray(children));
    }

    results.push(box);
  });

  return results;
}

var streamBox = function streamBox(stream, emitError, imap) {
  return function (streamDone) {
    var f = imap.fetch('1:*', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });

    var remaining = 0;

    f.on('error', emitError);
    f.once('end', function () {
      if (!remaining) {
        streamDone();
      }
    });

    f.on('message', function (msg) {
      remaining++;

      msg.once('body', function (bodyStream) {
        bodyStream.pipe((0, _concatStream2['default'])({
          encoding: 'string'
        }, function (body) {
          stream.write(body);
          stream.write('\n\n');
          remaining--;
        }));
      });
    });
  };
};

function imapStream(options) {
  var _this = this;

  var imap = new _imap2['default'](options);
  var stream = new _stream.PassThrough();

  var getSubscribedBoxes = (0, _thenify2['default'])(imap.getSubscribedBoxes).bind(imap);
  var openBox = (0, _thenify2['default'])(imap.openBox).bind(imap);

  var emitError = stream.emit.bind(stream, 'error');

  imap.on('ready', function callee$1$0() {
    var boxes, boxList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, boxDescr;

    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(getSubscribedBoxes());

        case 3:
          boxes = context$2$0.sent;
          boxList = buildBoxesTree(boxes);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          context$2$0.prev = 8;
          _iterator = _getIterator(boxList);

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            context$2$0.next = 19;
            break;
          }

          boxDescr = _step.value;
          context$2$0.next = 14;
          return _regeneratorRuntime.awrap(openBox(boxDescr.id, true));

        case 14:
          context$2$0.next = 16;
          return _regeneratorRuntime.awrap(new _Promise(streamBox(stream, emitError, imap)));

        case 16:
          _iteratorNormalCompletion = true;
          context$2$0.next = 10;
          break;

        case 19:
          context$2$0.next = 25;
          break;

        case 21:
          context$2$0.prev = 21;
          context$2$0.t0 = context$2$0['catch'](8);
          _didIteratorError = true;
          _iteratorError = context$2$0.t0;

        case 25:
          context$2$0.prev = 25;
          context$2$0.prev = 26;

          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }

        case 28:
          context$2$0.prev = 28;

          if (!_didIteratorError) {
            context$2$0.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return context$2$0.finish(28);

        case 32:
          return context$2$0.finish(25);

        case 33:

          stream.end();
          context$2$0.next = 39;
          break;

        case 36:
          context$2$0.prev = 36;
          context$2$0.t1 = context$2$0['catch'](0);

          emitError(context$2$0.t1);

        case 39:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 36], [8, 21, 25, 33], [26,, 28, 32]]);
  });

  imap.on('error', emitError);

  imap.connect();

  return stream;
}

module.exports = exports['default'];