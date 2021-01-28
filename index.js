var circleArr = [];
var circleNum = 150;
var time = 0;
var color = "#61dbfb";
canvas = document.getElementById("rootCanvas");
function init() {
    // объект который задаёт игровое поле
    colorArr = ['rgba(243,82,92,0.8)','rgba(0,103,76,0.5)','rgba(149,178,58,0.5)','rgba(252,206,68,0.8)','rgba(245,127,79,0.5)'];
    game = new rect("#000", 0, 0, 1024, 768);
    rocket = new rocketModel( 0, game.height-290, .1);
    line = new Line(0,100);
    // скорость ракеты
    rocket.vX = 5; // скорость по оси х
    rocket.vY = 1; // скорость по оси у
    rocket.vZ = 1; // z по оси у
    counterX = 0;
    currentPosX = 0;
    currentPosY = 0;
    canvas = document.getElementById("rootCanvas");
    cw = canvas.width;
    ch = canvas.height;
    canvas.width = game.width;
    canvas.height = game.height;
    context = canvas.getContext("2d");
    points = [];
    numOfpartlces = 100;
    for (let i = 0; i < numOfpartlces; i++) {
      let x = 0;
      let y = 0;
      let size = Math.random() * 100 + 2;
      let weight = Math.random() * 2 + 2; //speed
    }
    // canvas.onmousemove = playerMove; движение мышки на канвасе, мб пригодится
    setInterval(play, 1000 / 70);
    initCircles(10, game.height-250)
}
function Circle(x, y, radius, index){
  this.x = x;
  this.y = y;
  this.dx = Math.random()*10-5;
  this.dy = Math.random()*10-5;
  this.gravity = 0;
  this.radius = radius;

  this.id = index;
  this.life = 0;
  this.maxLife = Math.random()*(1000-400)+1000;
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
    if (this.x + this.radius > cw || this.x - this.radius < 0){
    this.dx = -this.dx;
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

  }
}
function LineDraw(x){

				time = time + .5;
          context.save();
				// context.clearRect(0, 0, canvas.width, canvas.height);

				context.beginPath();

				for(cnt = 0; cnt <= currentPosX+40; cnt++)
        // for(cnt = -1; cnt <= 50; cnt++)
  				{
            // console.log(cnt, game.height-220 - (Math.cos(time + cnt * .4) * 15));
  					context.lineTo(cnt, currentPosY + (Math.cos(time + cnt * .2) * 3 ));
  				}

				context.lineWidth = 2;
				context.strokeStyle = color;
				context.stroke();
        context.restore();
			}
// Отрисовка игры
function draw1() {
    game.draw(); // рисуем игровое поле
    // fire.draw();
    // рисуем на поле счёт
    context.font = 'bold 64px courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#ccc';
    context.fillText(counterX, 200, 200);
    context.fillStyle = '#ccc';
    rocket.draw(); // ракета
    // line.draw();

    /*
    Добавляем огонь
    */
    for (var i = 0; i < 5; i++) {
      var posX = rocket.x + Math.random() * 10;
      var posY = rocket.y + Math.random() * 20;
      points.push(new Point(posX, posY, (Math.random() * 1.5) - 1, 2, 'red'));
    }
    /*
    Рисуем огонь
    */
    for (var i in points) {
      if (points[i].active) {
        points[i].draw();
        points[i].physx();
      }
    }
    LineDraw();
}
function rect(color, x, y, width, height) {
    this.color = color; // цвет прямоугольника
    this.x = x; // координата х
    this.y = y; // координата у
    this.width = width; // ширина
    this.height = height; // высота
    this.draw = function() // Метод рисующий прямоугольник
    {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
function rocketModel(x, y, angle) {
  this.x = x; // координата х
  this.y = y; // координата у
  this.angle = angle;
  var rocket = new Image();
  rocket.src = './img/rocket.png';
  this.draw = function() {
      context.save();
      // context.rotate(this.angle * Math.PI / 180);
      context.drawImage(rocket, this.x, this.y, 150, 150);
      context.restore();
    }
}
function Line (x,y) {
  this.x = x;
  this.y = y;
  this.update = (nX, nY) => {
    this.x = nX;
    this.y = nY;
  }
  this.draw = function() {
    context.save();
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "#61dbfb";
    context.fillStyle = 'transparent';
    context.fill();
    context.moveTo(this.x,this.y);
    // context.lineTo(0,  game.height - 200);
    context.bezierCurveTo(this.x/3, this.y - Math.random() * 10, this.x/3 + this.x/3, this.y - Math.random() * 10, 0,  game.height - 180);
    context.stroke();
    context.fill();

    context.restore();
  }
}
function Point(x, y, speedY, width, color) {
  this.x = x+30;
  this.y = y + 90;
  this.width = width;
  this.color = color;
  this.alpha = Math.random();
  this.speedY = speedY;
  this.speedX = (Math.random() * 2) - 1;
  this.active = true;

  this.physx = function () {

    this.y += this.speedY;
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
    if (counterX - this.x < 100) {
      // console.log(counterX - this.x);
      drawCircles()
    }
    if (this.x > canvas.width - 300) {
      // console.log(counterX - this.x);
      drawCircles()
    }

  };
};
function update() {
    // меняем координаты ракеты
    line.x = rocket.x;
    line.y = rocket.y+100 ;
    currentPosX = line.x;
    currentPosY = line.y;
    if (rocket.x > 849) {
      rocket.x = 850;
      counterX += rocket.vX;
      rocket.y -= Math.sin(counterX/70);
    } if (rocket.x < 850) {
      rocket.x += rocket.vX;
      counterX = rocket.x;
      rocket.y -= Math.sin(counterX/70);
    };
}
function initCircles(x, y){
 circleArr = [];
 for (var i = 0; i < circleNum; i++){
  var radius = 3;
  circleArr.push(new Circle(x, y, radius, i));
}
}

function animateCircle (){
  requestAnimationFrame(animateCircle);
  if (circleArr.length > 0) {
    for (var i = 0; i < circleArr.length; i++){
     if (circleArr[i] !== undefined) {
       circleArr[i].update();
     }
    }
  }

}

animateCircle();
function play() {
    draw1(); // отрисовываем всё на холсте
    update(); // обновляем координаты

}
init();
ready(function() {
  initializeBackground();
});

var resizeTimeout;
var resizeCooldown = 500;
var lastResizeTime = Date.now();
function initializeBackground() {
  canvas = document.getElementById("rootCanvas");
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  window.addEventListener("resize", function() {
    if (Date.now() - lastResizeTime < resizeCooldown && resizeTimeout) {
      clearTimeout(resizeTimeout);
      delete resizeTimeout;
    }

    lastResizeTime = Date.now();
    canvas.style.display = "none";
    resizeTimeout = setTimeout(function() {
      fadeIn(canvas, 500);
      initializeStars();
    }, 500);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  initializeStars();
  (window.requestAnimationFrame && requestAnimationFrame(paintLoop)) ||
    setTimeout(paintLoop, ms);
}

var canvas;
var stars = [];

function rand(max) {
  return Math.random() * max;
}

function Star(canvas, size, speed) {
  this.ctx = canvas.getContext("2d");
  this.size = size;
  this.speed = speed;
  this.x = rand(window.innerWidth);
  this.y = rand(window.innerHeight);
}

Star.prototype.animate = function(delta) {
  this.x += this.speed * delta;
  this.y -= this.speed * delta;
  if (this.y < 0) {
    this.y = window.innerHeight;
  }
  if (this.x > window.innerWidth) {
    this.x = 0;
  }
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(this.x, this.y, this.size, this.size);
};

function initializeStars() {
  var winArea = window.innerWidth * window.innerHeight;
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
    stars.push(new Star(canvas, 2, 20));
  }

  for (var i = 0; i < largeStarsCount; i++) {
    stars.push(new Star(canvas, 3, 10));
  }
}

function drawStars(delta) {
  for (var i = 0; i < stars.length; i++) {
    stars[i].animate(delta);
  }
}

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

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
