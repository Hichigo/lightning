var cnv, ctx, draw, h, h2, w, w2, mid;
cnv = document.getElementById('cnv');
ctx = cnv.getContext('2d');
w = cnv.width = 500;
h = cnv.height = 800;
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
var len = 5; // количество сегментов
var a = []; //массив сегментов
var setting = {
  lineWidth: 6,
  strokeStyle: 'rgba(0,153,255,0.3)'
};
var setting2 = {
  lineWidth: 2,
  strokeStyle: 'rgb(137, 208, 255)'
};

var rand = function(min, max) { // случайное число от мин до макс
  return min + (Math.random() * (max+1-min) >> 0);
};

var generateArray = function(a1, a2, seg) { //генерируем сегменты
  if (seg <= 0) return;
  var m = {
    x: (a1.x + a2.x) / 2,
    y: (a1.y + a2.y) / 2
  };
  // где то тут надо смещать точу m перпендикулярно отрезку a1 - a2
  m.x += rand(-10*seg, 10*seg);
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
//   if(seg === len || seg === len-1) {
//     var split = {
//       x: m.x + rand(-10*seg, 10*seg),
//       y: (m.y*2) * 0.7
//     };
//     test--;
//     generateArray(m, split, seg-1);
//   }
  generateArray(a1, m, seg-1);
  generateArray(m, a2, seg-1);
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
  generateArray(coord2, coord1, len);
  a = a.reverse();
  drawLightning(ctx, a, setting);
  drawLightning(ctx, a, setting2);
}

function animloop(){
  requestAnimationFrame(animloop);
  draw();
}

animloop();