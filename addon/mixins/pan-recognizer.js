import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import parseTouchData from 'ember-mobile-core/utils/parse-touch-data';

export default Mixin.create({
  currentTouches: A(),

  didInsertElement(){
    this.element.style.touchAction = 'pan-y';
  },

  touchStart(e){
    for(const touch of e.changedTouches){
      const touchData = {
        lastTimeStamp: e.timeStamp,
        initial: {
          x: touch.clientX,
          y: touch.clientY
        }
      };

      get(this, 'currentTouches').insertAt(touch.identifier, touchData);
    }
  },
  touchMove(e){
    for(const touch of e.changedTouches){
      const touchData = parseTouchData(touch, e.timeStamp);

      console.log(touchData.current);

      get(this, 'currentTouches').replace(touch.identifier, 1, touchData);
    }
  },
  touchEnd(e){
    for(const touch of e.changedTouches){
      // const touchData = parseTouchData(touch, e.timeStamp);

      get(this, 'currentTouches').removeAt(touch.identifier, 1);
    }
  },
});
