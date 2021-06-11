import fromElement from './fromElement.js';
import visualize from './visualize.js';
import Helper from './helper.js';

function Wave() {
  this.current_stream = {};
  this.sources = {};
  this.onFileLoad = null;
  this.activeElements = {};
  this.activated = false;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

Wave.prototype = {
  fromElement,
  visualize,
  Helper,
};

export default Wave;
