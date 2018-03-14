// 元素
var container = document.getElementById('game');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var scoreHtml = document.querySelector('.score');
var scoreCur = document.querySelector('.score-cur');
var nextLevel = document.querySelector('.game-next-level');
var enemies = [];
var enemiesNum;
var bullets = [];
var bulletIndex = null;



// 兼容定义 requestAnimFrame
window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 30);
};

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts
   * @return {[type]}      [description]
   */
  init: function(opts) {
    this.status = 'start';
    this.bindEvent();
    var opts = Object.assign({},CONFIG);
    this.opts = opts;
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replayBtn1 = document.querySelector('.game-failed .js-replay');
    var replayBtn2 = document.querySelector('.game-all-success .js-replay');
    var nextBtn = document.querySelector('.js-next');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    //重新玩游戏按钮
    replayBtn1.onclick = function() {
      self.opts.level = 1;
      self.play();
      self.score = 0;
    }
    replayBtn2.onclick = function() {
      self.opts.level = 1;
      self.play();
      self.score = 0;
    }
    nextBtn.onclick = function() {
      self.opts.level += 1;
      self.play();
    }
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    var self = this;
    //获取游戏初始化level
    var opts = this.opts;
    var level = opts.level;
    var numPerLine = opts.numPerLine;
    var enemyGap = opts.enemyGap;
    var enemySize = opts.enemySize;
    var enemySpeed = opts.enemySpeed;
    //清空敌人数组
    enemies = [];
    //获取分数
    scoreHtml.innerHTML = this.score;
    //创建飞机
    planeObj.x = 320;
    planeObj.y = 470;
    planeObj.draw();

    // 创建敌人
    for(var i=0;i<level;i++){
      for (var j = 0; j<numPerLine; j++){
        // 每个元素的
        x= 50 + j * (enemySize + enemyGap);
        y= 60 + i * enemySize;
        enemies.push(new Enemy(x,y));
      };
    }

    enemiesNum = enemies.length;
    //清除子弹
    for (var i in bullets){
      delete bullets[i];
    }
    this.setStatus('playing');
    //开始动画循环
    animate();
    // this.update();
  },
  success: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.cancelAnimationFrame(stop);
    if(this.opts.level === this.opts.totalLevel){
      this.setStatus('all-success');
    }else{
      this.setStatus('success');
      var level = this.opts.level + 1;
      nextLevel.innerHTML = '下一个Level：' + level;
    }
  },
  failed: function() {
    this.setStatus('failed');
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.cancelAnimationFrame(stop);
    scoreHtml.innerHTML = this.score;
  },
  score: 0
};



/**
  * 游戏相关配置
  * @type {Object}
  */
var CONFIG = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 7, // 游戏默认每行多少个怪兽
  canvasPadding: 30, // 默认画布的间隔
  bulletSize: 10, // 默认子弹长度
  bulletSpeed: 10, // 默认子弹的移动速度
  enemySpeed: 2, // 默认敌人移动距离
  enemySize: 50, // 默认敌人的尺寸
  enemyGap: 10,  // 默认敌人之间的间距
  enemyIcon: './img/enemy.png', // 怪兽的图像
  enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
  enemyDirection: 'right', // 默认敌人一开始往右移动
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  planeIcon: './img/plane.png'
};


/**
 * 游戏元素配置
 */

//图片加载
var planeImg = new Image();
planeImg.src = CONFIG.planeIcon;
var enemyImg = new Image();
enemyImg.src = CONFIG.enemyIcon;
var boomImg = new Image();
boomImg.src = CONFIG.enemyBoomIcon;

//动画循环
function animate(){
  stop = window.requestAnimationFrame(animate);
  scoreCur.innerHTML = GAME.score;
  context.clearRect(0, 0, 680, 470);
  for (var i in bullets){
    bullets[i].draw();
    bullets[i].move();
  }
  for (var i in enemies){
    enemies[i].draw();
    enemies[i].move();
    enemies[i].boom();
    //爆炸显示时间
    if (enemies[i].alive == false){
      if(enemies[i].counter == 4){
        delete enemies[i];
        enemiesNum--;
      }else{
        enemies[i].counter++;
      }
    }
  }
  if(keyPressed[37] && planeObj.x > 30){
    planeObj.x -= planeObj.speed;
    planeObj.draw();
  };
  if(keyPressed[39] && planeObj.x < 610){
    planeObj.x += planeObj.speed;
    planeObj.draw();
  }
  if(keyPressed[32]){
    if(planeObj.cd == 0){
      planeObj.shoot();
      planeObj.cd = 8;
    }else{
      planeObj.cd--;
    }
  }
  //游戏失败跳转
  for (var i in enemies){
    if(enemies[i].y > 450){
      GAME.failed();
    }
  }
  //游戏成功跳转
  if(enemiesNum == 0){
    GAME.success();
  }
}

/**
 * 键盘事件
 */
var keyPressed = {};
document.addEventListener('keydown',function(e){
  //获取被按下的键值 (兼容写法)
  var key = e.keyCode || e.which || e.charCode;
  switch(key){
    //左
    case 37:
      keyPressed[37] = true;
      break;
    //右
    case 39:
      keyPressed[39] = true;
      break;
    //空格
    case 32:
      keyPressed[32] = true;
      break;
  }
})
document.addEventListener('keyup',function(e){
  var key = e.keyCode || e.which || e.charCode;
  switch(key){
    case 37:
      keyPressed[37] = false;
      break;
    case 39:
      keyPressed[39] = false;
      break;
    case 32:
      keyPressed[32] = false;
      break;
  }
})


// 初始化
GAME.init();