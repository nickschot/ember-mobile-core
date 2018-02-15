import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import parseTouchData, {
  isHorizontal,
  isVertical
} from 'ember-mobile-core/utils/parse-touch-data';
import { A } from '@ember/array';

export default Mixin.create({
  // public
  threshold: 10,
  axis: 'horizontal',

  // private
  currentTouches: A(),

  // hooks
  panStart(){},
  pan(){},
  panEnd(){},

  didInsertElement(){
    this.element.style.touchAction = 'pan-y';
  },

  // events
  touchStart(e){
    for(const touch of e.changedTouches){
      const touchData = {
        data: {
          initial: {
            x: touch.clientX,
            y: touch.clientY,
            timeStamp: e.timeStamp
          },
          timeStamp: e.timeStamp,
          originalEvent: e
        },
        panStarted: false,
        panDenied: false,
      };

      get(this, 'currentTouches').insertAt(touch.identifier, touchData);
    }
  },
  touchMove(e){
    for(const touch of e.changedTouches){
      const previousTouchData = get(this, 'currentTouches').objectAt(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e.timeStamp);

      // update original event
      touchData.data.originalEvent = e;

      if(touchData.panStarted){
        get(this, 'pan')(touchData.data);
      } else {
        const axis = get(this, 'axis');

        // only pan when pan wasn't denied and the threshold for the given axis is achieved
        if(
          !touchData.panDenied
          && (
               (axis === 'horizontal' && Math.abs(touchData.data.current.distanceX) > get(this, 'threshold'))
            || (axis === 'vertical' && Math.abs(touchData.data.current.distanceY) > get(this, 'threshold'))
          )
        ){
          // test if axis matches with data else deny the pan
          if(  (axis === 'horizontal' && isHorizontal(touchData))
            || (axis === 'vertical' && isVertical(touchData))
          ){
            touchData.panStarted = true; //TODO: maybe keep this private

            // trigger panStart hook
            get(this, 'panStart')(touchData.data);
          } else {
            touchData.panDenied = true;
          }
        }
      }

      get(this, 'currentTouches').splice(touch.identifier, 1, touchData);
    }
  },
  touchEnd(e){
    for(const touch of e.changedTouches){
      const previousTouchData = get(this, 'currentTouches').objectAt(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e.timeStamp);

      // update original event
      touchData.data.originalEvent = e;

      if(touchData.panStarted){
        get(this, 'panEnd')(touchData.data);
      }

      get(this, 'currentTouches').removeAt(touch.identifier, 1);
    }
  },
  //TODO: touchCancel?
});
