import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';
import parseTouchData, {
  isHorizontal,
  isVertical
} from 'ember-mobile-core/utils/parse-touch-data';
import { A } from '@ember/array';

export default Mixin.create({
  // public
  threshold: 10,
  axis: 'horizontal',
  useCapture: false,

  // private
  currentTouches: null,

  init(){
    this._super(...arguments);

    set(this, 'currentTouches', A());
  },

  // hooks
  panStart(){},
  pan(){},
  panEnd(){},

  didInsertElement(){
    // if an axis is set, limit scroll to a single axis
    const axis = get(this, 'axis');
    if(axis === 'horizontal'){
      this.element.style.touchAction = 'pan-y';
    } else if(axis === 'vertical') {
      this.element.style.touchAction = 'pan-x';
    }

    const options = {
      capture: get(this, 'useCapture'),
      passive: true
    };
    this.element.addEventListener('touchstart', get(this, 'didTouchStart').bind(this), options);
    this.element.addEventListener('touchmove', get(this, 'didTouchMove').bind(this), options);
    this.element.addEventListener('touchend', get(this, 'didTouchEnd').bind(this), options);
  },
  willDestroyElement(){
    const options = {
      capture: get(this, 'useCapture'),
      passive: true
    };
    this.element.removeEventListener('touchstart', get(this, 'didTouchStart').bind(this), options);
    this.element.removeEventListener('touchmove', get(this, 'didTouchMove').bind(this), options);
    this.element.removeEventListener('touchend', get(this, 'didTouchEnd').bind(this), options);
  },

  // events
  didTouchStart(e){
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
  didTouchMove(e){
    for(const touch of e.changedTouches){
      const previousTouchData = get(this, 'currentTouches').objectAt(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e.timeStamp);

      // update original event
      touchData.data.originalEvent = e;

      if(touchData.panStarted){
        //TODO: make an API for this? We'd likely always want propagation to stop if a pan is active
        e.stopPropagation();
        this.pan(touchData.data);
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

            //TODO: make an API for this? We'd likely always want propagation to stop if a pan is active
            e.stopPropagation();

            // trigger panStart hook
            this.panStart(touchData.data);
          } else {
            touchData.panDenied = true;
          }
        }
      }

      get(this, 'currentTouches').splice(touch.identifier, 1, touchData);
    }
  },
  didTouchEnd(e){
    for(const touch of e.changedTouches){
      const previousTouchData = get(this, 'currentTouches').objectAt(touch.identifier);
      const touchData = parseTouchData(previousTouchData, touch, e.timeStamp);

      // update original event
      touchData.data.originalEvent = e;

      if(touchData.panStarted){
        this.panEnd(touchData.data);
      }

      get(this, 'currentTouches').removeAt(touch.identifier, 1);
    }
  },
  //TODO: touchCancel?
});
