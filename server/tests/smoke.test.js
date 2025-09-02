const path = require('path');

describe('Server smoke tests', () => {
  test('project has server entry', () => {
    const serverPath = path.join(__dirname, '..', 'server.js');
    expect(require('fs').existsSync(serverPath)).toBe(true);
  });
});
