/**
 * For all settings relevant to the surrounding
 * page of the sketch, that are set by the sketch
 */
const page = {
    /**
     * Set the title of the sketch
     * Hides the title if arg 1 is null
     */
    set_title: function (title) {
        const $title = $('#title')
        if (title) {
            $title.text(title)
            if (!$title.hasClass('show')) {
                $title.addClass('show')
            }
        } else if ($title.hasClass('show')) {
            $title.removeClass('show')
        }
    },

    /**
     * Set the source url of the sketch
     * Hides the source link if arg 1 is null
     */
    set_source: function (url) {
        const $source_link = $('#source-link')
        if (url) {
            $source_link.children('a').attr('href', url)
            if (!$source_link.hasClass('show')) {
                $source_link.addClass('show')
            }
        } else if ($source_link.hasClass('show')) {
            $source_link.removeClass('show')
        }
    },

    /**
     * Set the description of the sketch
     * Hides the description if arg 1 is null
     */
    set_description: function (desc) {
        const $description = $('#description')
        if (desc) {
            $description.html(desc)
            if (!$description.hasClass('show')) {
                $description.addClass('show')
            }
        } else if ($description.hasClass('show')) {
            $description.removeClass('show')
        }
    },

    /**
     * Activate the sketch on the left hand
     * side navigation (and deactivate all others)
     */
    set_active: function (sketch_name) {
        $('.sketch-list-option').removeClass('active')
        $('#nav-sketch-' + sketch_name).addClass('active')
    },

    /**
     * Hide/show the control panel on the right side
     * of the page, and rotate the arrow button
     */
    toggle_controls: function () {
        const $controls = $('#controls')
        const $arrow = $('.right-arrow')
        if ($controls.hasClass('hidden')) {
            $controls.removeClass('hidden')
            $arrow.removeClass('flipped')
        } else {
            $controls.addClass('hidden')
            $arrow.addClass('flipped')
        }
    },

    /**
     * Hide/show the navigation panel on the left side
     * of the page, and rotate the arrow button
     */
    toggle_nav: function () {
        const $nav = $('#nav')
        const $arrow = $('.left-arrow')
        if ($nav.hasClass('hidden')) {
            $nav.removeClass('hidden')
            $arrow.removeClass('flipped')
        } else {
            $nav.addClass('hidden')
            $arrow.addClass('flipped')
        }
    },

    /**
     * Hide the sketch container
     */
    fade_out: function () {
        $('.sketch-container').addClass('fade')
    },

    /**
     * Show the sketch container
     */
    fade_in: function () {
        $('.sketch-container').removeClass('fade')
    }
}

/**
 * Loads the sketches into the main div, and binds variables
 * into toggles, sliders, and buttons in the control panel
 */
const sketch = {
    name: '',
    canvas: null,
    container: $(OPT.sketch_container),
    paused: false,

    width: 0,
    height: 0,

    /**
     * Load the current sketch again
     */
    reload: function () {
        load(this.name)
    },

    /**
     * Toggle between play and pause
     */
    play_pause: function () {
        if (this.paused) this.play()
        else this.pause()
    },

    /**
     * Pause the sketch using p5's noLoop()
     */
    pause: function () {
        if (this.canvas) noLoop()
        $('.fa-pause').removeClass('fa-pause').addClass('fa-play')
        this.paused = true
    },

    /**
     * Resume the sketch using p5's loop()
     */
    play: function () {
        if (this.canvas) loop()
        $('.fa-play').removeClass('fa-play').addClass('fa-pause')
        this.paused = false
    },

    /**
     * Load the p5 canvas (only need to be done once)
     */
    load_canvas: function () {
        this.width = this.container.width()
        this.height = this.container.height()
        this.canvas = createCanvas(this.width, this.height)
        // move sketch into the sketch container
        this.canvas.parent(OPT.sketch_container);
        console.log('SKETCH: Canvas loaded')
    },

    /**
     * Reset some p5 options
     */
    reset_p5: function () {
        colorMode(RGB)
        smooth(1)
        fill(255)
        stroke(255)
        strokeWeight(1)
        frameRate(60)
        background(32)
    }
}

/**
 * Object for binding variables to buttons, toggles
 * and sliders on the control panel
 */
const bind = {
    controls: {},

    /**
     * Create a boolean toggle
     */
    toggle: function (label, value) {
        let name = label.toLowerCase().replace(' ', '_')
        console.log('BIND: toggle::' + name)

        let control = {
            el: null,
            v: value,
            initial: value,
            update: function () {
                this.el.children('input').prop('checked', this.v)
            }
        }

        let input = $('<input '
            + 'type="checkbox" '
            + (value ? 'checked ' : ' ')
            + '>'
        ).change(function () {
            control.v = $(this).prop('checked')
        })
        let input_label = $('<div class="control label">' + label + '</div>')

        control.el = $('<li>').append(input_label).append(input)

        this.controls[name] = control
        $('#control-list').append(control.el)
        return control
    },

    /**
     * Create a number input
     */
    number: function (label, value, min, max, step) {
        value = parseFloat(value)
        let name = label.toLowerCase().replace(' ', '_')
        console.log('BIND: number::' + name)

        let control = {
            el: null,
            v: value,
            initial: value,
            update: function () {
                this.el.children('input').val(parseFloat(this.v).toFixed(3))
            }
        }

        let input = $('<input '
            + 'type="number" '
            + 'value="' + value.toFixed(3) +'" '
            + (min ? 'min="' + min + '" ' : '')
            + (max ? 'max="' + max + '" ' : '')
            + (step ? 'step="' + step + '" ' : '')
            + '>'
        ).change(function () {
            control.v = parseFloat($(this).val())
        })
        let input_label = $('<div class="control label">' + label + '</div>')

        control.el = $('<li>').append(input_label).append(input)

        this.controls[name] = control
        $('#control-list').append(control.el)
        return control
    },

    button: function (label, callback) {

        return {}
    },

    /**
     * Destroy all bound inputs from the control panel
     */
    destroy: function () {
        let self = this

        // fade out first
        for (let i in this.controls) {
            this.controls[i].el.addClass('removed')
        }

        setTimeout(function () {
            // remove shortly after
            for (let i in self.controls) {
                self.controls[i].el.remove()
            }
            self.controls = {}
            console.log('BIND: Destroyed controls')
        }, 250)
    }
}

/**
 * Load and setup a sketch via ajax that should be located in
 * /sketch/(sketch_name).js
 */
const load = function (sketch_name) {
    // pause and clean up old sketch
    page.fade_out()
    sketch.pause()
    bind.destroy()

    // delay the new sketch in the hopes that bind.destroy()
    // has already completed
    setTimeout(function () {
        sketch.name = sketch_name
        page.set_active(sketch_name)

        $.getScript(OPT.host + OPT.sketch_dir + sketch_name + '.js')
            .done(function (script, status) {
                console.log(script)
                sketch.reset_p5()
                setup()
                page.fade_in()
            })
            .fail(function (request, settings, exception) {
                console.error(request.responseText)
            })
    }, 250)
}

/**
 * Dummy p5 sketch
 * For settings things up before loading
 * an actual sketch
 */
var setup = function () {
    sketch.load_canvas()
    console.log('Initialized dummy sketch')
}

var draw = function () {
    // console.log('Dummy sketch is still drawing')
}

// delay the start of the initial sketch so there
// isn't a huge load time to show the page
setTimeout(function () {
    setup()
    // load in the first (default) sketch
    // load(OPT.sketches[0])
}, 2000)
