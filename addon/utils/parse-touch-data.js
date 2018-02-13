export default function parseTouchData(touch, timeStamp) {
  const touchData = this.get('currentTouches').objectAt(touch.identifier);

  if(touchData.current){
    touchData.current.deltaX = touch.clientX - touchData.current.x;
    touchData.current.deltaY = touch.clientY - touchData.current.y;
  } else {
    touchData.current = {};
    touchData.current.deltaX = touch.clientX - touchData.initial.x;
    touchData.current.deltaY = touch.clientY - touchData.initial.y;
  }

  touchData.current.x = touch.clientX;
  touchData.current.y = touch.clientY;
  touchData.current.distance = getPointDistance(touchData.initial.x, touch.clientX, touchData.initial.y, touch.clientY);
  touchData.current.angle = getAngle(touchData.initial.x, touchData.initial.y,  touch.clientX, touch.clientY);

  const deltaTime = timeStamp - touchData.lastTimeStamp;
  if(deltaTime > 25){
    touchData.current.velocityX = touchData.current.deltaX / deltaTime || 0;
    touchData.current.velocityY = touchData.current.deltaY / deltaTime || 0;
    touchData.current.velocity = Math.abs(touchData.current.velocityX) > Math.abs(touchData.current.velocityY)
      ? touchData.current.velocityX
      : touchData.current.velocityY;

    touchData.lastTimeStamp = timeStamp;
  }

  return touchData;
}

function getPointDistance(x0, x1, y0, y1) {
  return (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
}

function getAngle(originX, originY, projectionX, projectionY) {
  const angle = Math.atan2(projectionY - originY, projectionX - originX) * ((180) / Math.PI);
  return 360 - ((angle < 0) ? (360 + angle) : angle);
}
