var g = bind.number('gravity', 98)
var ball_amount = bind.number('balls', 1)
var max_size = bind.number('max_size', 100)

var balls = []
var sel = null

page.set_title('ball shoot')
page.set_description('Click a ball, aim and shoot. Press SPACE to stop all balls and B to add a new ball.')

setup = function () {
    colorMode(HSB, 256)
    noStroke()

    balls = []
    for (let i = 0; i < ball_amount.v; i++) {
        balls.push(new_ball(i))
    }
}

draw = function () {
    update_ball_amount()

    fill(32, 16)
    rect(0, 0, sketch.width, sketch.height)

    for (let i in balls) {
        let b = balls[i]
        b.update()
        b.collide()
        b.draw()
    }

    if (sel) {
        stroke(255)
        strokeWeight(3)
        line(sel.x, sel.y, mouseX, mouseY)
        noStroke()
    }
}

mousePressed = function () {
    if (!sel) {
        for (let i in balls) {
            let b = balls[i]
            if (dist(mouseX, mouseY, b.x, b.y) < b.size / 2) {
                sel = b
                break
            }
        }
    } else {
        sel.shoot(mouseX, mouseY)
        sel = null
    }
}

keyPressed = function () {
    if (key == ' ') {
        for (let i in balls) {
            let b = balls[i]
            b.vx = 0
            b.vy = 0
        }
    }
}

var new_ball = function (id) {
    return new Ball(id, random(sketch.width), random(sketch.height), random(10, max_size.v))
}

var update_ball_amount = function () {
    while (balls.length > ball_amount.v) balls.pop()
    while (balls.length < ball_amount.v) balls.push(new_ball(balls.length))
}

var Ball = function (id, x, y, size) {
    this.id = id
    this.x = x
    this.y = y
    this.size = size

    this.vx = 0
    this.vy = 0

    this.collide = function () {
        for (let i in balls) {
            let b = balls[i]

            let dx = b.x - this.x
            let dy = b.y - this.y
            let di = dist(0, 0, dx, dy)
            let md = b.size / 2 + this.size / 2

            if (di < md) {
                let a = atan2(dy, dx)
                let tx = this.x + cos(a) * md
                let ty = this.y + sin(a) * md
                let ax = (tx - b.x)
                let ay = (ty - b.y)

                this.vx -= ax
                this.vy -= ay
                b.vx += ax
                b.vy += ay
            }
        }
    }

    this.shoot = function (mx, my) {
        this.vx += (mx - this.x) / 2
        this.vy += (my - this.y) / 2
    }

    this.update = function () {
        this.vy += g.v / frameRate()
        this.y += this.vy / 10
        this.x += this.vx / 10

        let maw = this.x + this.size / 2
        let miw = this.x - this.size / 2
        if (maw >= sketch.width || miw <= 0) {
            this.vx *= -0.9
            this.x = maw >= sketch.width ?
                sketch.width - this.size / 2 : this.size / 2
        }

        let mah = this.y + this.size / 2
        let mih = this.y - this.size / 2
        if (mah >= sketch.height || mih <= 0) {
            this.vy *= -0.9
            this.y = mah >= sketch.height ?
                sketch.height - this.size / 2 : this.size / 2
        }
    }

    this.draw = function () {
        fill((255 - this.vx - this.vy) % 256, 128, 255)
        noStroke()
        ellipse(this.x, this.y, this.size, this.size)
    }
}
