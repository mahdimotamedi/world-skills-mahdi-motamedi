// START APPLICATION SCRIPT
road.setObstacles();
$("#panels").find('.panel').addClass('fade');
runner.element.css('z-index', 201);
// APPLICATION STARTED SUCCESSFULLY

// an event for finding out positions of mouse
document.onmousemove = function(e){
    e.target.title = "X is "+e.pageX+" and Y is "+e.pageY;
};
