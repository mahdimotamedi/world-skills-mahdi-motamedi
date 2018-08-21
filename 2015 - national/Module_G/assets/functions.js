function drop_to_module(drag_obj, drop_obj, mod, clone) {
    var div = $("<div>", {class:'row'});
    if (mod == "empoly")
        $(div).append('<a class="btn blue sticky" onclick="userStopTimer($(this).next())">توقف</a>' +
            '<span class="e-timer" data-seconds="0">00:00:00</span>');

    $(div).append('<a class="btn red sticky_2" onclick="removeUser($(this).parent())">حذف</a>');

    if (clone)
        $($(drag_obj).clone(true).unbind()).appendTo(div);
    else
        $(drag_obj).appendTo(div);

    $(div).hide().appendTo(drop_obj);
    $(div).slideDown(200);
}

function getUserData(drag_obj, drop_obj) {
    var data_name = $(drag_obj).attr("data-name");
    var data = {
        isLeaderInModule: false,
        isEmpolyInModule: false,
        insertToLeader: false,
        insertToEmpoly: false,
        isInModule: false,
        countRoleAdmins: 0,
        countRoleEmpolys: 0,
        timeCalculate: 0
    };

    if ($(drag_obj).parent().hasClass("row"))
        data.isInModule = true;

    if ($(drop_obj).parent().find(".leader [data-name='" + data_name + "']").length)
        data.isLeaderInModule = true;

    if ($(drop_obj).parent().find(".empoly [data-name='" + data_name + "']").length)
        data.isEmpolyInModule = true;

    if ($(drop_obj).hasClass("leader"))
        data.insertToLeader = true;

    if ($(drop_obj).hasClass("empoly"))
        data.insertToEmpoly = true;

    data.countRoleAdmins = $(".leader [data-name='"+ data_name +"']").length;
    data.countRoleEmpolys = $(".empoly [data-name='"+ data_name +"']").length;

    $(".project [data-name= '"+ data_name +"'] .e-timer").each(function () {
        data.timeCalculate += $(this).attr("data-seconds");
    });

    return data;
}

function getModuleData(obj) {
    var data = {
        countLeaders: 0,
        countEmpolys: 0,
        state: 0
    };

    data.countLeaders = $(obj).find(".leader .row").length;
    data.countEmpolys = $(obj).find(".empoly .row").length;
    data.state = $(obj).attr("data-state");

    return data;
}

function checkRules(userData, moduleData, notice) {
    // user data rules
    if (userData.isLeaderInModule)
        return notice ? error("isAdmin") : false;

    if (userData.isEmpolyInModule)
        return notice ? error("isEmpolyIn") : false;

    if (userData.countRoleAdmins >= 1 && userData.insertToLeader)
        return notice ? error("isAdminOnce") : false;

    if (userData.countRoleEmpolys >= 2 && userData.insertToEmpoly)
        return notice ? error("maxEmpolyRole") : false;

    // module data rules
    if (moduleData.countLeaders >= 1 && userData.insertToLeader)
        return notice ? error("maxLeaders") : false;

    if (moduleData.countEmpolys >= 4 && userData.insertToEmpoly)
        return notice ? error("maxEmpolys") : false;

    if (moduleData.state == 1)
        return notice ? error("startedModule") : false;

    return true;
}

function removeUser(obj) {
    if ($(obj).parent().parent().attr('data-state') != 0)
        return false;

    $(obj).slideUp(200, function () {
        $(obj).remove();
    });
}

var premissionStartNew = true;

function startModule(obj) {
    if (!premissionStartNew)
        return error("dontPermissionStartNew");

    var moduleData = getModuleData(obj);
    if (moduleData.countLeaders < 1)
        return error("notEnoughLeaders");
    if (moduleData.countEmpolys < 4)
        return error("notEnoughEmpolys");

    $(obj).attr("data-state", 1);
    $(obj).find(".row").unbind();
    $(obj).find(".avatar").unbind();
    $(obj).find(".leader").unbind();
    $(obj).find(".empoly").unbind();

    $(obj).find(".project_ctls a").fadeOut(200);
    $(obj).find(".sticky_2").fadeOut(200);

    moduleTimersStart(obj);
    moduleUsersStart(obj);

    // 60 seconds time out between modules
    premissionStartNew = false;
    setTimeout(function () {
        premissionStartNew = true;
    }, 60000);
}

function moduleTimersStart(obj) {
    $(obj).find(".timer").attr('data-interval', setInterval(function () {
        if (parseInt($(obj).find(".timer").attr("data-seconds")) <= 0) {
            // end timers
            clearInterval($(obj).find(".timer").attr('data-interval'));
            $(obj).find(".e-timer").each(function () {
                $(this).prev().fadeOut(200);
                clearInterval($(this).attr("data-interval"));
            });
            $(obj).addClass("finished");
            $(obj).attr('data-state', 2);

            return false;
        }
        timer_negative($(obj).find(".timer"));
    }, 1000));
}

function moduleUsersStart(module_obj) {
    $(module_obj).find(".e-timer").each(function () {
        userStartTimer(this);
    });
}

function userStopTimer(obj) {
    if ($(obj).parent().parent().parent().attr("data-state") != 1)
        return false;

    if ($(obj).parent().parent().parent().find(".e-timer[data-interval]").length <= 1)
        return error("cantStopAllExperts");

    clearInterval($(obj).attr('data-interval'));
    $(obj).removeAttr('data-interval');
    $(obj).prev().text("آغاز");
    $(obj).prev().attr("onclick", "userStartTimer($(this).next())");
}

function userStartTimer(obj) {
    $(obj).attr('data-interval' , setInterval(function () {
        timer_positive(obj);
    }, 1000));
    $(obj).prev().text("توقف");
    $(obj).prev().attr("onclick", "userStopTimer($(this).next())");
}

function timer_negative(obj) {
    seconds = parseInt($(obj).attr("data-seconds")) - 1;
    $(obj).attr("data-seconds", seconds);
    $(obj).text(getTimeFormat(seconds));
}

function timer_positive(obj) {
    seconds = parseInt($(obj).attr("data-seconds")) + 1;
    $(obj).attr("data-seconds", seconds);
    $(obj).text(getTimeFormat(seconds));
}

var activeModuleSettings;
function changeSetting(obj) {
    var moduleData = getModuleData(obj);
    if (moduleData.state != 0)
        return error("startedModule");

    activeModuleSettings = obj;
    $("#title_input").val($(obj).find(".title h2").text());
    $("#timer_input").val($(obj).find(".timer").text());
    $(".change_setting_box").fadeIn(200);
}


function setNewSettings() {
    var title = $("#title_input").val();
    var time = $("#timer_input").val();
    var err = $(".err_sp");
    if (title.length < 3)
        return $(".err_sp").text("نام ماژول حداقل باید سه حرف باشد.");

    var seconds = getTimeSeconds(time);
    if (seconds === null)
        return err.text("زمان وارد شده معتبر نیست. حالت درست: 02:30:00");
    if (seconds < 5400 || seconds > 14400)
        return err.text("حداقل 1:30 و حداکثر 4:00 برای زمان در نظر گرفته شود.");

    err.text("");
    $(activeModuleSettings).find(".title h2").text(title);
    $(activeModuleSettings).find(".timer").text(time).attr("data-seconds", seconds);
    activeModuleSettings = null;
    $(".change_setting_box").fadeOut(200);
}

function cancelNewSettings() {
    activeModuleSettings = null;
    $(".change_setting_box").fadeOut(200);
}

// component functions

function getTimeSeconds(time) {
    var data = time.split(':'), seconds = 0;
    if (data.length < 3)
        return null;
    seconds += parseInt(data[0]) * 60 * 60
        + parseInt(data[1]) * 60
        + parseInt(data[2]);
    return seconds;
}

function getTimeFormat(seconds) {
    time = Math.floor(seconds / (60*60)) + ':' + // hours
        Math.floor((seconds % (60*60) / 60)) + ':' + // minutes
        seconds % (60); // seconds
    return time;
}

// error functions

function error(mod) {
    dragPermission = false;
    switch (mod) {
        // add user errors
        case "isAdmin":
            display_error("این کاربر در این ماژول مدیر است.");
            break;
        case "isAdminOnce":
            display_error("هر فرد فقط در یک ماژول اجازه مدیر شدن دارد.");
            break;
        case "isEmpolyIn":
            display_error("قبلا به عنوان کارشناس ماژول انتخاب شده است.");
            break;
        case "maxEmpolyRole":
            display_error("هر فرد حداکثر در دوگروه اجازه کارشناس شدن دارد.");
            break;
        case "maxLeaders":
            display_error("در هر ماژول به یک مدیر نیاز است.");
            break;
        case "maxEmpolys":
            display_error("در هر ماژول به چهار کارشناس نیاز است.");
            break;
        case "state":
            display_error("ماژول آغاز شده است.");
            break;

        // start module errors
        case "notEnoughLeaders":
            display_error("حداقل یک مدیر برای شروع ماژول لازم است.");
            break;
        case "notEnoughEmpolys":
            display_error("حداقل چهار عضو برای شروع ماژول لازم است.");
            break;
        case "startedModule":
            display_error("تغییر تنظیمات ماژولی که شروع شده است، ممکن نیست.");
            break;

        case "dontPermissionStartNew":
            display_error("هر ماژول یک دقیقه پس از ماژول قبلی، میتواند شروع شود.");
            break;
        case "cantStopAllExperts":
            display_error("نمیتوان تمامی اعضای ماژول را متوقف کرد.");
            break;

        default:
            display_error("مشکلی در انجام عملیات رخ داده است.");
            break
    }

    return false;
}

var error_display;
function display_error(err_text) {
    clearTimeout(error_display);
    $(".notice").hide().text(err_text).fadeIn(200);
    error_display = setTimeout(function () {
        $(".notice").fadeOut(200);
    }, 1700);
}