$(function () {
    $sketch_list = $('#sketch-list')

    for (var i in OPT.sketches) {
        var sketch_name = OPT.sketches[i]
        $sketch_list.append(
            '<li class="sketch-list-option" id="nav-sketch-' + sketch_name + '">'
            + sketch_name
            + '</li>'
        )
    }

    $('.sketch-list-option').click(function () { load($(this).text()) })
})
