//敌人对象
function Enemy(x,y){
  this.x = x;
  this.y = y;
  this.width = CONFIG.enemySize;
  this.height = CONFIG.enemySize;
  this.speed = CONFIG.enemySpeed;
  this.direction = CONFIG.enemyDirection;
  this.alive = true;
  this.counter = 0;  //爆炸持续时间
}

Enemy.prototype.draw = function(){
  if(this.alive == true){
    context.drawImage(enemyImg, this.x, this.y, this.width, this.height);
  }else{
      context.drawImage(boomImg, this.x, this.y, this.width, this.height);
  }
}

Enemy.prototype.move = function(){
  switch(this.direction){
    case 'right':
      this.x += this.speed;
      if (this.x > 620){
        for (var index in enemies){
          enemies[index].direction = 'left';
          enemies[index].y += this.height;
        }
      };
      break;
    case 'left':
      this.x -= this.speed;
      if (this.x < 30){
        for (var index in enemies){
          enemies[index].direction = 'right';
          enemies[index].y += this.height;
        }
      };
      break;
  }
};

Enemy.prototype.boom = function(){
  for (var i in bullets){
    if(this.alive){
      if (!(this.x + this.width < bullets[i].x) &&
        !(bullets[i].x + bullets[i].width < this.x) &&
        !(this.y + this.height < bullets[i].y) &&
        !(bullets[i].y + bullets[i].height < this.y)){
        this.alive = false;
      delete bullets[i];
      GAME.score ++;
      }
    }
  }
}