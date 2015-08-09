# imap-stream

A readable stream of imap mails

## Installation

```bash
npm install --save imap-stream
```

## How it works

It connect to imap account, retrieve list of folders,
and then read all mails in each folder, in turn.

You can opt to stream full messages or only headers.

Messages are in rfc822 format, separated by `\n\n`

## Usage

The module export a single function that accept an option,
as specified above. It return a readable stream with
standard node semantic.

### options:
 * user - username of the imap account.
 * password - password of the imap account.
 * host - imap server hostname
 * port - imap server port
 * tls - connection use tls
 * tlsOptions - tls advanced options


```javascript
  import imapStream from 'imap-stream';

  const stream = imapStream({
    user: process.env.MY_MAIL_ADDRESS,
    password: process.env.MY_MAIL_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  });

  stream.pipe(concat({encoding: 'string'}, result => {
    // result is a string with all account messages
    // in rfc822 format
  }));
```

## License


The MIT License (MIT)
Copyright (c) 2015 Andrea Parodi



