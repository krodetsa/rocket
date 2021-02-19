function rect(color, x, y, width, height) {
    this.color = color; // цвет прямоугольника
    this.x = x; // координата х
    this.y = y; // координата у
    this.width = width; // ширина
    this.height = height; // высота
    this.draw = function() // Метод рисующий прямоугольник
    {
      // context.save();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        // context.restore();
    }
}
function fadeIn(element, duration, callback) {
  element.style.opacity = 0;
  element.style.display = "block";

  var startTime = Date.now();
  var tick = function() {
    var newOpacity = (Date.now() - startTime) / duration;
    if (newOpacity > 1) {
      newOpacity = 1;
      callback && callback();
    } else {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
        setTimeout(tick, 16);
    }

    element.style.opacity = newOpacity;
  };
  tick();
}
function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
function Particle(o) {
  this.decay = .95; //randomIntFromInterval(80, 95)/100;//
  this.r = randomIntFromInterval(10, 70);
  this.R = 100 - this.r;
  this.angle = Math.random() * 2 * Math.PI;
  this.center = o; //{x:cx,y:cy}
  this.pos = {};
  this.pos.x = this.center.x + this.r * Math.cos(this.angle);
  this.pos.y = this.center.y + this.r * Math.sin(this.angle);
  this.dest = {};
  this.dest.x = this.center.x + this.R * Math.cos(this.angle);
  this.dest.y = this.center.y + this.R * Math.sin(this.angle);
  this.color = colors[~~(Math.random() * colors.length)];
  this.vel = {
    x: 0,
    y: 0
  };
  this.acc = {
    x: 0,
    y: 0
  };
  this.update = function() {
    var dx = (this.dest.x - this.pos.x);
    var dy = (this.dest.y - this.pos.y);
    this.acc.x = dx * spring;
    this.acc.y = dy * spring;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel.x *= friction;
    this.vel.y *= friction;
    this.pos.x += this.vel.x *2;
    this.pos.y += this.vel.y *2;
    if (this.r > 0) this.r *= this.decay;
  }

  this.draw = function() {
    // context.save();
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    context.fill();
    // context.restore();
  }
}
function Explosion(x,y) {
  this.pos = {
    x: x,
    y: y
  };
  this.particles = [];
  for (var i = 0; i < 150; i++) {
    this.particles.push(new Particle(this.pos));
  }
  this.update = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if (this.particles[i].r < .5) {
        this.particles.splice(i, 1)
      }
    }

  }

  this.draw = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }
}

function rand(max) {
  return Math.random() * max;
}

function Star(canvas, size, speed) {
  this.context = canvas.getContext("2d");
  this.size = size;
  this.speed = speed;
  this.x = rand(canvas.width);
  this.y = rand(canvas.height);
}

Star.prototype.animate = function(delta) {
    if (doAnim) {
      this.x -= this.speed * delta;
      this.y += this.speed * delta;
    }

    if (this.y > canvas.height) {
      this.y = 0;
    }
    if (this.x < 0) {
      this.x = canvas.width;
    }
    // context.save();
    // this.context.fillStyle = "#ffffff";
    this.context.fillRect(this.x, this.y, this.size, this.size);
    // context.restore();
};

function initializeStars() {
  var winArea = canvas.width * canvas.height;
  var smallStarsDensity = 0.0001;
  var mediumStarsDensity = 0.00005;
  var largeStarsDensity = 0.00002;
  var smallStarsCount = winArea * smallStarsDensity;
  var mediumStarsCount = winArea * mediumStarsDensity;
  var largeStarsCount = winArea * largeStarsDensity;
  stars = [];
  for (var i = 0; i < smallStarsCount; i++) {
    stars.push(new Star(canvas, 1, 30));
  }

  for (var i = 0; i < mediumStarsCount; i++) {
    stars.push(new Star(canvas, 2, 100));
  }

  for (var i = 0; i < largeStarsCount; i++) {
    stars.push(new Star(canvas, 3, 50));
  }
}

function drawStars(delta) {
  for (var i = 0; i < stars.length; i++) {
    stars[i].animate(delta);
  }
}

var stars = [];
var ms = 16;
var lastPaintTime = 0;
function paintLoop(timestamp) {
  // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  var delta =
    (window.requestAnimationFrame ? timestamp - lastPaintTime : ms) / 1000;
  if(delta > 0.05){
    delta = 0.05;
  }
  drawStars(delta);
  (window.requestAnimationFrame && requestAnimationFrame(paintLoop)) ||
    setTimeout(paintLoop, ms);
  lastPaintTime = timestamp;
}

var resizeTimeout;
var resizeCooldown = 500;
// var lastResizeTime = Date.now();
function initializeBackground() {
  canvas = document.getElementById("rootCanvas");
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  initializeStars();
  (window.requestAnimationFrame && requestAnimationFrame(paintLoop)) ||
    setTimeout(paintLoop, ms);
}
var circleArr =[];
function initCircles(x, y){
 circleArr = [];
   for (var i = 0; i < circleNum; i++){
    var radius = 3;
    circleArr.push(new Circle(x, y, radius, i));
  }
}

function animateCircle (){
  myReq = requestAnimationFrame(animateCircle);
  if (circleArr.length > 0) {
    for (var i = 0; i < circleArr.length; i++){
     if (circleArr[i] !== undefined) {
       circleArr[i].update();
     }
    }
  }

};
function Point(x, y, speedY, width, color) {
  this.x = x + 28;
  this.y = y + 90;
  this.width = width;
  this.color = color;
  this.alpha = Math.random();
  this.speedY = speedY;
  this.speedX = (Math.random() * 5) - 1.5;
  this.active = true;

  this.physx = function () {
    this.y += this.speedY +1;
    this.x += this.speedX;
    this.speedX -= (Math.random() * 2);
    // console.log(this.speedX, this.alpha);
    if (this.alpha > 0.01) {
    	this.alpha -= 0.01;
    }
    if (this.y > canvas.height) this.kill();
    if (this.y < 0) this.kill();
    if (this.x > canvas.width) this.kill();
    if (this.x < 0) this.kill();
  };
  this.kill = function () {
    points.splice( points.indexOf( this ), 1 );
    this.active = false;
  };

  this.draw = function () {
    // console.log(counterX, this.x);
    let drawCircles = () => {
      context.save();
      context.beginPath();

      context.arc(this.x, this.y, Math.random() * 10, 0, Math.PI * 2);
      const gradient = context.createLinearGradient(200, 300, 400, 50);
      gradient.addColorStop(0, '#F9D423');
      gradient.addColorStop(1, 'red');
      context.fillStyle = gradient;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = '#fff';
      // fade out
      context.globalAlpha = this.alpha;
      context.fill();
      context.stroke();
      context.restore();
    }
    if (counterX - this.x < 200) {
      // console.log(counterX - this.x);
      drawCircles()
    }
    if (this.x > canvas.width - 300) {
      // console.log(counterX - this.x);
      drawCircles()
    }

  };
};

function rocketModel(x, y, angle) {
  this.x = x; // координата х
  this.y = y; // координата у
  this.angle = angle;
  var rocket = new Image();
  rocket.src = './img/rocket.png';
  this.draw = function() {
      // context.save();
      // context.rotate(this.angle * Math.PI / 180);
      context.drawImage(rocket, this.x, this.y, 150, 150);
      // context.restore();
    }
}
function Bullet(x,y) {
  this.x = x;
  this.y = y;
  this.draw = function() {
    context.beginPath();
    context.setLineDash([10, 10]);
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + 300, this.y - 70);
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.stroke();
  }
}
function Ufo(x, y, angle) {
  this.x = x; // координата х
  this.y = y; // координата у
  this.angle = angle;
  var rocket = new Image();
  rocket.src = './img/ufo.png';
  this.draw = function() {
      // context.save();
      // context.rotate(this.angle * Math.PI / 180);
      context.drawImage(rocket, this.x, this.y, 150, 150);
      // context.restore();
    }
}
function CoinModel(x, y, angle, text, isUser){
  this.x = x; // координата х
  this.y = y; // координата у
  this.angle = angle;
  var coinImg = new Image();
  coinImg.src = './img/btc.png';

  this.draw = function() {
      context.stroke();
      context.drawImage(coinImg, this.x, this.y, 30, 30);
    }
  this.update = function() {

    this.x -= rocket.vX;
    this.y = y;
    context.font = 'bold 20px courier';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = isUser === true ? "gold" : '#ccc';
    context.fillText(text, this.x-25, this.y-25);
    context.fillStyle = '#ccc';
  }
};

function Circle(x, y, radius, index){
  this.x = x;
  this.y = y;
  this.dx = Math.random()*10-5;
  this.dy = Math.random()*10-5;
  this.gravity = 0;
  this.radius = radius;

  this.id = index;
  this.life = 0;
  this.maxLife = Math.random()*(1000-400)+2000;
  this.color = colorArr[Math.floor(Math.random()*colorArr.length)];
  this.draw = () => {
    context.save();
   context.beginPath();
   context.arc(this.x + 5.3 ,this.y,this.radius,0,Math.PI*2, true);
   context.strokeStyle = this.color;
   context.lineWidth = 5;
   context.globalAlpha = .5
   context.stroke();
   context.restore();
  }
  this.update = () => {
    if (doAnim === true) {
      if (this.x + this.radius > cw || this.x - this.radius < 0){
      this.dx = -this.dx + 5;
      }
      if (this.y + this.radius > ch || this.y - this.radius < 0){
        this.dy = -this.dy;
      }
      this.life++;
      if (this.life >= this.maxLife){
        delete circleArr[this.id];
      }
      this.x+=this.dx;
      this.y+=this.dy;
      this.dy += this.gravity;
      this.draw();
    } if (doAnim === false) {
      this.x=this.dx;
      this.y=this.dy;
      this.dy = this.gravity;
      this.draw();
    }
  }
}
animateCircle();
