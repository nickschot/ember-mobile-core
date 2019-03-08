import { Spring as Wobble } from 'wobble';
import { assign } from '@ember/polyfills';

/**
 * @class Spring
 * @private
 */
export default class Spring {

  /**
   * @param callback
   * @param opts See: https://github.com/skevy/wobble#api
   */
  constructor(callback = () => {}, opts = {}){
    // use iOS configuration by default
    const config = assign({
      stiffness: 1000,
      damping: 500,
      mass: 3
    }, opts);

    this.spring = new Wobble(config);
    this.spring.onUpdate(callback);
    this.spring.onStop(() => this.stop());
  }

  start() {
    this.promise = null;

    return new Promise((resolve, reject) => {
      this.promise = { resolve, reject };

      const { fromValue, toValue, initialVelocity } = this.spring._config;

      // This is the same check as is done in wobble itself. It's needed to ensure our promise always resolves.
      if(fromValue !== toValue || initialVelocity !== 0){
        this.spring.start();
      } else {
        this.promise.resolve();
      }
    });
  }

  stop() {
    this.promise.resolve();
  }
}
