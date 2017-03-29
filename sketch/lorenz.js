var y = 0, z = 0
var a = Math.random() * 20, b = 28, c = 8/3

var x = bind.slider('X?', 0.01, 0, 1, 0.01)

page.set_title('lorenz attractor')
page.set_source()
page.set_description()

setup = function () {
	frameRate(120)
	colorMode(HSB, 255)
	stroke(255)
	smooth(8)
	background(32)
}

draw = function () {
	var ct = 0
	translate(sketch.width() / 2, sketch.height() / 2)
	while (ct < 1) {
		ct += 1

		var dt = 0.005
		var dx = dt * (a * (y - x))
		var dy = dt * (x * (b - z) - y)
		var dz = dt * (x * y - c * z)
		x += dx
		y += dy
		z += dz
		stroke(255, z * 5)
		line((x-dx) * 10, (y-dy) * 10, x * 10, y * 10)
	}
}
