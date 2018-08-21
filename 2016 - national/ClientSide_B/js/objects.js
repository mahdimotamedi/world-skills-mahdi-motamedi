var game = new function () {
    var self = this;

    this.state = 1;
    /*
     * state 1: game ready to start
     * state 2: game is running
     * state 3: game over
     * state 4: game finished
     * */
    this.moveFrame = 9; // millisecond

    this.element = $("#game");

    this.start = function () {
        self.state = 2;
        $("#start").hide();
        $("#end").hide();
        self.defineKeyboardEvents();
        runner.defineAnimate();
    };

    this.restart = function () {
        runner.positionX = 0;
        runner.setPositionY(road.line2Bottom);
        runner.line = 2;
        runner.placeNumber = 1;
        road.setLeftPost(0);
        self.state = 1;
        road.setObstacles();
        self.start();
    };

    this.gameOver = function () {
        self.state = 3;
        var end = $("#end");
        end.removeClass('hide').hide().show('drop');
        end.find('.success').addClass('hide');
        end.find('.error').removeClass('hide');
        runner.stopAllAnimate();
        road.stopMoveAnimate();
    };

    this.gameWin = function () {
        var end = $("#end");
        self.state = 4;
        end.removeClass('hide').hide().show('drop');
        end.find('.error').addClass('hide');
        end.find('.success').removeClass('hide');
        runner.stopAllAnimate();
        road.stopMoveAnimate();
    };

    this.defineKeyboardEvents = function () {
        $(document).unbind();
        $(document).bind('keydown', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var code = ev.keyCode || ev.which;

            switch (code) {
                case 40:
                    runner.moveDown();
                    break;
                case 38:
                    runner.moveUp();
                    break;
                case 32:
                    runner.jump();
                    break;
            }
        });
    }
};


var runner = new function () {
    var self = this;

    this.line = 2;
    this.positionX = 0;
    this.positionY = 100;
    this.scale = 1;
    this.isJump = false;

    this.animateLevel = 0; // running animation frame number
    this.jumpTime = 1200; // millisecond
    this.element = $("#runner");
    this.runInterval = null;
    this.moveInterval = null;
    this.moveYInterval = null;
    this.placeNumber = 1;
    this.animationFrames = ['imgs/runner/runner_1.png', 'imgs/runner/runner_2.png', 'imgs/runner/runner_3.png' , 'imgs/runner/runner_4.png'];
    this.animationJump = ['imgs/runner/jump.png'];

    this.moveUp = function () {
        if (self.line == 1)
            return false;

        self.element.removeClass("line"+self.line);
        self.line--;
        self.element.addClass("line"+self.line);

        self.setPositionY_auto();
    };

    this.moveDown = function () {
        if (self.line == 3)
            return false;

        self.element.removeClass("line"+self.line);
        self.line++;
        self.element.addClass("line"+self.line);

        self.setPositionY_auto();
    };

    this.jump = function () {
        if (self.isJump)
            return false;

        self.isJump = true;
        self.stopRunAnimate();
        self.element.find("img").attr('src', self.animationJump);

        self.element.animate({bottom: (self.positionY+100)+'px'}, self.jumpTime/2, function () {
            self.setPositionY_auto(self.jumpTime/2);
        });

        setTimeout(function () {
            self.isJump = false;
            self.startRunAnimate();
        }, self.jumpTime);
    };

    this.checkAccident = function () {
        for (var key in road.obstacles) {
            var difference = road.obstacles[key].x - self.positionX;
            if (difference < 45 && difference > 10
                && !self.isJump && road.obstacles[key].line == self.line) {
                game.gameOver();
            }
        }
    };

    this.setPositionY_auto = function (speed) {
        if (speed === undefined)
            speed = 350;

        switch (self.line) {
            case 1:
                self.element.animate({bottom:road.line1Bottom, top:'auto'}, speed);
                self.positionY = road.line1Bottom;
                self.element.css('z-index', 101);
                break;
            case 2:
                self.element.animate({bottom:road.line2Bottom, top:'auto'}, speed);
                self.positionY = road.line2Bottom;
                self.element.css('z-index', 201);
                break;
            case 3:
                self.element.animate({bottom:road.line3Bottom, top:'auto'}, speed);
                self.positionY = road.line3Bottom;
                self.element.css('z-index', 301);
                break;
        }
    };

    this.setPositionY = function (y) {
        self.positionY = y;
        self.element.css({bottom:y+'px', top: 'auto'});
    };

    this.startRunAnimate = function () {
        this.runInterval = setInterval(function () {
            self.animateLevel++;
            if (self.animateLevel >= self.animationFrames.length)
                self.animateLevel = 0;
            self.element.find("img").attr('src', self.animationFrames[self.animateLevel]);
        }, 130);
    };

    this.startMoveAnimate = function () {
        this.moveInterval = setInterval(function () {
            self.positionX++;
            self.element.css('left', self.positionX+'px');

            if (self.positionX == 300)
                road.defineMoveAnimate();

            if (self.positionX == road.endAnimatePoint) {
                road.stopMoveAnimate();
            }

            if (self.positionX == 4775) {
                $(document).unbind();
                self.moveYInterval = setInterval(function () {
                    self.positionY +=  135/295; // frame rate for y
                    self.setPositionY(self.positionY);
                }, game.moveFrame);
            }

            if (self.positionX == 5070) {
                clearInterval(self.moveYInterval);
            }

            if (self.positionX == 5140) {
                self.stopAllAnimate();
                self.element.find('img').attr('img', self.animationFrames[1]);
                $("#pyre").find('img').attr('src', 'imgs/pyre_fire.svg');

                setTimeout(function () {
                    game.gameWin();
                }, 500);
            }

            self.checkAccident();
            road.checkPlace();

        }, game.moveFrame);
    };

    this.defineAnimate = function () {
        this.startRunAnimate();
        this.startMoveAnimate();
    };

    this.stopRunAnimate = function () {
        clearInterval(this.runInterval);
        self.element.find("#jumpIMG").addClass("hide");
    };

    this.stopMoveAnimate = function () {
        clearInterval(this.moveInterval);
    };

    this.stopAllAnimate = function () {
        self.stopRunAnimate();
        self.stopMoveAnimate();
    };
};

var road = new function () {
    var self = this;

    this.element = $("#runways");
    this.leftPos = 0;
    this.endAnimatePoint = game.element.width() - window.innerWidth + 200;
    this.moveInterval = null;
    this.obstaclesStartPoint = 200;
    this.obstaclesBetweenSpace = 250;
    this.obstacles = [];

    this.line1Bottom = 118;
    this.line2Bottom = 96;
    this.line3Bottom = 64;

    this.setObstacles = function () {
        road.obstacles = [];
        var obstaclesNumbers = (5000 - self.obstaclesStartPoint)/ self.obstaclesBetweenSpace;
        var obstacleX = this.obstaclesStartPoint;
        $("#runways").find('div').html("");

        for (var i=1 ; i<=obstaclesNumbers ; i++) {
            var rand = Math.floor(Math.random() * 3) + 1;
            $("#runway"+rand).append("<span class='obstacle' style='left:"+ obstacleX +"px'></span>");
            self.obstacles.push({x:obstacleX,line:rand});
            obstacleX += self.obstaclesBetweenSpace;
        }
    };

    this.checkPlace = function () {
        var place = $("#panels").find('h4.fade').each(function () {

            var difference = Math.floor($(this).offset().left)
                - Math.floor(runner.element.find('img').offset().left);

            if (difference == 80) {

                // show place name with animation
                $(this).removeClass('fade');
                var animates = ['bounce', 'drop', 'puff', 'fold', 'pulsate', 'shake'];
                var rand = Math.floor(Math.random() * animates.length);
                $(this).hide().show(animates[rand]);
            }
        });
    };

    this.setLeftPost = function (left) {
        self.leftPos = left;
        game.element.css('left', left+'px');
    };

    this.defineMoveAnimate = function () {
        self.moveInterval = setInterval(function () {
            self.leftPos--;
            game.element.css('left', self.leftPos+'px');
        }, game.moveFrame);
    };

    this.stopMoveAnimate = function () {
        clearInterval(self.moveInterval);
    }
};