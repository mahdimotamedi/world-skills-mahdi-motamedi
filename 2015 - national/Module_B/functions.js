var current_step = 0, currentItem, nextPermission = true;

function continueFromLast() {
    var items = localStorage.info.split(',');
    var i = 0;
    each ("input[type='text']", function (obj) {
        obj.value = items[i];
        i++;
    });

    current_step = localStorage.current_step != 0 ? localStorage.current_step - 1 : 0;
    currentItem = query("[data-step='"+ current_step +"']");

    each('.current_step', function (item) {
        item.classList.remove('current_step');
    });

    if (current_step)
        hideAnimate('.step-welcome');

    currentItem.classList.add('current_step');

    check_for_start();
}

function check_for_start() {
    each(".step-welcome input[type='text']", function (obj) {
        if (obj.value == "") {
            obj.classList.add("red_border");
            if (nextPermission)
                obj.focus();
            nextPermission = false;
        }
        else {
            obj.classList.remove("red_border");
        }
    });

    if (nextPermission) {
        show("#controls");
        query('.current_step').classList.remove("current_step");
        current_step++;

        // animate for next item
        hideAnimate(currentItem, function () {
            currentItem = currentItem.nextElementSibling;
            currentItem.classList.add("current_step");
            showAnimate(currentItem);
        });

        // time working
        start_timer();
    }
    else
        nextPermission = true;

    return true;
}

function next_step() {
    if (preview_state) {
        alert("لطفا ابتدا روی ویرایش اطلاعات کلیک کنید.");
        return false;
    }

    currentItem = query(".current_step");
    // check this is welcome step?
    if (currentItem.classList.contains("step-welcome")) {
        check_for_start();
        return true;
    }

    // this is not welcome step
    var inputs = currentItem.querySelectorAll("input[type='text']");
    for (i = 0; i < inputs.length; i++) {
        item = inputs[i];
        var max = item.parentNode.previousElementSibling;
        max = parseFloat(max.innerText);
        if ((item.value != max && item.value != 0) || item.value == "" || isNaN(parseFloat(item.value))) {
            item.classList.add("red_border");
            if (nextPermission)
                item.select();
            nextPermission = false;
        }
        else {
            item.classList.remove("red_border");
        }
    }

    if (nextPermission) {
        // go to the next step
        if (current_step == 4) {
            preview();
        }
        else
            hideAnimate(currentItem, function () {
                currentItem.classList.remove("current_step");
                currentItem = currentItem.nextElementSibling;
                currentItem.classList.add("current_step");
                current_step++;
                showAnimate(currentItem);
            });
    }
    else
        nextPermission = true;
}

function prev_step() {
    if (preview_state) {
        alert("لطفا ابتدا روی ویرایش اطلاعات کلیک کنید.");
        return false;
    }

    if (current_step <= 1) {
        alert("شما در مرحله اول هستید.");
        return false;
    }

    hideAnimate(currentItem, function () {
        currentItem.classList.remove("current_step");
        currentItem = currentItem.previousElementSibling;
        currentItem.classList.add("current_step");
        current_step--;
        showAnimate(currentItem);
    });
}

var preview_state = false;
function preview() {
    if (preview_state) {
        each (".input_span", function (item) {
            item.remove();
        });

        show("input[type='text']");

        preview_state = false;
        hide(".steps");
        var item = query("#time-display");
        item.setAttribute('data-seconds', 300);
        item.innerText = "5:00";
        start_timer();
        showAnimate(currentItem, function () {
            show(".no_preview");
            item = query("#preview_btn");
            item.value = "پیش نمایش";
        });

        return true;
    }

    each ("input[type='text']", function (item) {
        span = document.createElement("span");
        span.classList.add("input_span");
        span.innerText = item.value;
        item.parentNode.appendChild(span);
        hide(item);
    });

    preview_state = true;
    hideAnimate(currentItem, function () {
        item = query("#time-display");
        clearInterval(item.getAttribute("data-interval"));
        hide(".no_preview");
        show(".steps");
        item = query("#preview_btn");
        item.value = "ویرایش اطلاعات";
    });

}

function finish_set() {
    var xhr = new XMLHttpRequest();
    var requests = "?";
    each ("input[type='text']", function (item) {
        requests += (item.name + "=" + item.value + "&");
    });

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("ذخیره سازی انجام شد.");
        }
    };
    xhr.open("GET", "./assets/saver.php" + requests, true);
    xhr.send();
}

function start_timer() {
    timeSpan = query("#time-display");
    timeSpan.setAttribute("data-interval", setInterval(function () {
        timeSpan.setAttribute("data-seconds", timeSpan.getAttribute("data-seconds") - 1);
        timeSpan.innerText = getTimeFormat(timeSpan.getAttribute("data-seconds"));

        if ((timeSpan.getAttribute("data-seconds") % 60) == 0) {
            query("#minute-beep").play();
        }
        if (timeSpan.getAttribute("data-seconds") == 0) {
            query("#ending-theme").play();
            clearInterval(timeSpan.getAttribute("data-interval"));
            preview();
        }
    }, 1000));
}

/* component functions */

function getTimeFormat(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return min + ":" + sec;
}

function step_elem() {
    return query("[data-step='"+ current_step +"']");
}