var dragPermission = false, offset;

$(".sub img").draggable({
    scroll: false,
    helper: 'clone',
    revert: function (dropped) {
        if (!dragPermission)
            return true;

        return !dropped;
    }
}).css('z-index', '9999');

$(".canvas").droppable({
    drop: function (event, ui) {
        if ($(ui.draggable).parent().hasClass("items")) {
            var group = $(ui.draggable).parent().attr('id');
            if ($(".canvas [data-group='"+group+"']")[0]) {
                dragPermission = false;
                return false;
            }

            dragPermission = true;
            var img = ui.draggable.clone();
            $(img).attr('data-group', group)
                .css({top: ui.offset.top, left: ui.offset.left})
                .unbind();

            $(".canvas").append(img);
            addEvents(img);
        }
    }
});