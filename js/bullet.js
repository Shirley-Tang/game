//子弹对象
function Bullet(x) {
  this.x = x;
  this.y = 470;
  this.width = 1;
  this.height = CONFIG.bulletSize;
  this.speed = CONFIG.bulletSpeed;
  this.index = bulletIndex;
}

Bullet.prototype.draw = function(){
  context.fillStyle = "white";
  context.fillRect(this.x ,this.y, this.width, this.height);
}
Bullet.prototype.move = function(){
  this.y -= this.speed;
  if (this.y < 0) {
    delete bullets[this.index];
  }
}