import EmberObject from '@ember/object';
import PanRecognizerMixin from 'ember-mobile-core/mixins/pan-recognizer';
import { module, test } from 'qunit';

module('Unit | Mixin | pan recognizer');

// Replace this with your real tests.
test('it works', function(assert) {
  let PanRecognizerObject = EmberObject.extend(PanRecognizerMixin);
  let subject = PanRecognizerObject.create();
  assert.ok(subject);
});
