import { assign } from "@ember/polyfills"

/**
 * Generate initial touch data for passed Touch
 *
 * @function parseInitialTouchData
 * @param {Touch} touch A Touch instance
 * @param {TouchEvent} e The touch{start,move,end} event
 * @return {Object} Returns a TouchData object
 */
export function parseInitialTouchData(touch, e){
  return {
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
  }
}

/**
 * Generates useful touch data from current event based on previously generated data
 *
 * @function parseTouchData
 * @param {Object} previousTouchData Previous data returned by this or the parseInitialTouchData function
 * @param {Touch} touch A Touch instance
 * @param {TouchEvent} e The touch{start,move,end} event
 * @return {Object} The new touch data
 */
export default function parseTouchData(previousTouchData, touch, e) {
  const touchData = assign({}, previousTouchData);
  const data = touchData.data;

  if(data.current){
    data.current.deltaX = touch.clientX - data.current.x;
    data.current.deltaY = touch.clientY - data.current.y;
  } else {
    data.current = {};
    data.current.deltaX = touch.clientX - data.initial.x;
    data.current.deltaY = touch.clientY - data.initial.y;
  }

  data.current.x = touch.clientX;
  data.current.y = touch.clientY;
  data.current.distance = getPointDistance(data.initial.x, touch.clientX, data.initial.y, touch.clientY);
  data.current.distanceX = touch.clientX - data.initial.x;
  data.current.distanceY = touch.clientY - data.initial.y;
  data.current.angle = getAngle(data.initial.x, data.initial.y,  touch.clientX, touch.clientY);

  // overallVelocity can be calculated continuously
  const overallDeltaTime = e.timeStamp - data.initial.timeStamp;
  data.current.overallVelocityX = data.current.distanceX / overallDeltaTime || 0;
  data.current.overallVelocityY = data.current.distanceY / overallDeltaTime || 0;
  data.current.overallVelocity = Math.abs(data.current.overallVelocityX) > Math.abs(data.current.overallVelocityY)
    ? data.current.overallVelocityX
    : data.current.overallVelocityY;

  const deltaTime = e.timeStamp - data.cache.velocity.timeStamp;
  if(deltaTime > 33.34) {
    data.current.velocityX = (data.current.distanceX - data.cache.velocity.distanceX) / deltaTime || 0;
    data.current.velocityY = (data.current.distanceY - data.cache.velocity.distanceY) / deltaTime || 0;
    data.current.velocity = Math.abs(data.current.velocityX) > Math.abs(data.current.velocityY)
      ? data.current.velocityX
      : data.current.velocityY;

    data.cache.velocity = {
      distanceX: data.current.distanceX,
      distanceY: data.current.distanceY,
      timeStamp: e.timeStamp
    };
  }

  data.originalEvent = e;
  data.timeStamp = e.timeStamp;

  touchData.data = data;

  return touchData;
}

/**
 * Decides if the pan event is horizontal.
 *
 * @function isHorizontal
 * @param {Object} touchData
 * @return {Boolean} True if horizontal
 */
export function isHorizontal(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'left' || direction === 'right';
}

/**
 * Decides if the pan event is vertical
 *
 * @function isVertical
 * @param {Object} touchData
 * @return {Boolean} True if vertical
 */
export function isVertical(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'down' || direction === 'up';
}

/**
 * Decides the direction of the movement based on relative distance from the pan's origin.
 *
 * @function getDirection
 * @param {Number} x
 * @param {Number} y
 * @return {String} Returns the direction of the pan event. One of 'left', 'right', 'up', 'down'.
 */
function getDirection(x, y) {
  if(x === y){
    return 'none';
  } else if(Math.abs(x) >= Math.abs(y)){
    return x < 0 ? 'left' : 'right';
  } else {
    return y < 0 ? 'down' : 'up';
  }
}

/**
 * Calculates the distance between two points.
 *
 * @function getPointDistance
 * @param {Number} x0
 * @param {Number} x1
 * @param {Number} y0
 * @param {Number} y1
 * @return {Number} The distance between the two points.
 */
function getPointDistance(x0, x1, y0, y1) {
  return (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
}

/**
 * Calculates the angle between two points.
 *
 * @function getAngle
 * @param {Number} originX
 * @param {Number} originY
 * @param {Number} projectionX
 * @param {Number} projectionY
 * @return {Number} The angle between the two points.
 */
function getAngle(originX, originY, projectionX, projectionY) {
  const angle = Math.atan2(projectionY - originY, projectionX - originX) * ((180) / Math.PI);
  return 360 - ((angle < 0) ? (360 + angle) : angle);
}
