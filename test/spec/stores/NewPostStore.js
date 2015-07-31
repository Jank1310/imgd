'use strict';

describe('NewPostStore', () => {
  let store;

  beforeEach(() => {
    store = require('stores/NewPostStore.js');
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });
});
