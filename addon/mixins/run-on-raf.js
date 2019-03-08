import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

export default Mixin.create({
  runOnRaf(fn) {
    //TODO: emcTicking is set on the ember component instance, prevents multiple schedules of different things (?)
    // should it be possible to schedule other work for this animation frame?
    if (!this.emcTicking) {
      this.emcTicking = true;

      window.requestAnimationFrame(() => {
        this.emcTicking = false;

        if (this.get('isDestroyed')) return;

        run(this, fn);
      });
    }
  }
});
