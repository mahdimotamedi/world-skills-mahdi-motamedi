var dragPermission = false;

$(".avatar").draggable({
    scroll: false,
    helper: 'clone',
    revert: function (dropped) {
        if (!dragPermission) {
            return true;
        }

        return !dropped;
    }
});

$(".leader").droppable({
    drop: function (event, ui) {
        var userData = getUserData(ui.draggable, this);
        var moduleData = getModuleData(this.parentNode);
        if (!checkRules(userData, moduleData, true)) {
            dragPermission = false;
            return false;
        }

        dragPermission = true;
        drop_to_module(ui.draggable, this, 'leader', !userData.isInModule);
    }
});

$(".empoly").droppable({
    drop: function (event, ui) {
        var userData = getUserData(ui.draggable, this);
        var moduleData = getModuleData(this.parentNode);
        if (!checkRules(userData, moduleData, true)) {
            dragPermission = false;
            return false;
        }

        dragPermission = true;
        drop_to_module(ui.draggable, this, 'empoly', !userData.isInModule);
    }
});

// display information of expert
var userDisplay;
$(".avatar").bind('click', function () {
    var info = "ماژول های عضو<br><br>";
    $(".project [data-name='" + $(this).attr("data-name") + "']").each(function () {
        info += $(this).parent().parent().parent().find(".title h2").text() +
        "<br> ";
        if ($(this).parent().parent().hasClass("empoly"))
            info += $(this).parent().find(".e-timer").text() + "<br><hr><br>";
        else {
            info += $(this).parent().parent().parent().find(".timer").text() + "<br><hr><br>";
        }
    });

    clearTimeout(userDisplay);
    $(".expert_info").hide().html(info).fadeIn(200);
    userDisplay = setTimeout(function () {
        $(".expert_info").fadeOut(200);
    }, 1700)
});