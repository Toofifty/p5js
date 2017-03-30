/**
 * For all settings relevant to the surrounding
 * page of the sketch, that are set by the sketch
 */
var page = {
  /**
   * Set the title of the sketch
   * Hides the title if arg 1 is null
   */
  set_title: function (title) {
    var $title = $('#title')
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
    var $source_link = $('#source-link')
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
    var $description = $('#description')
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

  cover_delay: function () {
    return parseFloat($('#cover').css('transition-duration')) * 1000
  },

  fade_in: function () {
    $('.sketch-container').addClass('fade')
  },

  fade_out: function () {
    $('.sketch-container').removeClass('fade')
  }
}

/**
 * Loads the sketches into the main div, and binds variables
 * into toggles, sliders, and buttons in the control panel
 */
var sketch = {
  name: '',
  canvas: null,
  container: $(OPT.sketch_container),

  width: 0,
  height: 0,

  reload: function () {
    load(this.name)
  },

  play_pause: function () {
    if ($('.fa-pause').length > 0) this.pause()
    else this.play()
  },

  pause: function () {
    if (this.canvas) noLoop()
    $('.fa-pause').removeClass('fa-pause').addClass('fa-play')
  },

  play: function () {
    if (this.canvas) loop()
    $('.fa-play').removeClass('fa-play').addClass('fa-pause')
  },

  load_canvas: function () {
    this.width = this.container.width()
    this.height = this.container.height()

    this.canvas = createCanvas(this.width, this.height)
    this.canvas.parent(OPT.sketch_container);

    console.log('SKETCH: Canvas loaded')
  }
}

/**
 * Object for binding variables to buttons, toggles
 * and sliders on the control panel
 */
const bind = {
  controls: {},

  toggle: function (label, value) {

    return {}
  },

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

    control.el = $('<li>').append(input_label).append(input);

    this.controls[name] = control
    $('#control-list').append(control.el)
    return control
  },

  button: function (label, callback) {

    return {}
  },

  destroy: function () {
    let self = this
    for (i in this.controls) {
      this.controls[i].el.addClass('removed')
    }
    setTimeout(function () {
      for (i in self.controls) {
        console.log(self.controls)
        self.controls[i].el.remove()
      }
      self.controls = {}
      console.log('BIND: Destroyed controls')
    }, 250)
  }
}

var load = function (sketch_name) {
  page.fade_in()
  bind.destroy()
  sketch.pause()
  setTimeout(function () {
    sketch.name = sketch_name
    page.set_active(sketch_name)

    $.getScript(OPT.host + OPT.sketch_dir + sketch_name + '.js')
      .done(function (script, status) {
        console.log(script)
        setup()
        page.fade_out()
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
  console.log('Dummy sketch is still drawing')
}

var mousePressed = function () {
  console.log('Dummy mouse pressed')
}

var keyPressed = function () {
  console.log('Dummy key pressed')
}

setTimeout(function () {
  setup()
  // load in the first (default) sketch
  load(OPT.sketches[0])
}, 2000)
