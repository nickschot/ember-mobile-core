import EmberObject from '@ember/object';
import RunOnRafMixin from 'ember-mobile-core/mixins/run-on-raf';
import { module, test } from 'qunit';

module('Unit | Mixin | run on raf');

// Replace this with your real tests.
test('it works', function(assert) {
  let RunOnRafObject = EmberObject.extend(RunOnRafMixin);
  let subject = RunOnRafObject.create();
  assert.ok(subject);
});
