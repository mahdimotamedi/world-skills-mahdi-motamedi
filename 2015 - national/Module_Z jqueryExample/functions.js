function draw_to_canvas() {
    var canvas = document.createElement("canvas");
    var img = $("img")[0];

    if ($(img).attr('src') == "") {
        alert ("upload an image first...");
        return false;
    }
    canvas.width = $(img).width();
    canvas.height = $(img).height();
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);
    $("body").append(canvas);
}

function export_to_jpeg() {
    var canvas = $("canvas")[0];
    if (!canvas) {
        alert ("draw to canvas first...");
        return false;
    }

    location.href = canvas.toDataURL("image/jpeg");
}

var active_pic = null;
function save() {
    var res = $("#upload_image_span")[0];
    $(res).css('top', $(res).parent().css('top'));
    $(res).css('left', $(res).parent().css('left'));
    res = $(res).prop("outerHTML");

    if (active_pic) {
        var active = active_pic;
    }
    else if (!localStorage.counter) {
        active = localStorage.counter = "0";
    }
    else {
        active = localStorage.counter = String(parseInt(localStorage.counter) + 1);
    }

    localStorage.setItem("pic_"+active, res);

    var date = new Date();
    localStorage.setItem("date_"+active, date.toString('YY/MM/DD hh:mm:ss'));
    active_pic = active;

    load_saved_files();
}

function load_page(code) {
    active_pic = code;
    $("#span_of_img").html(localStorage.getItem("pic_"+code));
    setEvents("#upload_image_span");
    $("#itemsList").hide();
}

function load_saved_files() {
    $("#itemsList").html("");
    for (i=0 ; i<=localStorage.counter ; i++) {
        $("#itemsList").append("<a onclick='load_page("+i+")'>number "+i+" , click for go , " +
            localStorage.getItem("date_"+i) +
            "</a><br>");
    }
}

function clear_save_data() {
    $("#itemsList").html("");
    localStorage.clear();
}

function open_saved_files_list() {
    $("#itemsList").slideDown();
}

function close_saved_files_list() {
    $("#itemsList").slideUp()
}

function setEvents(obj) {
    $(obj).resizable();
    $(obj).parent().draggable({
        containment: "#span_of_img"
    });
}