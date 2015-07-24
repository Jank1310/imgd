'use strict';

describe('ImgdApp', () => {
  let React = require('react/addons');
  let ImgdApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ImgdApp = require('components/ImgdApp.js');
    component = React.createElement(ImgdApp);
  });

  it('should create a new instance of ImgdApp', () => {
    expect(component).toBeDefined();
  });
});
