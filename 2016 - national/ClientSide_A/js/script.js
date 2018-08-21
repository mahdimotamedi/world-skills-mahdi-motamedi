/* start application */
$(".preview img").attr("src", game.image);
$("#puzzle").html(puzzle.content);
$("#puzzleDestination").html(puzzle.destinition);
puzzle.define_part_events();
$("#name").val(player.name);
$("#playername").text(player.name);
$("#difficult").val(game.difficulty).change();
$("#timer").attr("data-seconds", game.timeSeconds).text(getTimeFormat(game.timeSeconds));
if (game.state == "2") {
    game.timerStart();
    $("#start").hide();
}
else if (game.state == "3") {
    game.pause();
    $("#start").hide();
}
/* application started successfully */


/* some events */
$("#drop").bind("dragover dragleave", function (ev) {
    ev.stopPropagation();
    ev.preventDefault();
});
/* end some events */