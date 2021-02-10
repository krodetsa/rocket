var circleArr = [];
var circleNum = 150;
var time = 0;
var color = "#61dbfb";
var doAnim = true;
var runned;
var donee;
var myReq;
var counterLimit = 0;
var requestId = null;
var spring = 1 / 10;
var friction = .85;
var colors = ["#6A0000", "#900000", "#902B2B", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#f93801"];
var starsRunned;
// sounds

function getRandomSound() {
      var loadedSound = [
        'sounds/explosion0.wav',
        'sounds/explosion1.wav',
        'sounds/explosion2.wav',
        'sounds/explosion3.wav',
        'sounds/explosion4.wav',
        'sounds/explosion5.wav'
      ];
    var i = Math.floor((Math.random()*6));
      return loadedSound[i];
  }

  function playSound() {
    var explosion = new Audio(getRandomSound());
    explosion.volume = .5;
    explosion.load();
    explosion.play();
  }

function init() {
  // объект который задаёт игровое поле
  colorArr = ['rgba(243,82,92,0.8)','rgba(0,103,76,0.5)','rgba(149,178,58,0.5)','rgba(252,206,68,0.8)','rgba(245,127,79,0.5)'];
  game = new rect("#000", 0, 0, 1024, 768);
  rocket = new rocketModel( 0, game.height-290, .1);
  line = new Line(0,100);
  explosion = new Explosion(-20, game.height-200);
  coin = [];
  explosions = [];
  stop = false;
  // скорость ракеты
  rocket.vX = 4; // скорость по оси х
  rocket.vY = 1; // скорость по оси у
  rocket.vZ = 1; // z по оси у
  counterX = 0;
  visible = 0;
  currentPosX = 0;
  currentPosY = 0;
  canvas = document.getElementById("rootCanvas");
  cw = canvas.width;
  ch = canvas.height;
  canvas.width = game.width;
  canvas.height = game.height;
  context = canvas.getContext("2d");
  points = [];
  // canvas.onmousemove = playerMove; движение мышки на канвасе, мб пригодится

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
function LineDraw(){

				time = time + .5;
        // context.save();
				// context.clearRect(0, 0, canvas.width, canvas.height);

				context.beginPath();
        // context.beginPath();
        // context.lineWidth = 2;
        // context.strokeStyle = "#61dbfb";
        // context.fillStyle = 'transparent';
        // context.fill();
        // context.moveTo(currentPosX,currentPosY);
        // // context.lineTo(0,  game.height - 200);
        // context.bezierCurveTo(currentPosX/3, currentPosY - Math.random() * 10, currentPosX/3 + currentPosX/3, currentPosY - Math.random() * 10, 0,  game.height - 180);
        // context.stroke();
				for(cnt = 0; cnt <= currentPosX+40; cnt++)
  				{
  					context.lineTo(cnt, currentPosY + (Math.cos(time + cnt * .2) * 3 ));
  				}
				context.lineWidth = 2;
				context.strokeStyle = color;
				context.stroke();
        // context.restore();
			}
// Отрисовка игры
function draw1() {

    game.draw(); // рисуем игровое поле
    // fire.draw();
    // рисуем на поле счёт
    context.font = 'bold 64px courier';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = '#ccc';
    context.fillText(visible/100, 200, 200);
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
      // context.save();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        // context.restore();
    }
}
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
function CoinModel(x, y, angle){
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
    this.y = rocket.y+85;
  }
}
function Line (x,y) {
  this.x = x;
  this.y = y;
  this.update = (nX, nY) => {
    this.x = nX;
    this.y = nY;
  }
  this.draw = function() {;
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
    if (doAnim) {
      line.x = rocket.x;
      line.y = rocket.y+100 ;
      currentPosX = line.x;
      currentPosY = line.y;

      if (rocket.x > 849) {
        rocket.x = 850;
        counterX += rocket.vX;
        rocket.y -= Math.sin(counterX/50);
      } if (rocket.x < 850) {
        rocket.x += rocket.vX;
        counterX = rocket.x;
        rocket.y -= Math.sin(counterX/50);
      };
    };
    if (coin.length > 0) {
      coin.map((item, i) => {
        item.draw();
      });
      coin.map((item, i) => {
        item.update();
        if (item.x < 0) {
          coin.splice(i,1)
        }
      });


    };
    if (stop !== true) {
      visible = counterX;
    }

}
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

}

animateCircle();
function play() {
    draw1(); // отрисовываем всё на холсте
    update(); // обновляем координаты
}
function checkDone () {
  if (+counterLimit <= visible/100) {
    stopGame();
    setTimeout(newGame, 3000)
  }
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

var canvas;
var stars = [];

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

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

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
function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  context.save()
  // context.clearRect(0, 0, cw, ch);
  context.globalCompositeOperation = "lighter";
  explosion.update();
  explosion.draw()
  context.restore();
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
function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
function countTostart(sec) {
  let count = sec;
  let timerId = setInterval(() => {
    if (count > 0) {
      count = (count - 0.1).toFixed(1);
    }
    document.getElementById('startIn').innerText = count
  }, 100);
  setTimeout(() => {
    clearInterval(timerId);
    document.getElementById('newGame-window').classList.remove('open');
    startGame()
  }, sec * 1000);
}
function startGame() {

    // playSound();
    // cw = canvas.width,
    //   cx = cw / 2;
    // ch = canvas.height,
    //   cy = ch / 2;
    counterLimit = (5 + Math.random(100) * 10).toFixed(1);
    // document.getElementById('start').classList.toggle('hidden');
    // document.getElementById('stop').classList.remove('hidden');
    // document.getElementById('addcoin').classList.remove('hidden');
    // document.getElementById('results').classList.remove('open');
    doAnim = true;
    stop = false;
    initializeBackground();
    init();
    runned = setInterval(play, 15);
    donee = setInterval(() => checkDone(), 15);

    initCircles(10, game.height-250);
    Draw();
}
function stopGame() {
    // document.getElementById('stop').classList.toggle('hidden');
    // document.getElementById('newGame').classList.toggle('hidden');
    // document.getElementById('addcoin').classList.toggle('hidden');
    document.getElementById('results').classList.add('open');
    document.getElementById('total').innerText = visible/100;
    stop = true;
    explosion = new Explosion(currentPosX+70,currentPosY)
    explosions = [];
    Draw();
    function stopAnimation() {
      clearInterval(runned);
    }
    clearInterval(donee);
    setTimeout(stopAnimation, 100);
    // setTimeout(newGame, 3000);
}
function addcoin() {
    coin.push(new CoinModel( currentPosX, game.height, .1));
}
function newGame() {
  // document.getElementById('start').classList.toggle('hidden');
  // document.getElementById('newGame').classList.toggle('hidden');
  document.getElementById('results').classList.remove('open');
  document.getElementById('newGame-window').classList.add('open');
  countTostart(4);
}

  // if (+counterLimit === visible/100) {
  //     console.log(stop);
  // }
