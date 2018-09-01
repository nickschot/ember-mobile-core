/**
 * Returns the current `window` width.
 *
 * @function getWindowWidth
 * @returns {Number} The width of the `window`.
 */
export default function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
}
