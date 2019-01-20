outlets = 1
var ROSE_SCREEN_WIDTH = 128
var ROSE_SCREEN_HEIGHT = 128
var colors = [
	[0, 0, 0],
	[29, 43, 83],
	[126, 37, 83],
	[0, 135, 81],
	[171, 82, 54],
	[95, 87, 79],
	[194, 195, 199],
	[255, 241, 232],
	[255, 0, 77],
	[255, 163, 0],
	[255, 236, 39],
	[0, 228, 54],
	[41, 173, 255],
	[131, 118, 156],
	[255, 119, 168],
	[255, 204, 170],
]
// const palette = new JitterMatrix(4, 'char', 256, 1)
// const map = new JitterMatrix(1, 'char', 256)
var lcdScreen = new JitterObject('jit.lcd')
lcdScreen.setpixel.apply(lcdScreen, [25, 25].concat(colors[5]))
var screen = new JitterMatrix(4, 'char', 128, 128)
var backingScreen = new JitterMatrix(1, 'char', 128, 128)
lcdScreen.matrixcalc(screen, screen)
var penColor = 6
function color(c) {
	penColor = c
}
function pset(x, y, c) {
	var _c = c >= 16 || c < 0 ? 0 : Math.round(c)
	backingScreen.setcell2d(x, y, _c)
	screen.setcell2d(x, y, ...colors[_c])
}
function pget(x, y) {
	return backingScreen.getcell([x, y])[0]
}
function cls(c) {
	if (c === void 0) {
		c = 0
	}
	backingScreen.setall([c])
	screen.setall(colors[c])
}
function rnd(max) {
	return Math.random() * max
}
var flr = Math.floor
var sin = Math.sin
var cos = Math.cos
var abs = Math.abs
function rect_swap({ x0, y0, x1, y1 }) {
	var xs = x0 > x1 ? { x1, x0 } : { x0, x1 }
	var ys = y0 > y1 ? { y1, y0 } : { y0, y1 }
	return { ...xs, ...ys }
}
function rect_clip({ x0, y0, x1, y1 }) {
	var screen_width = ROSE_SCREEN_WIDTH
	var screen_height = ROSE_SCREEN_HEIGHT
	if (
		(x0 < 0 && x1 < 0) ||
		x0 > screen_width - 1 ||
		(y0 < 0 && y1 < 0) ||
		y0 > screen_height - 1
	) {
		return null
	}
	if (x0 < 0) {
		x0 = 0
	}
	if (x1 > screen_width - 1) {
		x1 = screen_width - 1
	}
	if (y0 < 0) {
		y0 = 0
	}
	if (y1 > screen_height - 1) {
		y1 = screen_height - 1
	}
	return { x0, y0, x1, y1 }
}
function rectfill(rect_obj, c) {
	if (c === void 0) {
		c = penColor
	}
	rect_obj = rect_swap(rect_obj)
	// coord_cam_offset(this, &x0, &y0);
	// coord_cam_offset(this, &x1, &y1);
	var res = rect_clip(rect_obj)
	if (res == null) return false
	var x0 = res.x0,
		y0 = res.y0,
		x1 = res.x1,
		y1 = res.y1
	// Draw
	var screen_width = ROSE_SCREEN_WIDTH
	for (var i_1 = y0; i_1 <= y1; ++i_1) {
		// memset(screen.begin + i * screen_width + x0, c, size_t(x1 - x0 + 1))
	}
	penColor = c
	return true
}
function line(x0, y0, x1, y1, c) {
	if (c === void 0) {
		c = 6
	}
	if (y0 == y1) {
		// return rectfill(x0, y0, x1, y1, c)
	}
	var dx = abs(x1 - x0),
		sx = x0 < x1 ? 1 : -1
	var dy = abs(y1 - y0),
		sy = y0 < y1 ? 1 : -1
	var err = (dx > dy ? dx : -dy) / 2,
		e2
	for (;;) {
		pset(x0, y0, c)
		if (x0 == x1 && y0 == y1) break
		e2 = err
		if (e2 > -dx) {
			err -= dy
			x0 += sx
		}
		if (e2 < dy) {
			err += dx
			y0 += sy
		}
	}
}
var i = 0
function bang() {
	// for (let index = 0; index < 10; index++) {
	// 	pset(Math.floor(rnd(127)), Math.floor(rnd(127)), Math.floor(rnd(15)))
	// }
	// i++
	// if (i > 40) {
	// 	i = 0
	// 	cls()
	// }
	// // noise.matrixcalc(matrix, matrix)
	// // outlet(2, 'jit_matrix', map.name)
	// // outlet(1, 'jit_matrix', palette.name)
	// // outlet(0, 'jit_matrix', screen.name)
	// post()
	// post(lcdScreen.outputmode)
	outlet(0, 'jit_matrix', screen.name)
}
