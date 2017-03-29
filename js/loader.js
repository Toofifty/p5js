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
    desc = desc || ''
    $('#description').html(desc)
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

  width: function () {
    return this.container.width()
  },

  height: function () {
    return this.container.height()
  },

  reload: function () {
    load(this.name)
  },

  load_canvas: function () {
    this.canvas = createCanvas(this.width(), this.height())
    this.canvas.parent(OPT.sketch_container);

    console.log('SKETCH: Canvas loaded')
  }
}

/**
 * Object for binding variables to buttons, toggles
 * and sliders on the control panel
 */
var bind = {
  controls: {},

  toggle: function (label, value) {

    return {}
  },

  slider: function (label, value, min, max, step) {
    var name = label.toLowerCase().replace(' ', '_')
    console.log('BIND: ' + name)
    this.controls[name] = {
      element: $('<li><div class="ui labeled input slider-container">'
        + '<div class="ui label">' + label + '</div>'
        + '<input type="number" value="' + value + '">'
        + '</div></li>'),
      v: value,
      min: min,
      max: max,
      step: step
    }
    console.log(this.controls[name])
    $('#control-list').append(this.controls[name].element)
    return this.controls[name]
  },

  button: function (label, callback) {

    return {}
  },

  destroy: function () {
    this.controls = {}
    console.log('BIND: Destroyed controls')
  }
}

var load = function (sketch_name) {
  page.fade_in()
  setTimeout(function () {
    var already_loaded = sketch.canvas != null
    if (already_loaded) {
      bind.destroy()
    }

    sketch.name = sketch_name

    $.getScript(OPT.host + OPT.sketch_dir + sketch_name + '.js')
      .done(function (script, status) {
        console.log(script)
        if (already_loaded) setup()
        page.fade_out()
      })
      .fail(function (request, settings, exception) {
        console.error(request.responseText)
      })
  }, 250)
}

load('dummy')
