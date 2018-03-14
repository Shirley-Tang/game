//飞机对象
function Plane(){
  this.x = 320;
  this.y = 470;
  this.width = CONFIG.planeSize.width;
  this.height = CONFIG.planeSize.height;
  this.speed = CONFIG.planeSpeed;
  this.cd = 0; //子弹的冷却时间
}
Plane.prototype.draw = function(){
  context.clearRect(30, 470, 640, 100);
  context.drawImage(planeImg, this.x, this.y, this.width, this.height);
}
Plane.prototype.shoot = function(){
  bullets[bulletIndex] = new Bullet(this.x + this.width/2);
  bulletIndex++;
}
var planeObj = new Plane();
