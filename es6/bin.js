#!/usr/bin/env node

import yargs from 'yargs';
import stream from './index';
import constants from 'constants';
export function imapCmdLineOptions() {
  const defaults = {
      user: process.env.TEST_MAIL_ADDRESS,
      password: process.env.TEST_MAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
          rejectUnauthorized: false
      }
  };

  const given = yargs.argv;
  given.tlsOptions = {
    rejectUnauthorized: given.rejectUnauthorized === 'true',
    secureProtocol: given.secureProtocol ? constants[given.secureProtocol] : undefined
  };
  given.tls = given.tls === 'true';
  delete given['reject-unauthorized'];

  return Object.assign(defaults, given);
}

if (require.main === module) {
  const options = imapCmdLineOptions();
  stream(options).pipe(process.stdout);
}
