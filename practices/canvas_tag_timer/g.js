function Timer(el) {
    // params
    this.WIDTH = 200;
    this.HEIGHT = 200;
    this.TIMER_BORDER = 3;
    this.TIMER_COLOR1 = "#ececec";
    this.TIMER_COLOR2 = "#3366CC";
    this.TIMER_DURATION = 60000;
    this.TIME_ELAPSED = 0;
    this.DOT_RADIUS = 6;
    this.MAXFPS = 60;
    this.el = el;
    this.el.width = this.WIDTH;
    this.el.height = this.HEIGHT;
    this.ctx = el.getContext('2d');
}

Timer.prototype.timerString = function () {
    var ts = Math.ceil((this.TIMER_DURATION - this.TIME_ELAPSED) / 1000);
    var h = parseInt(ts / 3600) % 24;
    var m = parseInt(ts / 60) % 60;
    var s = ts % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
};

Timer.prototype.clearFrame = function () {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
};

Timer.prototype.drawTimer = function () {
    var self = this;
    var ctx = this.ctx;
    var center = {
        x: this.el.width / 2,
        y: this.el.height / 2
    };
    var r = (this.el.width - this.TIMER_BORDER) / 2 - this.DOT_RADIUS;
    var eAngle = (1.5 - 2.0 * this.TIME_ELAPSED / this.TIMER_DURATION) * Math.PI;
    var dot = {
        x: center.x + r * Math.cos(eAngle),
        y: center.y + r * Math.sin(eAngle)
    };
    dot.r = this.DOT_RADIUS;
    // draw background arc
    ctx.lineWidth = this.TIMER_BORDER;
    ctx.strokeStyle = this.TIMER_COLOR1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, -0.5 * Math.PI, eAngle); // -0.5pi ~ 1.5pi
    ctx.stroke();
    // draw foreground arc
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, -0.5 * Math.PI, eAngle, 1); // counterclockwise
    ctx.strokeStyle = this.TIMER_COLOR2;
    ctx.stroke();
    // draw dot
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.TIMER_COLOR2;
    ctx.fill();
    // draw time string
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.font = "300 32pt Roboto";
    ctx.fillText(self.timerString(), center.x, center.y);
};

Timer.prototype.render = function () {
    this.clearFrame();
    this.drawTimer();
    return Date.now();
};

Timer.prototype.timerRun = function () {
    var self = this;
    if (self.TIME_ELAPSED >= self.TIMER_DURATION) return false;
    if (!self.lastRender) self.lastRender = Date.now();
    var delta = Date.now() - self.lastRender;
    // Trick to throttle FPS
    if (delta > (1000 / self.MAXFPS)) {
        self.TIME_ELAPSED += delta;
        self.lastRender = self.render();
    }
    requestAnimationFrame(self.timerRun.bind(self));
};

var t = new Timer(document.querySelector('canvas'));
t.timerRun();