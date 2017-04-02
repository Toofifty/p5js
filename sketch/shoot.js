let g = bind.number('gravity', 98)
let ball_amount = bind.number('balls', 10)
let max_size = bind.number('max_size', 100)

let balls = []
let sel = null

page.set_title('ball shoot')
page.set_source()
page.set_description('Click a ball, aim and shoot. Press SPACE to stop all balls and B to add a new ball.')

setup = function () {
    colorMode(HSB, 256)
    noStroke()
    background(32, 128, 255)

    balls = []
    for (let i = 0; i < ball_amount.v; i++) {
        balls.push(new Ball(i, Math.random(sketch.width), Math.random(sketch.height), max_size.v))
    }
    console.log(balls)
}

draw = function () {
    fill(32)
    rect(0, 0, sketch.width, sketch.height)

    for (let i in balls) {
        balls[i].update()
        balls[i].collide()
        balls[i].draw()
        console.log(balls[i])
    }

    if (sel) {
        stroke(255)
        strokeWeight(3)
        line(sel.x, sel.y, mouseX, mouseY)
        noStroke()
    }
}

function Ball (id, x, y, size) {
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
                let angle = atan2(dy, dx)
                let tx = this.x + cos(angle) * md
                let ty = this.y + sin(angle) * md
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

        if (this.x + this.size / 2 > sketch.width || this.x - this.size / 2 < 0) {
            this.vx *= -0.9
            this.x = this.x + this.size / 2 > sketch.width ? sketch.width : this.size / 2
        }

        if (this.y + this.size / 2 > sketch.height || this.y - this.size / 2 < 0) {
            this.vy *= -0.9
            this.y = this.y + this.size / 2 > sketch.height ? sketch.height : this.size / 2
        }
    }

    this.draw = function () {
        // fill(255 - this.vx - this.vy, 128, 255)
        fill(32, 126, 254)
        noStroke()
        ellipse(this.x, this.y, this.size, this.size)
    }
}

mousePressed = function () {
    if (!sel) {
        for (let i in balls) {
            if (dist(mouseX, mouseY, balls[i].x, balls[i].y) < balls[i].size / 2) {
                sel = balls[i]
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
            balls[i].vx = 0
            balls[i].vy = 0
        }
    } else if (key == 'b') {
        balls.push(new Ball(balls.length, mouseX, mouseY, random(10, max_size.v)))
    }
}
