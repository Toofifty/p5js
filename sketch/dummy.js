var dummy_cycle = 0

page.set_title('<- choose a sketch')
page.set_source(null)
page.set_description('This is a dummy sketch for testing :)')

var setup = function () {
  sketch.load_canvas()
  colorMode(HSB, 255)
  console.log('Initialized dummy sketch')
}

var draw = function () {
  background(dummy_cycle, 128, 255)
  dummy_cycle += 0.1
  dummy_cycle %= 256
}
