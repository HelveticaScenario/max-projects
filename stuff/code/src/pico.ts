outlets = 1

const colors = [
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
const matrix = new JitterMatrix(3, 'char', 128, 128)
const backingMatrix = new JitterMatrix(1, 'char', 128, 128)
function pset(x: number, y: number, c: number) {
	const _c = c >= 16 || c < 0 ? 0 : Math.round(c)
	backingMatrix.setcell2d(x, y, _c)
	matrix.setcell2d(x, y, ...colors[_c])
}

function pget(x: number, y: number): number {
	return backingMatrix.getcell([x, y])
}

function rand(max: number): number {
	return Math.round(Math.random() * max)
}

function bang() {
	pset(rand(127), rand(127), rand(15))
	// noise.matrixcalc(matrix, matrix)
	// outlet(2, 'jit_matrix', map.name)
	// outlet(1, 'jit_matrix', palette.name)
	outlet(0, 'jit_matrix', matrix.name)
}
