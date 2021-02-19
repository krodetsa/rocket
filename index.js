var circleArr = [];
var counterLimit = 22.5;
var names = [
  {
    name: 'John Cena',
    isUser: false,
    value: 20
  },
  {
    name: 'Someone',
    isUser: true,
    value: 15.8
  },
  {
    name: 'Craig Jones',
    isUser: false,
    value: 5.8
  },
  {
    name: 'Will Smith',
    isUser: false,
    value: 10
  },
  {
    name: 'Elon Musk',
    isUser: false,
    value: 16.7
  },
  {
    name: 'N. Tyson',
    isUser: false,
    value: 12
  },
  {
    name: 'John Wick',
    isUser: false,
    value: 14
  },
  {
    name: 'Rick Astley',
    isUser: false,
    value: 9
  },
  {
    name: 'Trump?!?!?!',
    isUser: false,
    value: 18
  }
];
var maxArr = [];
names.forEach((item, i) => {
  // console.log(item.value, counterLimit);
  if (item.value <= counterLimit) {
     maxArr.push(item)
  }
  return null
});
var circleNum = 150;
var time = 0;
var color = "#61dbfb";
var doAnim = true;
var runned;
var donee;
var myReq;

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
  ufo = new Ufo(0,50);
  bullet = new Bullet(0,50);
  coin = [];
  explosions = [];
  stop = false;
  //ufo speed
  ufo.vX = 5;
  ufo.vY = 1;
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

        // context.stroke();
        if (currentPosX < 600 ) {
          for(cnt = 0; cnt <= currentPosX+40; cnt++)
    				{
              // console.log(cnt/100);
    						context.lineTo(cnt, currentPosY + (Math.cos(time + cnt * .2) * 3 ));
              // context.lineTo(cnt, currentPosY );
    				}
  				context.lineWidth = 2;
  				context.strokeStyle = color;
  				context.stroke();
        }
        if (currentPosX>600) {
          function drawShape(ctx, xoff, yoff) {
            ctx.beginPath();
            ctx.moveTo(0 , game.height-200);
            ctx.bezierCurveTo(xoff, game.height-200, xoff - 180, game.height-200, xoff+45, yoff - 5);
            context.lineWidth = 2;
            context.strokeStyle = color;
            ctx.stroke();
          }

            drawShape(context, currentPosX, currentPosY);
  				// context.stroke();
        }

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
    ufo.draw();
    // bullet.draw()

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

function Line (x,y) {
  this.x = x;
  this.y = y;
}

function update() {
    // поведение нло
    if (ufo.x < 250 && counterX < 1200) {
      ufo.x = counterX - 900 + ufo.vX;
      ufo.y += ufo.vY;
    }
    if (ufo.x >= 250 && counterX > 1800) {
      ufo.x +=  ufo.vX + 10;
      ufo.y -= ufo.vY*5;
    }
    if (counterX > 1300 && counterX < 1800) {
      bullet.x = ufo.x + 150;
      bullet.y = ufo.y + 80;
      bullet.draw()
    }
    // меняем координаты ракеты
    if (doAnim) {
      line.x = rocket.x;
      line.y = rocket.y+100 ;
      currentPosX = line.x;
      currentPosY = line.y;
      if (rocket.x > 849) {
        rocket.x = 850;
        counterX += rocket.vX;
        rocket.y -=  1;
        // rocket.y -= 1
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
    // draw coins
    names.map((item, i) => {
      if (item.value === visible/100) {
        addcoin(currentPosX, currentPosY,item.name, item.isUser);
      }
    });
}

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

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  context.save()
  context.globalCompositeOperation = "lighter";
  explosion.update();
  explosion.draw()
  context.restore();
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
    // counterLimit = 5;
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
  let winner = maxArr.reduce((acc, curr) => acc.value > curr.value ? acc : curr);
  // console.log(maxArr.reduce((acc, curr,) => acc.value > curr.value ? acc : curr));
  document.getElementById('results').classList.add('open');
  document.getElementById('total').innerText = `${'Crash at ' + visible/100 + ' pts.' }`;
  document.getElementById('winner').innerText = winner.name;
  document.getElementById('score').innerText = winner.value;
  stop = true;
  explosion = new Explosion(currentPosX+70,currentPosY)
  explosions = [];
  Draw();
    function stopAnimation() {
      clearInterval(runned);
    }
  clearInterval(donee);
  setTimeout(stopAnimation, 100);
  setTimeout(clearInterval(donee), 100);
}
function addcoin(x, y, name, isUser) {
    // coin.push(new CoinModel( currentPosX, currentPosY, .1, 'Username'));
    coin.push(new CoinModel( x, y, .1, name, isUser));
}
function addcoincustom() {
    coin.push(new CoinModel( currentPosX, currentPosY, .1, 'Custom coin'));
}
function newGame() {
  document.getElementById('results').classList.remove('open');
  document.getElementById('newGame-window').classList.add('open');
  countTostart(0);
}
