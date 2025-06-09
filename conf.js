exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  specs: ['test/*.test.js'],
  capabilities: {
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: ['-headless']
    }
  }
};