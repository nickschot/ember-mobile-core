import {
  parseInitialTouchData,
  parseTouchData,
  isHorizontal,
  isVertical,
  getDirection,
  getPointDistance,
  getAngle
} from 'ember-mobile-core/utils/parse-touch-data';
import { module, test } from 'qunit';

module('Unit | Utility | parse-touch-data', function(hooks) {

  test('it returns the initial touch data', function(assert) {
    let e = new TouchEvent('touchmove');
    let touch = new Touch({
      identifier: Date.now(),
      target: window
    });

    let result = parseInitialTouchData(touch, e);

    assert.deepEqual(result, {
      data: {
        initial: {
          x: touch.clientX,
          y: touch.clientY,
          timeStamp: e.timeStamp
        },
        cache: {
          velocity: {
            distanceX: 0,
            distanceY: 0,
            timeStamp: e.timeStamp
          }
        },
        timeStamp: e.timeStamp,
        originalEvent: e
      },
      panStarted: false,
      panDenied: false,
    });
  });

  test('it returns the parsed touch data', function(assert) {
    let e = new TouchEvent('touchmove');
    let touch = new Touch({
      identifier: Date.now(),
      target: window
    });
    let previousTouchData = parseInitialTouchData(touch, e);

    let result = parseTouchData(previousTouchData, touch, e);

    assert.deepEqual(result, {
      data: {
        cache: {
          velocity: {
            distanceX: 0,
            distanceY: 0,
            timeStamp: e.timeStamp
          }
        },
        current: {
          angle: 360,
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          distanceX: 0,
          distanceY: 0,
          overallVelocity: 0,
          overallVelocityX: 0,
          overallVelocityY: 0,
          x: 0,
          y: 0
        },
        initial: previousTouchData.data.initial,
        originalEvent: e,
        timeStamp: e.timeStamp
      },
      panDenied: false,
      panStarted: false
    });
  });
});
