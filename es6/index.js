import { PassThrough } from 'stream';
import Imap from 'imap';
import thenify from 'thenify';
import concat from 'concat-stream';


function buildBoxesTree(boxes, parent = '') {
  const results = [];

  Object.keys(boxes).forEach( boxName => {
    const origBox = boxes[boxName];
    if (origBox.attribs.indexOf('\\Noselect') !== -1) {
      return;
    }
    const box = {
        text: boxName,
        id: parent + boxName
    };

    if (origBox.children) {
      const children = buildBoxesTree(
        origBox.children,
        box.id + origBox.delimiter
      );

      results.push( ...children );
    }

    results.push(box);
  });

  return results;
}

const streamBox = (stream, emitError, imap) => streamDone => {
  const f = imap.fetch('1:*', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
  });

  let remaining = 0;

  f.on('error', emitError);
  f.once('end', () => {
    if (!remaining) {
      streamDone();
    }
  });

  f.on('message', msg => {
    remaining++;

    msg.once('body', bodyStream => {
      bodyStream.pipe(concat({
          encoding: 'string'
        },
        body => {
          stream.write(body);
          stream.write('\n\n');
          remaining--;
        }
      ));
    });
  });
};

export default function imapStream(options) {
  const imap = new Imap(options);
  const stream = new PassThrough();

  const getSubscribedBoxes = thenify(imap.getSubscribedBoxes).bind(imap);
  const openBox = thenify(imap.openBox).bind(imap);


  const emitError = stream.emit.bind(stream, 'error');

  imap.on('ready', async () => {
    try {
      const boxes = await getSubscribedBoxes();
      const boxList = buildBoxesTree(boxes);

      for (let boxDescr of boxList) {
        await openBox(boxDescr.id, true);
        await new Promise(streamBox(stream, emitError, imap));
      }

      stream.end();
    } catch(err) {
      emitError(err);
    }
  });

  imap.on('error', emitError);

  imap.connect();


  return stream;
}
