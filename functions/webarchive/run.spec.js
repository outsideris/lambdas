const { run } = require('./run');

describe('run()', () => {
  it('should takes screenshot and save it form list', (done) => {
    const urls = [
      'https://github.com',
      'https://github.com/outsideris',
      'https://blog.outsider.ne.kr',
    ];

    run(urls, done);
  });
});
