var nverts    = bind.number('vertices', 80)
var vert_size = bind.number('max vertex size', 20)
var edge_size = bind.number('line thickness', 2)
var movement  = bind.number('cursor movement variance', 20)
var max_dist  = bind.number('max line distance', 200)
var speed     = bind.number('movement speed', 0.5)

var md = false

var min_width  = -sketch.width / movement
var min_height = -sketch.height / movement
var max_width  = sketch.width - min_width
var max_height = sketch.height - min_height

page.set_title('connect')
page.set_description('Move your mouse around and drag some points.')

var verts = []

setup = function () {
    for (let i = 0; i < nverts.v; i++) {
        verts.push(new Vertex())
    }
    console.log(verts)
}

draw = function () {
    update_vertex_amount()
    background(32)
    for (let i in verts) {
        let v = verts[i]
        v.move()
        v.move_space()
        v.draw_lines(i)
        v.draw()
    }
    if (mouseIsPressed) {
        for (let i in verts) {
            let v = verts[i]
            if (v.check_bounds()) v.drag()
        }
    }
}

var update_vertex_amount = function () {
    while (verts.length > nverts.v) verts.pop()
    while (verts.length < nverts.v) verts.push(new Vertex())
}

var Vertex = function () {
    this.x   = random(0, sketch.width)
    this.y   = random(0, sketch.height)
    this.dir = random(0, TWO_PI)
    this.v   = random(-vert_size.v + 1, vert_size.v)
    this.h   = false
    this.dm  = 1

    this.move = function () {
        if (this.h) return

        let md = atan((mouseY - this.y) / (mouseX - this.x))

        this.x += speed.v * cos(this.dir)
        this.y += speed.v * sin(this.dir)

        // this.x += speed.v * cos(md)
        // this.y += speed.v * sin(md)

        this.dir += speed.v / 50

        if (random() > 0.98) this.dm *= -1

        this.dir %= TWO_PI

        while (this.x > max_width) this.x -= max_width
        while (this.x < min_width) this.x += max_width
        while (this.y > max_height) this.y -= max_height
        while (this.y < min_height) this.y += max_height
    }

    this.move_space = function () {
        if (this.h) return

        this.x -= (mouseX - pmouseX) / movement.v
        this.y -= (mouseY - pmouseY) / movement.v
    }

    this.check_bounds = function () {
        this.h = dist(this.x, this.y, mouseX, mouseY) <= vert_size.v
        return this.h
    }

    this.drag = function () {
        this.x = this.x * 0.5 + mouseX * 0.5
        this.y = this.y * 0.5 + mouseY * 0.5
    }

    this.draw_lines = function (offset) {
        for (let i = offset; i < verts.length; i++) {
            let v = verts[i]
            let d = dist(this.x, this.y, v.x, v.y)
            if (d < max_dist.v) {
                stroke(250, 256 - (256 * d / max_dist.v))
                line(this.x, this.y, v.x, v.y)
            }
        }
    }

    this.draw = function () {
        let md = dist(this.x, this.y, mouseX, mouseY)
        stroke(250, 256 - (256 * md / sketch.width))
        fill(250, 200 - (200 * md / sketch.width))
        if (this.h) ellipse(this.x, this.y, (this.v + vert_size.v) * 1.2, (this.v + vert_size.v) * 1.2)
        else ellipse(this.x, this.y, this.v + vert_size.v, this.v + vert_size.v)
    }
}
