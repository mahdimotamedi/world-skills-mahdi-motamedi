function query(q) {
    return document.querySelector(q);
}

function queryAll(q) {
    return document.querySelectorAll(q);
}

function each(q, func) {
    var items;
    if (typeof q == "object") {
        if (typeof q[0] == "object") {
            // this is array of dom objects
            items = q;
        }
        else {
            func(q);
            return true;
        }
    }
    else
        items = queryAll(q);

    for (i = 0; i < items.length; i++) {
        func(items[i]);
    }
}

function onElements(q, ev, func) {
    each(q, function (item) {
        item.addEventListener(ev, function (event) {
            func(this, event);
        })
    });
}

function hide(q) {
    each(q, function (item) {
        item.classList.add("hidden");
    });
}

function show(q) {
    each(q, function (item) {
        item.classList.remove("hidden");
    });
}

function showAnimate(q, afterFunc) {
    each(q , function (item) {
        show(item);
        item.style.animation = "showStep .5s 1 ease-in-out";

        setTimeout(function () {
            if (typeof afterFunc === "function")
                afterFunc();
            item.style.animation = "";
        }, 500);
    });
}

function hideAnimate(q, afterFunc) {
    each(q , function (item) {
        item.style.animation = "hideStep .5s 1 ease-in-out";

        setTimeout(function () {
            hide(item);
            if (typeof afterFunc === "function")
                afterFunc();
            item.style.animation = "";
        }, 500);
    });
}

// end routine functions