import './../helpers/jsdom-support.js';

import React from 'react';
import { assert } from 'chai';
import TestUtils from 'react-addons-test-utils';
import Home from './home';

describe('Home Component', () => {
  it('should bind to DOM node', () => {
    const component = TestUtils.renderIntoDocument(
      React.createElement(Home)
    );

    assert.equal(component.state.text, 'Click Me!');

    TestUtils.Simulate.click(
      TestUtils.findRenderedDOMComponentWithClass(component, 'clickMe')
    );

    assert.equal(component.state.text, '!eM kcilC');
  });
});
