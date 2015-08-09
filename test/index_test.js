let moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

const imapStream = require(moduleRoot);

describe('imapStream', () => {
  it('works', async () => {
    const result = await imapStream();
    result.should.be.equal(42);
  });
});

