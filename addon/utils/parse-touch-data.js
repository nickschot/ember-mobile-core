import { assign } from "@ember/polyfills"

export default function parseTouchData(previousTouchData, touch, timeStamp) {
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

  const deltaTime = timeStamp - data.timeStamp;
  if(deltaTime > 25){
    data.current.velocityX = data.current.deltaX / deltaTime || 0;
    data.current.velocityY = data.current.deltaY / deltaTime || 0;
    data.current.velocity = Math.abs(data.current.velocityX) > Math.abs(data.current.velocityY)
      ? data.current.velocityX
      : data.current.velocityY;

    data.timeStamp = timeStamp;
  }

  touchData.data = data;

  return touchData;
}

export function isHorizontal(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'left' || direction === 'right';
}
export function isVertical(touchData){
  const direction = getDirection(touchData.data.current.distanceX, touchData.data.current.distanceY);
  return direction === 'down' || direction === 'up';
}

function getDirection(x, y) {
  if(x === y){
    return 'none';
  } else if(Math.abs(x) >= Math.abs(y)){
    return x < 0 ? 'left' : 'right';
  } else {
    return y < 0 ? 'down' : 'up';
  }
}

function getPointDistance(x0, x1, y0, y1) {
  return (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
}

function getAngle(originX, originY, projectionX, projectionY) {
  const angle = Math.atan2(projectionY - originY, projectionX - originX) * ((180) / Math.PI);
  return 360 - ((angle < 0) ? (360 + angle) : angle);
}
