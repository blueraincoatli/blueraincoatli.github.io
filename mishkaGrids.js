var x, y, a, b, axisx, axisy;

function setup() {
  a = windowWidth;
  b = windowHeight;
  createCanvas(a, b);
  axisx = a/2;
  axisy = b/2;
  rectMode(CENTER);
  colorMode(HSB);
}

function draw() {
  noStroke();
  fill(0, 255);
  rect(0, 0, a*2, b*2);
  updateGrid();
}

function updateGrid() {
  var rectW = controls.rectWidth;
  var rectH = controls.rectHeight;
  
  //超出屏幕尺寸后按比例缩小
  if (rectW > 1900) {
    rectH = 1900/rectW*rectH;
    rectW = 1900;
  }
  if (rectH > 900) {
    rectW = 900/rectH*rectW;
    rectH = 900;
  }
  
  var ax = rectW*-1/2;
  var ay = rectH*-1/2;
  var bx = rectW*1/2;
  var by = rectH*-1/2;
  var cx = rectW*1/2;
  var cy = rectH*1/2;
  var dx = rectW*-1/2;
  var dy = rectH*1/2;
  
  stroke(controls.picsGridHue, 100, controls.gridBrightness, 255);
  strokeWeight(controls.strokeweight);
  //以窗口中心为坐标原点，画出矩形
  rect(axisx, axisy, rectW, rectH);
  //转移坐标系到窗口中心为坐标原点，画出两条对角线
  translate(axisx, axisy);

  if (controls.picsGrid === true) {
    line(ax,ay,cx,cy);
    line(bx,by,dx,dy);
    line(ax,0,0,ay);
    line(ax,0,0,dy);
    line(bx,0,0,by);
    line(bx,0,0,dy);

    //画出各对角线的垂直线
    let ex = sq(rectH)/rectW;
    let ex1 = ex+dx;
    let ey = sq(rectW)/rectH;
    let ey2 = ey+by;
    line(0,ay,0,dy);
    line(ax,0,bx,0);

    // 画出4条经过交叉垂直点的线
    let fx = dx+((sq(rectH)*rectW)/(sq(rectH)+sq(rectW)));
    let fy = ay+((sq(rectH)*rectW)/(sq(rectH)+sq(rectW)))*(rectH/rectW);
    line(fx,ay,fx,dy);
    line(-fx,ay,-fx,dy);
    line(ax,fy,bx,fy);
    line(ax,-fy,bx,-fy);

    if (rectW/rectH > 1) {
      line(ax,ay,ex1,dy);
      line(dx,dy,ex1,ay);
      line(bx,by,ex1*-1,dy);
      line(cx,cy,ex1*-1,by);
      //对角垂直线的平行线
      line(ax,0,ex/2+dx,dy);
      line(ax,0,ex/2+ax,ay);
      line(bx,0,bx-ex/2,by);
      line(bx,0,bx-ex/2,cy);
      line(0,ay,(ax+ex/2-ex1),0);
      line(0,dy,(ax+ex/2-ex1),0);
      line(0,ay,-(ax+ex/2-ex1),0);
      line(0,dy,-(ax+ex/2-ex1),0);
    } else if (rectW/rectH < 1) {
      line(ax,ay,bx,ey2);
      line(bx,by,bx*-1,ey2);
      line(cx,cy,ax,ey2*-1);
      line(dx,dy,bx,ey2*-1);
      //对角垂直线的平行线
      line(0,ay,ax,ey/2+ay);
      line(0,ay,bx,ey/2+ay);
      line(0,dy,dx,dy-ey/2);
      line(0,dy,cx,cy-ey/2);
      line(ax,0,0,(ay+ey/2-ey2));
      line(bx,0,0,(ay+ey/2-ey2));
      line(ax,0,0,-(ay+ey/2-ey2));
      line(bx,0,0,-(ay+ey/2-ey2));
    }
  }

  //创建6*6文字网格
  if (controls.layoutGrid === true) {
    if (rectW/rectH > 1) {
      var ul = rectW/50;
      var uw = rectW-ul*4;
      var uh = (rectH-ul*7)/6;
      var uy = (rectH/2*-1)+ul+uh/2;
      var sw = (rectW-ul*9)/6;
      var sh = rectH-ul*2;
      var sx = (rectW/2*-1)+ul*2+sw/2;
    } else {
      var ul = rectH/50;
      var uw = rectW-ul*2;
      var uh = (rectH-ul*9)/6;
      var uy = (rectH/2*-1)+ul*2+uh/2;
      var sw = (rectW-ul*7)/6;
      var sh = rectH-ul*4;
      var sx = (rectW/2*-1)+ul+sw/2;
    }

    noFill();
    stroke(controls.layoutGridHue, 100, controls.gridBrightness, 255);

    for(var i=0; i<6; i++) {
      rect(0,uy+(uh+ul)*i,uw,uh);
    }
    for(var k=0; k<6; k++) {
      rect(sx+(sw+ul)*k,0,sw,sh);
    }
  }
}

var Controls = function() {
  this.rectWidth = 450;
  this.rectHeight = 700;
  this.strokeweight = 1.2;
  this.picsGridHue = 50;
  this.layoutGridHue = 200;
  this.gridBrightness = 100;
  this.picsGrid = true;
  this.layoutGrid = true;
  
  this.saveSVG = function() {
    const w = controls.rectWidth;
    const h = controls.rectHeight;
    const sw = controls.strokeweight;
    
    // 计算中心点
    const centerX = (w + 100)/2;
    const centerY = (h + 100)/2;
    
    // 计算矩形的四个角点（相对于中心点）
    const ax = -w/2;
    const ay = -h/2;
    const bx = w/2;
    const by = -h/2;
    const cx = w/2;
    const cy = h/2;
    const dx = -w/2;
    const dy = h/2;

    // 创建 SVG 字符串
    let svgString = `
      <svg width="${w + 100}" height="${h + 100}" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(${centerX}, ${centerY})" stroke="hsl(${controls.picsGridHue}, 100%, ${controls.gridBrightness}%)" stroke-width="${sw}" fill="none">
          <!-- 主矩形 -->
          <rect x="${ax}" y="${ay}" width="${w}" height="${h}"/>
    `;

    // 如果启用了网格
    if(controls.picsGrid) {
      // 对角线
      svgString += `
          <!-- 对角线 -->
          <line x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}"/>
          <line x1="${bx}" y1="${by}" x2="${dx}" y2="${dy}"/>
          <line x1="${ax}" y1="0" x2="0" y2="${ay}"/>
          <line x1="${ax}" y1="0" x2="0" y2="${dy}"/>
          <line x1="${bx}" y1="0" x2="0" y2="${by}"/>
          <line x1="${bx}" y1="0" x2="0" y2="${dy}"/>
          
          <!-- 中心十字线 -->
          <line x1="0" y1="${ay}" x2="0" y2="${dy}"/>
          <line x1="${ax}" y1="0" x2="${bx}" y2="0"/>
      `;

      // 计算其他几何线条
      const ex = (h*h)/w;
      const ex1 = ex+dx;
      const ey = (w*w)/h;
      const ey2 = ey+by;
      const fx = dx+((h*h*w)/(h*h+w*w));
      const fy = ay+((h*h*w)/(h*h+w*w))*(h/w);

      // 添加垂直交叉线
      svgString += `
          <!-- 交叉垂直线 -->
          <line x1="${fx}" y1="${ay}" x2="${fx}" y2="${dy}"/>
          <line x1="${-fx}" y1="${ay}" x2="${-fx}" y2="${dy}"/>
          <line x1="${ax}" y1="${fy}" x2="${bx}" y2="${fy}"/>
          <line x1="${ax}" y1="${-fy}" x2="${bx}" y2="${-fy}"/>
      `;

      // 根据宽高比添加不同的线条
      if (w/h > 1) {
        svgString += `
          <line x1="${ax}" y1="${ay}" x2="${ex1}" y2="${dy}"/>
          <line x1="${dx}" y1="${dy}" x2="${ex1}" y2="${ay}"/>
          <line x1="${bx}" y1="${by}" x2="${-ex1}" y2="${dy}"/>
          <line x1="${cx}" y1="${cy}" x2="${-ex1}" y2="${by}"/>
          <line x1="${ax}" y1="0" x2="${ex/2+dx}" y2="${dy}"/>
          <line x1="${ax}" y1="0" x2="${ex/2+ax}" y2="${ay}"/>
          <line x1="${bx}" y1="0" x2="${bx-ex/2}" y2="${by}"/>
          <line x1="${bx}" y1="0" x2="${bx-ex/2}" y2="${cy}"/>
        `;
      } else {
        svgString += `
          <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${ey2}"/>
          <line x1="${bx}" y1="${by}" x2="${-bx}" y2="${ey2}"/>
          <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${-ey2}"/>
          <line x1="${dx}" y1="${dy}" x2="${bx}" y2="${-ey2}"/>
        `;
      }
    }

    // 如果启用了布局网格
    if(controls.layoutGrid) {
      const ul = w/50;
      const uw = w-ul*4;
      const uh = (h-ul*7)/6;
      const uy = (-h/2)+ul+uh/2;
      const sw = (w-ul*9)/6;
      const sh = h-ul*2;
      const sx = (-w/2)+ul*2+sw/2;

      // 添加布局网格
      for(let i=0; i<6; i++) {
        svgString += `
          <rect x="${-uw/2}" y="${uy+(uh+ul)*i}" width="${uw}" height="${uh}"/>
        `;
      }
      for(let k=0; k<6; k++) {
        svgString += `
          <rect x="${sx+(sw+ul)*k}" y="${-sh/2}" width="${sw}" height="${sh}"/>
        `;
      }
    }

    svgString += `
        </g>
      </svg>
    `;

    // 创建 Blob 并下载
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const element = document.createElement('a');
    element.download = 'mishkaGrid.svg';
    element.href = window.URL.createObjectURL(blob);
    element.click();
    window.URL.revokeObjectURL(element.href);
  }
}

var controls = new Controls();

window.onload = function() {
  if (typeof dat === 'undefined') {
    console.error('dat.GUI library is not loaded');
    return;
  }
  var gui = new dat.GUI();
  gui.add(controls, 'rectWidth', 10, 4000);
  gui.add(controls, 'rectHeight', 10, 4000);
  gui.add(controls, 'strokeweight', 0, 3);
  gui.add(controls, 'picsGridHue', 0, 360);
  gui.add(controls, 'layoutGridHue', 0, 360);
  gui.add(controls, 'gridBrightness', 0, 100);
  gui.add(controls, 'picsGrid');
  gui.add(controls, 'layoutGrid');
  gui.add(controls, 'saveSVG');  // 直接使用方法名
}