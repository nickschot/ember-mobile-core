import Service from '@ember/service';
import { get, set } from '@ember/object';

/**
 * Provides a service which manage a lock for the current pan event based on the `elementId` of the component.
 * As soon as a lock is set other elements which recognize pan events will not respond.
 *
 * NOTE: You will likely not need to use this service directly. The `PanRecognizer` mixin provides lock methods.
 *
 * @class PanManagerService
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
