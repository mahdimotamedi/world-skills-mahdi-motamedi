window.addEventListener("load", set_column_height);
window.addEventListener("resize", function () {
    if (window.innerWidth >= 850) {
        set_column_height();
        return false;
    }
    var items = document.querySelectorAll(".container > .column");
    for (var j=0 ; j<items.length ; j++) {
        if (j != 2 && j != 3)
            items[j].style.height = "auto";
    }
});

function set_column_height() {
    if (window.innerWidth >= 850) {
        var item = document.querySelector(".container");
        var cols = document.querySelectorAll(".container > .column");
        var height = item.getBoundingClientRect().height;
        for (var i=0 ; i<cols.length ; i++) {
            if (i != 1 && i != 2)
                cols[i].style.height = height+"px";
        }
    }
}