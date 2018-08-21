$(".game button").bind('click', function (ev) {
    var btn = $(this), s = btn.attr('id');
    $.ajax({
        url: '?r=pick',
        method: 'GET',
        data: {pick: s},
        success: function (response, textStatus) {
            var resp = JSON.parse(response);
            if (resp.res == 0) {
                alert ('game ended.');
                return;
            }

            btn.addClass('o');
            btn.attr('disabled', 'disabled');
            $(".time").text(resp.time + ' sec');
            $(".usermoves").text(resp.p_score);
            $(".computermoves").text(resp.c_score);
            $('#'+resp.c_pick).addClass('x').attr('disabled', 'disabled');

            if (resp.winner) {
                show_winner(resp.winner);
            }
        }
    });
});

function show_winner(winner) {
    if (winner == 'c') {
        $("#WinOrLose").text('Lose');
        $(".onEndShow").show();
        $('.form').hide();
        $(".onEndHide").hide();
    }
    else {
        $("#WinOrLose").text('Win!!');
        $(".onEndShow").show();
        $(".onEndHide").hide();
    }
}