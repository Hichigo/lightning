var cnv, ctx, draw, h, h2, w, w2, mid;
cnv = document.getElementById('cnv');
ctx = cnv.getContext('2d');
w = cnv.width = document.body.clientWidth;
h = cnv.height = document.body.clientHeight;
w2 = w / 2;
h2 = h / 2;
//------------------------
ctx.shadowBlur = 20;
ctx.lineCap = 'round';
ctx.shadowColor = "#09f";
ctx.fillRect(0,0,w,h);
//------------------------

var test = 1;
var coord1 = {x: w2, y: h-10}; //откуда
var coord2 = {x: w2, y: 10}; //куда
var len = 7; // количество сегментов
var offset = Math.sqrt((coord2.x - coord1.x) * (coord2.x - coord1.x) + (coord2.y - coord1.y) * (coord2.y - coord1.y)) * 0.1; //смещение
var a = []; //массив сегментов
var setting = {
  lineWidth: 6,
  strokeStyle: 'rgba(0,153,255,0.3)'
};
var setting2 = {
  lineWidth: 2,
  strokeStyle: 'rgba(137, 208, 255, 1)'
};

var rand = function(min, max) { // случайное число от мин до макс
  return min + (Math.random() * (max+1-min) >> 0);
};

function normalize(p1, p2) {
  var result = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  var len = Math.sqrt(result.x * result.x + result.y * result.y);
  result.x /= len;
  result.y /= len;
  return result;
}

function perp(p) {
  return {
    x: p.y * -1,
    y: p.x
  };
}

function rotate (x, y, angle) {
  angle = angle * Math.PI / 180;
  cosA = Math.cos(angle);
  sinA = Math.sin(angle);
  rx = x * cosA - y * sinA;
  ry = x * sinA + y * cosA;
  return {
    x: rx,
    y: ry
  };
}

var generateArray = function(a1, a2, seg, off) { //генерируем сегменты
  if (seg <= 0) return;
  var m = {
    x: (a1.x + a2.x) / 2,
    y: (a1.y + a2.y) / 2
  };
  
  var vec = normalize(a2, a1);
  vec = perp(vec);
  var r = rand(-off, off);

  vec.x *= r;
  vec.y *= r;

  m.x += vec.x;
  m.y += vec.y;
  if(((Math.random()*10)>>0) <= 3 && seg > 3) {
    var dir = {
      x: m.x - a1.x,
      y: m.y - a1.y,
    };
    dir = rotate(dir.x, dir.y, rand(-10, 10));
    dir.x *= 0.7;
    dir.y *= 0.7;
    
    dir.x += m.x;
    dir.y += m.y;
    generateArray(m, dir, seg-1, off/2);
  }

  if(seg === 1) {
    var obj = {
      bx: a1.x,
      by: a1.y,
      mx: m.x,
      my: m.y,
      ex: a2.x,
      ey: a2.y,
    };
    a.push(obj);
  }
  generateArray(a1, m, seg-1, off/2);
  generateArray(m, a2, seg-1, off/2);
};



var drawArr = function(a, i) { //рисуем сегмент
  ctx.moveTo(a[i].bx, a[i].by);
  ctx.lineTo(a[i].mx, a[i].my);
  ctx.lineTo(a[i].ex, a[i].ey);
};

var drawLightning = function(ctx, array, setting) {
  ctx.lineWidth = setting.lineWidth;
  ctx.strokeStyle = setting.strokeStyle;
  ctx.beginPath();
  for(var c = 0, length = array.length; c < length; c++) {
    drawArr(array, c);
  }
  ctx.moveTo(array[array.length-1].bx, array[array.length-1].by);
  ctx.closePath();
  ctx.stroke();
};
function draw() {
  ctx.fillRect(0,0,w,h);
  a = [];
  var k = Math.sqrt((coord2.x - coord1.x) * (coord2.x - coord1.x) + (coord2.y - coord1.y) * (coord2.y - coord1.y));
  // len = k / 10;
  offset = k * 0.1;

  generateArray(coord2, coord1, len, offset);
  a = a.reverse();
  drawLightning(ctx, a, setting);
  drawLightning(ctx, a, setting2);
}

function animloop(){
  requestAnimationFrame(animloop);
  draw();
}

// animloop();

cnv.onmousemove = function(e) {
  coord2.x = e.offsetX;
  coord2.y = e.offsetY;
};

cnv.onclick = function(e) {
  draw();
};

cnv.addEventListener('touchmove', function(event) {
    coord1.x = event.touches[0].pageX;
    coord1.y = event.touches[0].pageY;
  
    coord2.x = event.touches[1].pageX;
    coord2.y = event.touches[1].pageY;
  draw();
}, false);