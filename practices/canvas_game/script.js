
var ball;
var myObstacles = [];
var myScore;

function startGame() {
    // create game start component
    ball = new Component(35, 35, "#d13434", 50, 120, 'circle');
    ball.gravity = 0.05;
    ball.bounce = 0.4;
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");

    // game start
    myGameArea.start();

    document.addEventListener('keydown', function (ev) {
        key = ev.keyCode || ev.which;

        if (key == 32)
            accelerate(-0.2);
    });

    document.addEventListener('keyup', function (ev) {
        key = ev.keyCode || ev.which;

        if (key == 32)
            accelerate(0.05);
    });
}

var myGameArea = {
    canvas : document.getElementById('game_canvas'),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    restart: function () {
        clearInterval(this.interval);
        myObstacles = [];
        this.clear();
        this.start();

        document.querySelector('#accelerate').focus();
    },
    pause: function () {
        if (!this.interval) {
            // this is a request for resume
            this.interval = setInterval(updateGameArea, 20);
            document.getElementById('btnPause').innerText = 'PAUSE';
        }
        else {
            // this is a request for pause
            clearInterval(this.interval);
            this.interval = null;
            document.getElementById('btnPause').innerText = 'RESUME';
        }
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;

    // set coordinate of circle (from center to the top left point)
    if (this.type == 'circle') {
        this.x -= this.width/2;
        this.y -= this.height/2;
    }

    this.update = function() {
        ctx = myGameArea.context;
        switch (this.type) {
            // check type of component for drawing method
            case "text":
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, this.x, this.y);
                break;

            case "circle":
                ctx.beginPath();
                ctx.arc(this.x+this.width/2, this.y+this.height/2,
                    this.width/2, -0.5*Math.PI, 1.5*Math.PI); // -0.5pi ~ 1.5pi
                ctx.fillStyle = this.color;
                ctx.fill();
                break;

            default:
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
        }
    };
    this.newPos = function() {
        // set new position of component according to gravity and speed
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    };
    this.hitBottom = function() {
        // check hit the object to floor and ceil
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            // hit to floor
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce); // bouncing
        }
        else if (this.y < 0) {
            // hit to ceil
            this.y = 0;
            this.gravitySpeed = +(-this.gravitySpeed * this.bounce); // bouncing
        }
    };
    this.crashWith = function(otherobj) {
        // check crash object component ot another
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    // this function execute in every frame of game
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (ball.crashWith(myObstacles[i])) {
            clearInterval(myGameArea.interval);
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        // create a new obstacle
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 55;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new Component(10, height, "#30a82c", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "#30a82c", x, height + gap));
    }
    for (var key in myObstacles) {
        if (myObstacles[key].x + myObstacles[key].width < -160) {
            // delete obstacle if out of view
            myObstacles.splice(key, 1);
            continue;
        }
        myObstacles[key].x += -1;
        myObstacles[key].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    ball.newPos();
    ball.update();
}

function everyinterval(n) {
    // check factor of past frames
    return (myGameArea.frameNo / n) % 1 == 0;
}

function accelerate(n) {
    // accrelation to ball (change the gravity)
    ball.gravity = n;
}