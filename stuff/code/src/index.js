outlets = 1
const ROSE_SCREEN_WIDTH = 128
const ROSE_SCREEN_HEIGHT = 128
const colors = [
	[0, 0, 0], //black
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
	[255, 204, 170], //peach
]

const trunc = Math.floor
const flr = x => x | 0
const sin = x => Math.sin(-x * 2 * Math.PI)
const cos = x => Math.cos(-x * 2 * Math.PI)
const abs = Math.abs

// const palette = new JitterMatrix(4, 'char', 256, 1)
// const map = new JitterMatrix(1, 'char', 256)
const screen = new JitterMatrix(3, 'char', 128, 128)
const backingScreen = new JitterMatrix(1, 'char', 128, 128)

let penColor = 6
function color(c) {
	penColor = c
}
function pset(x, y, c = penColor) {
	c = c >= 16 || c < 0 ? 0 : trunc(c)
	penColor = c

	x = trunc(x)
	y = trunc(y)
	if (x < 0 || x >= ROSE_SCREEN_WIDTH || y < 0 || y >= ROSE_SCREEN_HEIGHT) {
		return
	}

	backingScreen.setcell2d(x, y, c)
	screen.setcell2d(x, y, ...colors[c])
}
function pget(x, y) {
	return backingScreen.getcell([x, y])[0]
}
function cls(c = 0) {
	c = c >= 16 || c < 0 ? 0 : Math.round(c)
	backingScreen.setall([c])
	screen.setall(colors[c])
}
function rnd(max) {
	return Math.random() * max
}

function rect_swap({ x0, y0, x1, y1 }) {
	const xs = x0 > x1 ? { x1, x0 } : { x0, x1 }
	const ys = y0 > y1 ? { y1, y0 } : { y0, y1 }
	return { ...xs, ...ys }
}
function rect_clip({ x0, y0, x1, y1 }) {
	const screen_width = ROSE_SCREEN_WIDTH
	const screen_height = ROSE_SCREEN_HEIGHT
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
function rectfill(x0, y0, x1, y1, c = penColor) {
	if (x0 > x1) {
		;[x0, x1] = [x1, x0]
	}
	if (y0 > y1) {
		;[y0, y1] = [y1, y0]
	}
	for (let x = x0; x < x1; x++) {
		for (let y = y0; y < y1; y++) {
			pset(x, y, red, green, blue)
		}
	}
}

function line(x0, y0, x1, y1, c = penColor) {
	// c = c >= 16 || c < 0 ? 0 : Math.round(c)
	// penColor = c
	x0 = trunc(x0)
	y0 = trunc(y0)
	x1 = trunc(x1)
	y1 = trunc(y1)

	// let dx = abs(x1 - x0)
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

	let dx = abs(x1 - x0)
	let dy = abs(y1 - y0)
	let sx = x0 < x1 ? 1 : -1
	let sy = y0 < y1 ? 1 : -1
	let err = dx - dy
	while (true) {
		pset(x0, y0, c)

		if (x0 == x1 && y0 == y1) break
		let e2 = 2 * err
		if (e2 > -dy) {
			err -= dy
			x0 += sx
		}
		if (e2 < dx) {
			err += dx
			y0 += sy
		}
	}
}

let iii = 0

function chimes() {
	cls(7)
	let u = iii / 60.0 / 4
	let q = 0.7 + sin(u) / 9
	let p = 0.75 + sin(u + 0.2) / 9
	let i = 64 + 16 * cos(p)
	let j = 32 * sin(p)
	let chimeCount = 3

	for (let z = 1; z <= chimeCount; z++) {
		let d = u + z / chimeCount
		let m = 8 * cos(d) * cos(q + 0.3)
		let n = 8 * sin(d) * sin(q + 0.3)
		let x = i + m + 4 * cos(q)
		let y = j + n + 4 * sin(q)
		let e = q - sin(d + u) / 30
		line(i, j, i + m, j + n, 2)
		line(i, j, 64, -8)
		for (let w = x - 2; w <= x + 2; w++) {
			let h = y + (x - w) * cos(e)
			line(w, h, w + 64 * cos(e), h + 64 * sin(e))
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

	chimes()
	iii++
	outlet(0, 'jit_matrix', screen.name)
}
