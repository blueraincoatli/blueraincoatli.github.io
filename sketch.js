let x, y;      // 小球的位置
let xSpeed = 3; // x方向的速度
let ySpeed = 4; // y方向的速度
let radius = 10; // 小球半径

function setup() {
  createCanvas(500, 500);
  // 初始化小球位置在画布中心
  x = width / 2;
  y = height / 2;
}

function draw() {
  background(0); // 黑色背景
  
  // 绘制白色小球
  fill(255);
  noStroke();
  circle(x, y, radius * 2);
  
  // 更新小球位置
  x += xSpeed;
  y += ySpeed;
  
  // 碰到左右边界时反弹
  if (x + radius > width || x - radius < 0) {
    xSpeed *= -1;
  }
  
  // 碰到上下边界时反弹
  if (y + radius > height || y - radius < 0) {
    ySpeed *= -1;
  }
} 