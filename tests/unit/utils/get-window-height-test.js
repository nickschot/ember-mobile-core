import getWindowHeight from 'dummy/utils/get-window-height';
import { module, test } from 'qunit';

module('Unit | Utility | get-window-height', function() {

  test('it returns the window height', function(assert) {
    let result = getWindowHeight();
    assert.equal(result, window.innerHeight);
  });
});
