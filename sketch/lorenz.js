var x = bind.number('x', 0.01)
var y = bind.number('y', 0)
var z = bind.number('z', 0)

var a = bind.number('sigma', 10)
var b = bind.number('rho', 28)
var c = bind.number('beta', 8/3)

var sw = bind.number('stroke_weight', 1)

var speed = bind.number('speed', 1)
var fade = bind.toggle('fade', false)

page.set_title('lorenz attractor')
page.set_description('A Lorenz Attractor, a "set of chaotic solutions of the Lorenz system which, when plotted, resemble a butterfly or figure eight."<br><a href="https://en.wikipedia.org/wiki/Lorenz_system">Wikipedia</a>')

setup = function () {
	frameRate(120)
	colorMode(HSB, 255)
	stroke(255)
	smooth(8)
}

draw = function () {
	if (fade.v) {
		noStroke()
		fill(32, 4)
		rect(0, 0, sketch.width, sketch.height)
	}

	var ct = 0
	translate(sketch.width / 2, sketch.height / 2)
	strokeWeight(sw.v)
	while (ct < 1 * speed.v) {
		ct += 1

		var dt = 0.005
		var dx = dt * (a.v * (y.v - x.v))
		var dy = dt * (x.v * (b.v - z.v) - y.v)
		var dz = dt * (x.v * y.v - c.v * z.v)
		x.v += dx
		y.v += dy
		z.v += dz
		// stroke(255, z.v * 5)
		stroke((abs(x.v * 5) + abs(y.v * 5)) % 256, 128, abs(z.v * 10))
		line((x.v-dx) * 10, (y.v-dy) * 10, x.v * 10, y.v * 10)
	}
	x.update()
	y.update()
	z.update()
}
