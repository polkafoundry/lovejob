const assert = require('assert');
const app = require('../../src/app');

describe('\'notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('notification');

    assert.ok(service, 'Registered the service');
  });
});
