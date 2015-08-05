'use strict';

describe('UserStore', () => {
  let store;

  beforeEach(() => {
    store = require('stores/UserStore.js');
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });
});
