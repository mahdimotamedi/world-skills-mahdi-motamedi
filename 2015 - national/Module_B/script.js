// on load functions
hide(".steps");
hide("#controls");
show(".step-welcome");
currentItem = query(".step-welcome");
currentItem.classList.add("current_step");


// dir of english input
onElements("#expert_name", 'keyup', function (obj, ev) {
    if ((obj.value.charCodeAt(0) > 1570 && obj.value.charCodeAt(0) < 1712) || obj.value == "")
        obj.dir = "rtl";
    else
        obj.dir = "ltr";
});


// calculate max of inputs
onElements("input[type='text']", "change", function (obj, ev) {
    if (currentItem.classList.contains("step-welcome"))
        return false;

    var total = 0;
    each (currentItem.querySelectorAll("input[type='text']"), function (item) {
        total += parseFloat(item.value) ? parseFloat(item.value) : 0;
    });

    var maxElement = currentItem.querySelector("tfoot th:last-of-type");
    maxElement.innerText = total;
});


// effect for tooltips
onElements(".steps td:nth-of-type(2)", "mousemove", function (obj, ev) {
    var item = obj.querySelector(".tooltip");

    if (item) {
        item.style.top = (ev.clientY + 6) + "px";
        item.style.left = (ev.clientX + 6) + "px";
    }
});

// add actions for keyboard press
onElements(window, "keypress", function (obj, ev) {
    var key_code = ev.keyCode || ev.which;
    switch (key_code) {
        case 107:
            next_step();
            break;

        case 106:
            prev_step();
            break;
    }
});

// save if press shift and ctrl and s
onElements(window, "keydown", function (obj, ev) {
    var key_code = ev.keyCode || ev.which;
    if (ev.ctrlKey && ev.shiftKey && key_code == 83) {
        var info = "";
        each("input[type='text']", function (obj) {
            info += obj.value + ",";
        });
        localStorage.info = info;
        localStorage.current_step = current_step;

        alert ("saved");
    }
});