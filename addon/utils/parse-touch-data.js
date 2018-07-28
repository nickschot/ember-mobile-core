import { assign } from "@ember/polyfills"

/**
 * Generate initial touch data for passed Touch
 * @param touch A Touch instance
 * @param e The touch{start,move,end} event
 * @returns {{data: {initial: {x: number, y: number, timeStamp: *|number}, timeStamp: *|number, originalEvent: *}, panStarted: boolean, panDenied: boolean}}
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
 * @param previousTouchData Previous data returned by this or the parseInitialTouchData function
 * @param touch A Touch instance
 * @param e The touch{start,move,end} event
 * @returns {*} The new touch data
 */
export function parseTouchData(previousTouchData, touch, e) {
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
 * Calculates whether the movement went either left or right
 * @param touchData A POJO as returned from `parseInitialTouchData` or `parseTouchData`
 * @returns {boolean} true, false
 */
export function isHorizontal(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'left' || direction === 'right';
}

/**
 * Calculates whether the movement went either up or down
 * @param touchData A POJO as returned from `parseInitialTouchData` or `parseTouchData`
 * @returns {boolean} true, false
 */
export function isVertical(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'down' || direction === 'up';
}

/**
 * Calculates the direction of the touch movement
 * @param x Number denoting the distance moved from the origin on the X axis
 * @param y Number denoting the distance moved from the origin on the Y axis
 * @returns {string} up, right, down, left
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
 * Calculates the distance between two points
 * @param x0 X coordinate of the origin
 * @param x1 X coordinate of the current position
 * @param y0 Y coordinate of the origin
 * @param y1 Y coordinate of the current position
 * @returns {number} Distance between the two points
 */
function getPointDistance(x0, x1, y0, y1) {
  return (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
}

/**
 * Calculates the angle between two points
 * @param originX
 * @param originY
 * @param projectionX
 * @param projectionY
 * @returns {number} Angle between the two points
 */
function getAngle(originX, originY, projectionX, projectionY) {
  const angle = Math.atan2(projectionY - originY, projectionX - originX) * ((180) / Math.PI);
  return 360 - ((angle < 0) ? (360 + angle) : angle);
}
