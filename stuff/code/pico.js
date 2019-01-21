"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

outlets = 1;
var ROSE_SCREEN_WIDTH = 128;
var ROSE_SCREEN_HEIGHT = 128;
var colors = [[0, 0, 0], //black
[29, 43, 83], //dark-blue
[126, 37, 83], //dark-purple
[0, 135, 81], //dark-green
[171, 82, 54], //brown
[95, 87, 79], //dark-gray
[194, 195, 199], //light-gray
[255, 241, 232], //white
[255, 0, 77], //red
[255, 163, 0], //orange
[255, 236, 39], //yellow
[0, 228, 54], //green
[41, 173, 255], //blue
[131, 118, 156], //indigo
[255, 119, 168], //pink
[255, 204, 170]];
var trunc = Math.floor;

var flr = function flr(x) {
  return x | 0;
};

var sin = function sin(x) {
  return Math.sin(-x * 2 * Math.PI);
};

var cos = function cos(x) {
  return Math.cos(-x * 2 * Math.PI);
};

var abs = Math.abs; // const palette = new JitterMatrix(4, 'char', 256, 1)
// const map = new JitterMatrix(1, 'char', 256)

var screen = new JitterMatrix(3, 'char', 128, 128);
var backingScreen = new JitterMatrix(1, 'char', 128, 128);
var penColor = 6;

function color(c) {
  penColor = c;
}

function pset(x, y) {
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : penColor;
  c = c >= 16 || c < 0 ? 0 : trunc(c);
  penColor = c;
  x = trunc(x);
  y = trunc(y);

  if (x < 0 || x >= ROSE_SCREEN_WIDTH || y < 0 || y >= ROSE_SCREEN_HEIGHT) {
    return;
  }

  backingScreen.setcell2d(x, y, c);
  screen.setcell2d.apply(screen, [x, y].concat(_toConsumableArray(colors[c])));
}

function pget(x, y) {
  return backingScreen.getcell([x, y])[0];
}

function cls() {
  var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  c = c >= 16 || c < 0 ? 0 : Math.round(c);
  backingScreen.setall([c]);
  screen.setall(colors[c]);
}

function rnd(max) {
  return Math.random() * max;
}

function rect_swap(_ref) {
  var x0 = _ref.x0,
      y0 = _ref.y0,
      x1 = _ref.x1,
      y1 = _ref.y1;
  var xs = x0 > x1 ? {
    x1: x1,
    x0: x0
  } : {
    x0: x0,
    x1: x1
  };
  var ys = y0 > y1 ? {
    y1: y1,
    y0: y0
  } : {
    y0: y0,
    y1: y1
  };
  return _objectSpread({}, xs, ys);
}

function rect_clip(_ref2) {
  var x0 = _ref2.x0,
      y0 = _ref2.y0,
      x1 = _ref2.x1,
      y1 = _ref2.y1;
  var screen_width = ROSE_SCREEN_WIDTH;
  var screen_height = ROSE_SCREEN_HEIGHT;

  if (x0 < 0 && x1 < 0 || x0 > screen_width - 1 || y0 < 0 && y1 < 0 || y0 > screen_height - 1) {
    return null;
  }

  if (x0 < 0) {
    x0 = 0;
  }

  if (x1 > screen_width - 1) {
    x1 = screen_width - 1;
  }

  if (y0 < 0) {
    y0 = 0;
  }

  if (y1 > screen_height - 1) {
    y1 = screen_height - 1;
  }

  return {
    x0: x0,
    y0: y0,
    x1: x1,
    y1: y1
  };
}

function rectfill(x0, y0, x1, y1) {
  var c = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : penColor;

  if (x0 > x1) {
    ;
    var _ref3 = [x1, x0];
    x0 = _ref3[0];
    x1 = _ref3[1];
  }

  if (y0 > y1) {
    ;
    var _ref4 = [y1, y0];
    y0 = _ref4[0];
    y1 = _ref4[1];
  }

  for (var x = x0; x < x1; x++) {
    for (var y = y0; y < y1; y++) {
      pset(x, y, red, green, blue);
    }
  }
}

function line(x0, y0, x1, y1) {
  var c = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : penColor;
  // c = c >= 16 || c < 0 ? 0 : Math.round(c)
  // penColor = c
  x0 = trunc(x0);
  y0 = trunc(y0);
  x1 = trunc(x1);
  y1 = trunc(y1); // let dx = abs(x1 - x0)
  // let sx = x0 < x1 ? 1 : -1
  // let dy = abs(y1 - y0)
  // let sy = y0 < y1 ? 1 : -1
  // let err = (dx > dy ? dx : -dy) / 2
  // let e2
  // while (true) {
  // 	pset(x0, y0, c)
  // 	if (x0 == x1 && y0 == y1) break
  // 	e2 = err
  // 	if (e2 > -dx) {
  // 		err -= dy
  // 		x0 += sx
  // 	}
  // 	if (e2 < dy) {
  // 		err += dx
  // 		y0 += sy
  // 	}
  // }

  var dx = abs(x1 - x0);
  var dy = abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;

  while (true) {
    pset(x0, y0, c);
    if (x0 == x1 && y0 == y1) break;
    var e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

var iii = 0;

function chimes() {
  cls(7);
  var u = iii / 60.0 / 4;
  var q = 0.7 + sin(u) / 9;
  var p = 0.75 + sin(u + 0.2) / 9;
  var i = 64 + 16 * cos(p);
  var j = 32 * sin(p);
  var chimeCount = 3;

  for (var z = 1; z <= chimeCount; z++) {
    var d = u + z / chimeCount;
    var m = 8 * cos(d) * cos(q + 0.3);
    var n = 8 * sin(d) * sin(q + 0.3);
    var x = i + m + 4 * cos(q);
    var y = j + n + 4 * sin(q);
    var e = q - sin(d + u) / 30;
    line(i, j, i + m, j + n, 2);
    line(i, j, 64, -8);

    for (var w = x - 2; w <= x + 2; w++) {
      var h = y + (x - w) * cos(e);
      line(w, h, w + 64 * cos(e), h + 64 * sin(e));
    }
  }
}

function bang() {
  // for (let index = 0; index < 100; index++) {
  // 	line(
  // 		trunc(rnd(127)),
  // 		trunc(rnd(127)),
  // 		trunc(rnd(127)),
  // 		trunc(rnd(127)),
  // 		trunc(rnd(14) + 1)
  // 	)
  // 	// rectfill(
  // 	// 	trunc(rnd(127)),
  // 	// 	trunc(rnd(127)),
  // 	// 	trunc(rnd(127)),
  // 	// 	trunc(rnd(127)),
  // 	// 	trunc(rnd(14) + 1)
  // 	// )
  // }
  // i++
  // if (i > 5) {
  // 	i = 0
  // 	cls()
  // }
  chimes();
  iii++;
  outlet(0, 'jit_matrix', screen.name);
}
