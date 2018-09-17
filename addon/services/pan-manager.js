import Service from '@ember/service';
import { get, set } from '@ember/object';

/**
 * @class PanManagerService
 * @namespace Services
 * @public
 */
export default Service.extend({
  panLocked: false,

  lock(elementId){
    set(this, 'panLocked', elementId);
  },
  unlock(elementId){
    if(get(this, 'panLocked') === elementId){
      set(this, 'panLocked', false);
    }
  }
});
