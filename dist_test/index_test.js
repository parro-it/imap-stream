'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

var moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

var imapStream = require(moduleRoot);

/*eslint-disable */
var expected = 'Date: Sat, 28 Dec 2013 07:12:01 -0800 (PST)\nSubject: Aggiungi una foto del profilo\nFrom: "Google+" <noreply-bbf11161@plus.google.com>\nTo: imaptest73@gmail.com\n\n\n\nDate: Tue, 03 Dec 2013 14:05:25 -0800 (PST)\nSubject: =?ISO-8859-1?Q?I_post_pi=F9_popolari_della_settimana_su_Google=2B?=\nFrom: "Google+" <noreply-bbf11161@plus.google.com>\nTo: imaptest73@gmail.com\n\n\n\nDate: Sat, 12 Oct 2013 17:39:49 +0200\nFrom: "imaptest73@gmail.com" <imaptest73@gmail.com>\nSubject: this is a test\n\n\n\n';
/*eslint-enable */

describe('imapStream', function imapStreamTest() {
  this.timeout(60000);
  it('works', function (done) {
    var stream = imapStream({
      user: process.env.TEST_MAIL_ADDRESS,
      password: process.env.TEST_MAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });
    stream.once('error', done);
    stream.pipe((0, _concatStream2['default'])({ encoding: 'string' }, function (result) {
      result.replace(/\r\n/g, '\n').should.be.equal(expected);
      done();
    }));
  });
});