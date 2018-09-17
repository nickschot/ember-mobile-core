/**
 * Returns the current `window` height.
 *
 * @function getWindowHeight
 * @namespace Utils
 * @return {Number} The height of the `window`.
 */
export default function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
}
