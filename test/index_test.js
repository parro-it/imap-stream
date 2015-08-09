let moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}
import concat from 'concat-stream';
const imapStream = require(moduleRoot);

/*eslint-disable */
const expected = `Date: Sat, 28 Dec 2013 07:12:01 -0800 (PST)
Subject: Aggiungi una foto del profilo
From: "Google+" <noreply-bbf11161@plus.google.com>
To: imaptest73@gmail.com



Date: Tue, 03 Dec 2013 14:05:25 -0800 (PST)
Subject: =?ISO-8859-1?Q?I_post_pi=F9_popolari_della_settimana_su_Google=2B?=
From: "Google+" <noreply-bbf11161@plus.google.com>
To: imaptest73@gmail.com



Date: Sat, 12 Oct 2013 17:39:49 +0200
From: "imaptest73@gmail.com" <imaptest73@gmail.com>
Subject: this is a test



`;
/*eslint-enable */


describe('imapStream', function imapStreamTest() {
  this.timeout(60000);
  it('works', done => {
    const stream = imapStream({
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
    stream.pipe(concat({encoding: 'string'}, result => {
      result.replace(/\r\n/g, '\n').should.be.equal(expected);
      done();
    }));
  });
});

