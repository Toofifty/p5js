var ndots = bind.number('dots', 10)
var size  = bind.number('dot_size', 8)
var G     = bind.number('gravity', 0.1)
var spr   = bind.number('spread', 0.005)

var attract = bind.toggle('attract', true)

var maxdist = dist(0, 0, sketch.width, sketch.height)

var dots = []
var md = false

var dirs = 4

page.set_title('dot chase')
page.set_description('Point and click to attract some dots.')

setup = function () {
    colorMode(HSB, 256)
    noStroke()
    frameRate(120)
    background(0)

    for (let i = 0; i < ndots.v; i++) {
        dots.push(new_dot(i))
    }
}

draw = function () {
    update_dot_amount()

    fill(0, 16)
    rect(0, 0, sketch.width, sketch.height)

    for (let i in dots) {
        let d = dots[i]
        d.collide()
        d.update()
        d.draw()
    }
}

mousePressed = function () {
    md = true
}

mouseReleased = function () {
    md = false
}

var update_dot_amount = function () {
    while (dots.length > ndots.v) dots.pop()
    while (dots.length < ndots.v) dots.push(new_dot(dots.length))
}

var rand_bounce = function () {
    return random(0.3, 0.5)
}

var new_dot = function (id) {
    return new Dot(id, random(sketch.width), random(sketch.height))
}

var Dot = function (id, x, y) {
    this.id = id
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.s = random(1, 4)
    this.g = id % dirs

    this.update = function () {
        if (md) {
            let a = atan((mouseY - this.y) / (mouseX - this.x))
            let d = dist(mouseX, mouseY, this.x, this.y)

            let m = (mouseX >= this.x && attract.v || mouseX <= this.x && !attract.v) ? 1 : -1

            this.vx += m * this.s * cos(a) / 10
            this.vy += m * this.s * sin(a) / 10

            if (d < 50) {
                this.vx *= 0.9
                this.vy *= 0.9
            }
        } else {
            switch (this.g) {
            case 0:
                this.vy += G.v
                break
            case 1:
                this.vy -= G.v
                break
            case 2:
                this.vx += G.v
                break
            case 3:
                this.vx -= G.v
                break
            }
        }

        this.x += this.vx
        this.y += this.vy

        if (this.y + size.v / 2 > sketch.height) {
            this.vy *= -rand_bounce()
            this.y = sketch.height - size.v / 2
        }

        if (this.y + size.v / 2 <= 0) {
            this.vy *= -rand_bounce()
            this.y = size.v / 2
        }

        if (this.x + size.v / 2 > sketch.width) {
            this.vx *= -rand_bounce()
            this.x = sketch.width - size.v / 2
        }

        if (this.x + size.v / 2 <= 0) {
            this.vx *= -rand_bounce()
            this.x = size.v / 2
        }

        if (random(1) > 0.999) {
            this.g += int(random(dirs + 1))
            this.g %= dirs
        }
    }

    this.collide = function () {
        if (random(1) > 0.1) return

        for (let i = this.id + 1; i < dots.length; i++) {
            let d = dots[i]
            let dx = d.x - this.x
            let dy = d.y - this.y
            let di = dist(0, 0, dx, dy)

            if (di < size.v) {
                let a = atan2(dy, dx)
                let tx = this.x + cos(a) * size.v
                let ty = this.y + sin(a) * size.v
                let ax = (tx - d.x) * spr.v
                let ay = (ty - d.y) * spr.v

                this.vx -= ax
                this.vy -= ay
                d.vx += ax
                d.vy += ay
            }
        }
    }

    this.draw = function () {
        fill(noise(this.x / 1000, this.y / 1000) * 255, 128, 255 - dist(sketch.width / 2, sketch.height / 2, this.x, this.y) / 3)
        ellipse(this.x, this.y, size.v, size.v)
    }
}
