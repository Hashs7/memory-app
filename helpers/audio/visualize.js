import drawDualbars from './visuals/drawDualbars.js';

// options:type,colors,stroke
export default function visualize(data, canvasId, options = {}, frame) {
  // make a clone of options
  options = { ...options };
  // options
  if (!options.stroke) options.stroke = 1;
  if (!options.colors)
    options.colors = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba'];

  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const h = canvas.height;
  const w = canvas.width;

  ctx.strokeStyle = options.colors[0];
  ctx.lineWidth = options.stroke;

  const typeMap = {
    dualbars: drawDualbars,
  };

  const frameRateMap = {
    bars: 1,
    'bars blocks': 1,
    'big bars': 1,
    cubes: 1,
    dualbars: 1,
    'dualbars blocks': 1,
    fireworks: 1,
    flower: 1,
    'flower blocks': 1,
    ring: 1,
    rings: 1,
    'round layers': 1,
    'round wave': 1,
    orbs: 1,
    shine: 1,
    'shine rings': 1,
    shockwave: 1,
    star: 1,
    static: 1,
    stitches: 1,
    wave: 1,
    web: 1,
  };

  const functionContext = {
    data,
    options,
    ctx,
    h,
    w,
    Helper: this.Helper,
    canvasId,
  };

  if (typeof options.type === 'string') options.type = [options.type];

  options.type.forEach((type) => {
    // abide by the frame rate
    if (frame % frameRateMap[type] === 0) {
      // clear canvas
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();

      typeMap[type](functionContext);
    }
  });
}
