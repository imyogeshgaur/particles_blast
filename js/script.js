var canvas = document.querySelector("#canvas"),
  ctx = canvas.getContext("2d");

canvas.addEventListener('click',()=>{
    var sound = new Audio('assets/blast.mp3');
    sound.play();
})
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var config = {
  particleNumber: 800,
  maxParticleSize: 10,
  maxSpeed: 40,
  colorVariation: 50,
};

var colorPalette = {
  bg: { r: 12, g: 9, b: 29 },
  matter: [
    { r: 255, g: 0, b: 0 },
    { r: 255, g: 127, b: 0 },
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 75, g: 0, b: 130 },
    { r: 148, g: 0, b: 211 },
  ],
};
var particles = [],
  centerX = canvas.width / 2,
  centerY = canvas.height / 2,
  drawBg,
  drawBg = function (ctx, color) {
    ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
var Particle = function (x, y) {
  this.x = x || Math.round(Math.random() * canvas.width);
  this.y = y || Math.round(Math.random() * canvas.height);
  this.r = Math.ceil(Math.random() * config.maxParticleSize);
  this.c = colorVariation(
    colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],
    true
  );
  this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), 0.7);
  this.d = Math.round(Math.random() * 360);
};
var colorVariation = function (color, returnString) {
  var r, g, b, a, variation;
  r = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.r
  );
  g = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.g
  );
  b = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.b
  );
  a = Math.random() + 0.5;
  if (returnString) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  } else {
    return { r, g, b, a };
  }
};
var updateParticleModel = function (p) {
  var a = 180 - (p.d + 90);
  p.d > 0 && p.d < 180
    ? (p.x += (p.s * Math.sin(p.d)) / Math.sin(p.s))
    : (p.x -= (p.s * Math.sin(p.d)) / Math.sin(p.s));
  p.d > 90 && p.d < 270
    ? (p.y += (p.s * Math.sin(a)) / Math.sin(p.s))
    : (p.y -= (p.s * Math.sin(a)) / Math.sin(p.s));
  return p;
};
var drawParticle = function (x, y, r, c) {
  ctx.beginPath();
  ctx.fillStyle = c;
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
};
var cleanUpArray = function () {
  particles = particles.filter((p) => {
    return p.x > -100 && p.y > -100;
  });
};

var initParticles = function (numParticles, x, y) {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(x, y));
  }
  particles.forEach((p) => {
    drawParticle(p.x, p.y, p.r, p.c);
  });
};
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
var frame = function () {
  drawBg(ctx, colorPalette.bg);
  particles.map((p) => {
    return updateParticleModel(p);
  });
  particles.forEach((p) => {
    drawParticle(p.x, p.y, p.r, p.c);
  });
  window.requestAnimFrame(frame);
};
document.body.addEventListener("click", function (event) {
  var x = event.clientX,
    y = event.clientY;
  cleanUpArray();
  initParticles(config.particleNumber, x, y);
});
frame();
initParticles(config.particleNumber);
