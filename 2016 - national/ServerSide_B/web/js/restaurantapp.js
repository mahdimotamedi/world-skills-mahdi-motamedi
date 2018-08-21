$(document).ready(function() {
    $(".addguest").on('click', function (ev) {
        var td = $(this).parent();
        var count = td.next().find('input').length;
        var day_id = $(this).parent().parent().attr('data-day-id');
        var din_id = $(this).parent().parent().attr('data-din-id');
        td.next().append('<p><input type="text" name="book['+day_id+'-'+din_id+']['+count+'][guest_name]" class="form-control"></p>');

        var countries = $('#countries').clone(true);
        countries.attr('name', 'book['+day_id+'-'+din_id+']['+count+'][country]').show();
        td.next().next().append('<p>'+ countries[0].outerHTML +'</p>');
    });

    $("input.reschedule_radio").on('change', function (ev) {
        if ($(this).prop('checked')) {
            var days = $("#days").clone(true).show();
            var dins = $("#dins").clone(true).show();

            var book_id = $(this).parent().parent().parent().attr('data-id');
            var day = $(this).parent().parent().parent().find('.day_td');
            var din = $(this).parent().parent().parent().find('.din_td');

            days.val(day.attr('data-id')).change();
            dins.val(din.attr('data-id')).change();

            days.attr('name', 'actionBook'+'['+book_id+'][day_id]');
            dins.attr('name', 'actionBook'+'['+book_id+'][dining_id]');

            day.html(days);
            din.html(dins);
        }
    });
});