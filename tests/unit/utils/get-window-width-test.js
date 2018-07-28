import getWindowWidth from 'dummy/utils/get-window-width';
import { module, test } from 'qunit';

module('Unit | Utility | get-window-width', function() {

  test('it returns the window height', function(assert) {
    let result = getWindowWidth();
    assert.equal(result, window.innerWidth);
  });
});
