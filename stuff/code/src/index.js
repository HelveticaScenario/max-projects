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
function rectfill(x0, y0, x1, y1, c) {
	x0 = trunc(x0)
	y0 = trunc(y0)
	x1 = trunc(x1)
	y1 = trunc(y1)
	if (x0 > x1) {
		;[x0, x1] = [x1, x0]
	}
	if (y0 > y1) {
		;[y0, y1] = [y1, y0]
	}
	for (let x = x0; x < x1; x++) {
		for (let y = y0; y < y1; y++) {
			pset(x, y, c)
		}
	}
}

function rect(x0, y0, x1, y1, c) {
	x0 = trunc(x0)
	y0 = trunc(y0)
	x1 = trunc(x1)
	y1 = trunc(y1)
	if (x0 > x1) {
		;[x0, x1] = [x1, x0]
	}
	if (y0 > y1) {
		;[y0, y1] = [y1, y0]
	}
	for (let x = x0; x <= x1; x++) {
		pset(x, y0, c)
		pset(x, y1, c)
	}
	for (let y = y0; y <= y1; y++) {
		pset(x0, y, c)
		pset(x1, y, c)
	}
}

function circ(x, y, r, c) {
	x = trunc(x)
	y = trunc(y)
	r = trunc(r)
	var offx = r
	var offy = 0
	var decisionOver2 = 1 - offx // Decision criterion divided by 2 evaluated at x=r, y=0
	while (offy <= offx) {
		pset(offx + x, offy + y, c) // Octant 1
		pset(offy + x, offx + y, c) // Octant 2
		pset(-offx + x, offy + y, c) // Octant 4
		pset(-offy + x, offx + y, c) // Octant 3
		pset(-offx + x, -offy + y, c) // Octant 5
		pset(-offy + x, -offx + y, c) // Octant 6
		pset(offx + x, -offy + y, c) // Octant 7
		pset(offy + x, -offx + y, c) // Octant 8
		offy++
		if (decisionOver2 <= 0) {
			decisionOver2 += 2 * offy + 1 // Change in decision criterion for y -> y+1
		} else {
			offx--
			decisionOver2 += 2 * (offy - offx) + 1 // Change for y -> y+1, x -> x-1
		}
	}
}

function circfill(x, y, r, c) {
	x = trunc(x)
	y = trunc(y)
	r = trunc(r)
	var offx = r
	var offy = 0
	var decisionOver2 = 1 - offx // Decision criterion divided by 2 evaluated at x=r, y=0
	while (offy <= offx) {
		line(offx + x, offy + y, -offx + x, offy + y, c) // Octant 1
		line(offy + x, offx + y, -offy + x, offx + y, c) // Octant 2
		line(-offx + x, -offy + y, offx + x, -offy + y, c) // Octant 5
		line(-offy + x, -offx + y, offy + x, -offx + y, c) // Octant 6
		offy++
		if (decisionOver2 <= 0) {
			decisionOver2 += 2 * offy + 1 // Change in decision criterion for y -> y+1
		} else {
			offx--
			decisionOver2 += 2 * (offy - offx) + 1 // Change for y -> y+1, x -> x-1
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

function t() {
	return iii / 60.0
}

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

function headache() {
	/*

	p,q={},{}
	for i=0,31 do
		add(p,{y=i*4})
	end
	for i=0,4 do
		add(q,{x=i*37,v=i})
	end
	::_::
	cls(7)
	for v in all(p) do
		if (v.y<127) 
			v.y+=1
		else
			v.y=0
			line(0,v.y,127,v.y,0)
		end
		for v in all(q) do
			if (v.x>-20) 
				v.x-=1
			else
			v.x=164
		circfill(
			v.x,
			64 + sin(t() + v.v / 5) * 5,
			20,
			7
		)
	end
	flip()
	goto _

	*/
}

function tree_with_moon() {
	// 	f=circfill
	// 	function b(u,v,a,l) {
	// 		let x=u+cos(a)*l
	// 		let y=v+sin(a)*l
	// 		let s
	// 		if(l<2) {
	// 			f(u,v+4,4,3)
	// 			f(u+2,v,2,11)
	// 			return
	// 		}
	// 		q+=1.5
	// 		s=.06+cos(x/50+t()/3)/l/6
	// 		for (let w=0; w <= l / 5; w++) {
	// 			line(u+w,v,x+w,y,w>l/9 && 9 || 4)
	// 		}
	// 		b(x,y,a-s,l-q%5)
	// 		b(x,y,a+s,l-q%5)
	// }
	// 	cls()
	// 	f(94,34,29,7)
	// 	q=0
	// 	b(9,130,.2,22)
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

	// chimes()
	cls(7)
	const a = 0 //flr(t() * 30) % 3

	for (let i = 0; i < 43; i++) {
		line(0, i * 3 + a, 127, i * 3 + a, 0)
	}

	circfill(
		64 + sin(t()) * 30 * sin(t() / 10),
		64 + cos(t()) * 30 * sin(t() / 10),
		25 * (sin(t() / 7) + 1) + 10,
		7
	)
	circ(
		64 + sin(t()) * 30 * sin(t() / 10),
		64 + cos(t()) * 30 * sin(t() / 10),
		25 * (sin(t() / 7) + 1) + 10,
		0
	)

	iii++
	outlet(0, 'jit_matrix', screen.name)
}
