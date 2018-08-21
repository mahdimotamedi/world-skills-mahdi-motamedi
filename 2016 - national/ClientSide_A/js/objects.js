// player object
var player = new function () {
    /* properties */
    this.name = localStorage.getItem("playerName") ?
        localStorage.getItem("playerName") : "";

    /* methods */
    this.setInfo = function (info) {
        this.setName(info[0]);
    };
    
    this.setName = function (name) {
        this.name = name;
        localStorage.setItem("playerName", this.name);
        $("#playername").text(this.name);
    }
};

// game object
var game = new function () {
    /* properties */
    this.state = localStorage.getItem("gameState") ?
      localStorage.getItem("gameState") : 1;
    /*
    * state 1: game ready for start
    * state 2: game started
    * state 3: game paused
    * state 4: game finish
    * */

    this.timeSeconds = localStorage.getItem("timeSeconds") ?
        localStorage.getItem("timeSeconds") : 0;

    this.difficulty = localStorage.getItem("gameDifficulty") ?
        localStorage.getItem("gameDifficulty") : 1;

    this.image = localStorage.getItem("gameImage") ?
        localStorage.getItem("gameImage") : "imgs/example.jpg";


    /* methods */
    this.start = function () {
        var name = $("#name");
        var difficulty = $("#difficult");

        if (name.val() == "") {
            name.addClass("err");
            name.focus();
            return false;
        }
        else {
            name.removeClass("err");
        }

        player.setInfo([name.val()]);
        game.setInfo([difficulty.val(), "0"]);
        game.timerStart();
        game.setState("2");
        puzzle.createParts();

        $("#start").hide();
    };

    this.pause = function () {
        $(".btn-pause").text("RESUME").attr("onclick", "game.resume()");
        $("#puzzle").css("opacity",0);
        $("#puzzleDestination").css("opacity",0);
        this.setState('3');
        this.timerPause();
    };

    this.resume = function () {
        $(".btn-pause").text("PAUSE").attr("onclick", "game.pause()");
        $("#puzzle").css("opacity",1);
        $("#puzzleDestination").css("opacity",1);
        this.setState('2');
        this.timerStart();
    };

    this.restart = function () {
        $("#start").show();
        $("#end").hide();
        this.timerPause();
        this.setState("1");
    };

    this.finish = function () {
        var end = $("#end");
        end.slideDown().find('tbody').html('<td colspan="4" class="center_text">Loading rankings from server...</td>');
        this.timerPause();

        $.ajax({
            url: './save.php',
            type: 'POST',
            data: {name: player.name, difficult_id: game.difficulty, time: '00:'+$("#timer").text()},
            success: function (response, textStatus) {
                end.find("tbody").html(response);
            },
            error: function () {
                end.find("tbody").html("<tr><td colspan='4' class='center_text'>error request to server</td></tr>");
            }
        });

        /*var ajaxObject = new XMLHttpRequest();
        ajaxObject.onreadystatechange = function () {
            if (ajaxObject.readyState == 4 && ajaxObject.status == 200) {
                $("#end table tbody").html(ajaxObject.response);
            }
        };
        ajaxObject.open("GET", "./save.php?name="+player.name+
            "&difficult_id="+game.difficulty+
            "&time=00:"+$("#timer").text());
        ajaxObject.send();*/

        game.setState("4");
    };

    this.setInfo = function(info) {
        this.difficulty = info[0];
        localStorage.setItem("gameDifficulty", this.difficulty);

        this.setTimer(info[1]);
    };

    this.setTimer = function (seconds) {
        this.timeSeconds = seconds;
        localStorage.setItem("timeSeconds", this.timeSeconds);
        $("#timer").attr("data-seconds", this.timeSeconds).text(getTimeFormat(this.timeSeconds));
    };

    this.setState = function (state) {
        this.state = state;
        localStorage.setItem("gameState", this.state)
    };

    this.setImage = function (img) {
        this.image = img;
        localStorage.setItem("gameImage", this.image);

        $(".preview img").attr("src", this.image);
    };

    this.loadImage = function (ev) {
        var self = this;
        ev.stopPropagation();
        ev.preventDefault();
        var files = ev.target.files || ev.dataTransfer.files;

        var reader = new FileReader();
        $(reader).on("load", function () {
            game.image = reader.result;

            // crop image from center with 500px width and height
            var mainCanvas = document.createElement("canvas");
            mainCanvas.width = 500;
            mainCanvas.height = 500;

            var img = new Image();

            img.onload = function () {
                // crop image with 500 in 500
                var ctx = mainCanvas.getContext("2d");
                ctx.drawImage(img, (img.width/2)-250, (img.height/2)-250,
                    500, 500, 0, 0, 500, 500);

                self.setImage(mainCanvas.toDataURL("image/jpeg"));
            };

            img.src = game.image;
        });

        reader.readAsDataURL(files[0]);
    };

    this.timerStart = function () {
        var intervalIndex = setInterval(function () {
            game.timerPlus();
        }, 1000);
        $("#timer").attr("data-interval", intervalIndex);
    };

    this.timerPause = function () {
        clearInterval($("#timer").attr("data-interval"))
    };

    this.timerPlus = function () {
        var timer = $("#timer");
        var seconds = timer.attr("data-seconds");
        seconds++;
        timer.attr("data-seconds", seconds)
            .text(getTimeFormat(seconds));
        this.setTimer(seconds);
    };
};

var puzzle = new function () {
    var self = this;
    this.content = localStorage.getItem("puzzleContent") ?
        localStorage.getItem("puzzleContent") : "";

    this.destinition = localStorage.getItem("puzzleDestination") ?
        localStorage.getItem("puzzleDestination") : "";

    this.rows = 1;
    this.cols = 1;
    this.numbers = [];
    this.dragPermission = false;
    this.activeImage = null;
    this.rotateState = false;

    this.createParts = function () {
        this.setPuzzleSize();

        // make parts
        var sampleIMG = new Image();
        sampleIMG.src = game.image;

        var partWidth = 500/this.rows, partHeight = 500/this.cols;
        var parts = [], resultDes = "", index = 0;

        for (var i=0 ; i<this.rows ; i++) {
            for (var j=0 ; j<this.cols ; j++) {
                var canvas = document.createElement("canvas");
                canvas.width = partWidth;
                canvas.height = partHeight;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(sampleIMG, j*partWidth, i*partHeight,
                    partWidth, partHeight, 0, 0, partWidth, partHeight);
                var img = canvas.toDataURL("image/jpeg");
                parts.push(img);

                resultDes += "<img src='"+ img +"' class='empty_place' data-index='"+ index +"'>";
                index++;
            }
        }

        // randomize parts place
        var result = "", n = this.numbers.length;
        while (n--) {
            var random = Math.floor(Math.random() * n);
            var random_sec = Math.round(Math.random() * 3) * 90;
            result += "<img src='" + parts[this.numbers[random]] + "' style='transform: rotate("+ random_sec +"deg)' data-rotate='"+ random_sec +"' data-index='"+ this.numbers[random] +"' class='rotates'>";
            this.numbers.splice(random, 1);
        }

        // set puzzle in document
        this.setContent(result, resultDes, true);
        this.define_part_events();
    };

    this.setPuzzleSize = function () {
        switch (game.difficulty) {
            case "1":
                this.rows = 2;
                this.cols = 2;
                this.numbers = [0,1,2,3];
                break;
            case "2":
                this.rows = 3;
                this.cols = 3;
                this.numbers = [0,1,2,3,4,5,6,7,8];
                break;
            case "3":
                this.rows = 4;
                this.cols = 4;
                this.numbers = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
                break;
        }
    };

    this.setContent = function (content, des, setInPage) {
        this.content = content;
        this.destinition = des;

        if (setInPage) {
            $("#puzzle").html(content);
            $("#puzzleDestination").html(des);
        }

        localStorage.setItem("puzzleContent", this.content);
        localStorage.setItem("puzzleDestination", this.destinition);
    };

    this.define_part_events = function () {
        var self = this;
        var objects = $("#puzzle").find('img');
        var desObjects = $("#puzzleDestination").find('img');
        objects.unbind();
        desObjects.unbind();

        /*objects.bind('dragstart', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        });

        desObjects.bind('dragstart', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        });*/

        /* draggable for parts */
        objects.draggable({
            start: function () {
                $("#puzzle").find('img').removeClass("black_border");
                self.activeImage = null;
                $(this).css("z-index", 2000);
            },
            end: function () {

            },
            scroll: false,
            revert: function (dropped) {
                $(this).css("z-index", "");

                if (!self.dragPermission)
                    return true;

                return !dropped;
            }
        });

        /* click for activate part */
        objects.bind("click", function () {
            $("#puzzle").find('img').removeClass("black_border");
            $(this).addClass("black_border");

            self.activeImage = this;
        });

        /* press for rotate part */
        $(document).bind("keydown", function (e) {
            $(self.activeImage).addClass("rotates");
            if (self.activeImage === null)
                return true;

            if (self.rotateState)
                return true;

            var code = e.keyCode || e.which;
            var rotate = parseInt($(self.activeImage).attr('data-rotate'));

            if (code == 39) {
                // rotate right
                rotate += 90;
            }
            else if (code == 37) {
                // rotate left
                rotate -= 90;
            }


            $(self.activeImage).css("transform", "rotate("+rotate+"deg)");
            $(self.activeImage).attr("data-rotate", rotate);
            self.savePuzzle();

            self.rotateState = true;
            setTimeout(function () {
                self.rotateState = false;
            }, 50);
        });

        /* drop for solve puzzle */
        desObjects.droppable({
            drop: function (event, ui) {
                if ($(ui.draggable).attr('data-index') == $(this).attr('data-index') &&
                    ($(ui.draggable).attr('data-rotate')%360 == 0)) {
                    self.dragPermission = true;
                    $(ui.draggable).css({'opacity':0,'transform':'rotateX(90deg)'});
                    $(this).removeClass('empty_place');
                    $(this).unbind();
                    $(ui.draggable).unbind();
                    self.savePuzzle();
                }
                else
                    self.dragPermission = false;

                if (!$("#puzzleDestination").find('img').hasClass("empty_place")) {
                    game.finish();
                }
            }
        });
    };

    this.savePuzzle = function () {
        this.setContent($("#puzzle").html(), $("#puzzleDestination").html(), false);
    }
};

function getTimeFormat(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;

    return (m>9 ? m : "0"+m) + ":" + (s>9 ? s : "0"+s);
}