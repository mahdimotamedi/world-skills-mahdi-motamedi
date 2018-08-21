var ImgKey = null, activeImg = null;

function upload_picture() {
    var browser = document.createElement("input");
    browser.type = "file";

    $(browser).bind("change", function () {
        var file = browser.files[0];
        var reader = new FileReader();
        $(reader).on("load", function () {
            $canvas = $(".canvas");
            $canvas.html("");
            activeImg = ImgKey = null;
            var img = new Image();

            img.width = 300;
            img.height = 400;

            $(img).addClass("main_pic").attr("src", reader.result);
            $canvas.append(img);

            $(img).css({
                top: "calc(50% - " + img.height/2 + "px)",
                left: "calc(50% - " + img.width/2 + "px)"
            });

            addEvents(img);
        });

        reader.readAsDataURL(file);
    });

    $(browser).trigger("click");
}

function recent_avatars() {
    $list = $(".list_saved_files");
    $ulList = $list.find("ul");

    $ulList.html("");
    var saves = JSON.parse(localStorage.getItem('saves'));
    for (var key in saves) {
        $ulList.prepend("<li onclick='load_avatar("+key+")'>" +
            saves[key].name + " - " + saves[key].date +
            "</li>");
    }
    $list.slideToggle(200);
}

function load_avatar(id) {
    saves = JSON.parse(localStorage.getItem("saves"));
    ImgKey = id;
    activeImg = saves[ImgKey];
    $canvas = $(".canvas");
    $canvas.html(activeImg.file);
    $canvas.find("img").each(function () {
        addEvents(this);
    });

    $(".list_saved_files").slideUp(200);
}

function save_pic() {
    if (activeImg === null) {
        $(".save_file").fadeIn(200);
    }
    else {
        save_to_localStorage();
    }
}

function save_to_localStorage() {
    var new_file = false;
    var saves = JSON.parse(localStorage.getItem('saves'));
    if (!saves) {
        localStorage.setItem('saves', '[]');
        saves = [];
    }

    if (activeImg === null) {
        new_file = true;
    }

    var info = "";
    $(".canvas img").each(function () {
       $(this).css({
           left: $(this).parent().css('left'),
           top: $(this).parent().css('top'),
           width: $(this).parent().css('width'),
           height: $(this).parent().css('height')
        });

        info += this.outerHTML;
    });

    if (new_file) {
        // if it is new file for saving
        var item = {
            'file': info,
            'name': $("#name_of_file").val(),
            'date': new Date()
        };
        saves.push(item);
        ImgKey = saves.length - 1;
    }
    else {
        item = {
            'file': info,
            'name': activeImg.name,
            'date': activeImg.date
        };
        saves[ImgKey] = item;
    }

    localStorage.setItem("saves", JSON.stringify(saves));
    activeImg = item;

    $(".save_file").fadeOut(200);
}

function export_as_jpeg() {
    var canvas = document.createElement("canvas");
    $pic = $(".canvas .main_pic");
    canvas.width = $pic.width();
    canvas.height = $pic.height();
    var ctx = canvas.getContext("2d");

    ctx.drawImage($pic[0], 0, 0,
        $pic.parent().width(),
        $pic.parent().height());

    $(".canvas img:not(.main_pic)").each(function () {
        ctx.drawImage(this,
            $(this).parent().offset().left - $pic.parent().offset().left,
            $(this).parent().offset().top - $pic.parent().offset().top,
            $(this).parent().width(),
            $(this).parent().height());
    });

    location = canvas.toDataURL("image/jpeg");
}

/* component functions */
function addEvents(obj) {
    $(obj).resizable();
    $(obj).parent().draggable({
        containment: "#main_canvas",
        scroll: false
    }).css('position', 'absolute');
    
    $(obj).bind("dblclick", function () {
        $(this).parent().remove();
        $(this).remove();
    });
}

function search_array(array, idKey) {
    for (var key in array) {
        if (array[key].id == idKey)
            return key;
    }
    return false;
}