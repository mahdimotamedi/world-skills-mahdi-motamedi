/*
(c) 7Shifts
Schedule Time Calculations
Written by Jordan Boesch
*/

/* PUBLIC VARS */
Shifts.Timecalc = {
    shift_blocks: {
        total_hours: 0,
        total_labor: 0
    },
    unpublished: false,
    holiday_day_els: {},
    coming_from_page_load: false,
    defaultValue: '0:00-0:00',
    overtime_dialog_id: 'overtime-dialog',
    max_weekly_hours_dialog_id: 'max-weekly-hours-dialog',
};
var defaultValue = Shifts.Timecalc.defaultValue;
var valuesEqZero = [defaultValue,'0','0-0','00','','000-000','-','0000-0000','-0','0-'];
var days = ['mon','tue','wed','thu','fri','sat','sun'];
var create_btn = '#createschedbtn';
var labor_input_class = 'sched-labor-cost';
var hours_input_class = 'sched-row-total';
var notice_labor_id = 'notice-labor';
var notice_hours_id = 'notice-hours';

// If we're on a touch device, dismiss the keyboard if it's present
if(Shifts.Device.isTouch()){
    $(document).bind('keydown.ScheduleEnterInput', function(e){
        if(e.keyCode == 13 && $('#time-overlay').is(':visible')){
            try {
                setTimeout(function(){
                    document.activeElement.blur();
                }, 10);
            } catch(e){};
        }
    });
}

/* SWITCH HIDDEN ELEMENTS */
function hideShow(id, showInput, role_id, el){

	// hide the div.. show the input
	if(showInput){
		
		// make sure when they hit enter it doesnt submit the form
		$(create_btn).bind('click.Timecalc', function(e){
			return false;
		});
		
		var div = $(el);
		var input = $(el).siblings('input.sched_input');
		var divVal = div.text();
		div.css('display','none');
		input.val(divVal);
		input.css('display','block');
		input.focus();

		if(input.val() == defaultValue) input.select();
			
	}
	// hide the input.. show the div
	else {

		$(create_btn).unbind('click.Timecalc');
		
		var td = $(el).parents('td');
		var div_anchor = $(el).siblings('a.sched_anchor');
		var input = $(el);
		var inputVal = input.val();

		var $sel_role = $(el).parents('.sched-box-info').find('.role_select_box');

        // The one it finds should be hidden
        if(td.find('.sched-box-info:visible').length == 0){
		    td.removeClass('selected');
        }
		
		// check if it needs a class on the div...
		if(~$.inArray(inputVal, valuesEqZero)){
			inputVal = defaultValue;
			$sel_role.val(0);
		} else {
		    if($sel_role.val() == 0){
                $sel_role.val(role_id);
		    }
			td.addClass('selected');
		}

		div_anchor.css('display','block');
		div_anchor.text(inputVal);
		input.css('display','none');
		tally(id);
	}
	
	
}

/**
 * Checks if the past time string is a 24 hour format.
 */
function _is24HourValue(value) {
	if(value){
        var hour_min = value.split(':');
        var hour = hour_min[0];
        return ((hour > 12 && hour <= 24) || (hour < 10 && hour >= 0 && hour.length === 2));
    } else {
        return false;
    }
}

function tallyValue(t)
{

    if(~$.inArray(t,valuesEqZero)){
        return 0;
    }

    if(~t.indexOf(' to ')){
        t = t.replace(' to ', '-');
    }

    t = t.replace(/\s+/g, '').replace(/\./g, '');
    // if t is 0:00-0:00.. don't add 24 hours.. make it zero..
    //if(t == defaultValue || t == '-' || t == '0-0' || t == '') isZero = true;
    var times = t.split('-');
    var start = times[0];
    var end = times[1];
	var startIs24Hour = _is24HourValue(start);
	var endIs24Hour = _is24HourValue(end);
    var mindRead = false;
    var jump24HoursIfSame = false;

    //if(t == ''){ $("#"+days[i]+"_"+id+"_div a").text(defaultValue); alert("#"+days[i]+"_"+id+"_div a"); }
    // if they don't have a dash.. error!
    if(t.match(/-/i) == null){
        worked = 0;
        start = '0:00';
        end = '0:00'
    }
    // if both the start and the end time aren't given an am or a pm.. lets read their mind.
    if(start.match(/p/gi) == null && end.match(/a/gi) == null) mindRead = true;
    // if its both am or both pm and the SAME numbers.. thats 24 hours!
    if((start.match(/p/i) != null && end.match(/p/i) != null) || (start.match(/a/i) != null && end.match(/a/i) != null)) jump24HoursIfSame = true;
	// if start / end are 24 hours and the same - jump 24 hours
	if (startIs24Hour && endIs24Hour && (start === end)) {
		jump24HoursIfSame = true;
	}

    start = parseFloat(getTimeInt(start));
    end = parseFloat(getTimeInt(end));

    if(mindRead && start > end){
        // We don't need to +12 if it's 24hr format, detect for that.
        // 20:00-01:00
        if(start <= 12){
            end += 12;
        }
    }

    var worked = end - start;
    if(start == end) worked = 12;
    if(start == end && jump24HoursIfSame) worked += 12;

    worked = worked.toString();
    if(worked.match(/-/i) != null){
        worked = worked.split('-')[1];
        worked = 24 - parseFloat(worked);
    }

    worked = Math.round(worked*100)/100;
    return worked;
}

/* CALCULATE TIME */
function tally(id){

    var regular_hours = [];
    var overtime_hours = [];
	var total_hours = 0.00;

    var $total_hours_el = $("#row_total_"+id);
    var using_close = false; // Saying "5pm - CLOSE" isn't a tally-able shift. So don't tally it.

    if(!window.is_shift_blocks){

        // Each day in the user's row
        var $hw_el = $("#hourly_wage_" + id);
        var hw_val = $hw_el.val();
        if(hw_val == '0.00'){
            hw_val = $hw_el.parents('tr').data('hourly-wage');
        }
        var hw = parseFloat(hw_val, 10) || 0;
        var $tr = $('.row-user-id-' + id);
        var $td_days = $tr.find('td.day');
        var max_weekly_hours = $tr.data('max-weekly-hours');
        var hours_at_this_location = 0;

        $td_days.each(function(){

            if(using_close){
                return false;
            }

            var daily_hours = 0;
            var daily_hours_at_this_location = 0;
            var $td = $(this);
            var d = $td.data('day');
            var hourly_wage = getHourlyWage(d, hw);

            $td.find('.sched_input,.sched-anchor-disabled').each(function(){
                var this_location = false,
                    val_to_tally;
                // .sched-anchor-disabled is hours worked at other locations
                if($(this).hasClass('sched_input')){
                    val_to_tally = this.value;
                    this_location = true;
                } else {
                    val_to_tally = $(this).data('shift-friendly');
                }

                var hours = getHoursWorked(tallyValue(val_to_tally));

                if(_.isNaN(hours)){
                    using_close = true;
                    return false;
                }

                if(this_location){
                    hours_at_this_location += hours;
                    daily_hours_at_this_location += hours;
                }

                daily_hours += hours;
                total_hours += hours;
            });

            var ot = overtimeCalculation($td, hourly_wage, regular_hours, daily_hours_at_this_location, overtime_hours);
            regular_hours = ot.regular_hours;
            overtime_hours = ot.overtime_hours;
            show_overtime_dialog = ot.show_overtime_dialog;
        });

        var $td = $total_hours_el.parent();

        if(window.OvertimeSettings.enabled && window.OvertimeSettings.weekly_hours){
            var calculate_weekly_overtime = (total_hours > window.OvertimeSettings.weekly_hours);
            var method = calculate_weekly_overtime ? 'addClass' : 'removeClass';
            $td[method]('overtime');
            if(calculate_weekly_overtime && !$td.data('shown_overtime_dialog')){
                var show_overtime_dialog = true;
                $td.data('shown_overtime_dialog', true);
            }
        }

        var show_max_weekly_dialog = false;

        if(max_weekly_hours && total_hours > max_weekly_hours){
            show_max_weekly_dialog = true;
            $tr.addClass('max-hours-exceeded');
        } else {
            $tr.removeClass('max-hours-exceeded');
        }

        total_hours = (using_close) ? 0 : total_hours.toFixed(2);
        $total_hours_el.val(hours_at_this_location);
        $('#row_total_text_' + id).text(total_hours);

        var labor_total = (using_close) ? 0 : getLaborTotalForWeek(regular_hours, overtime_hours, hours_at_this_location, hw);
        var $labor_cost_el = $("#labor_cost_" + id);
        labor_total = labor_total.toFixed(2);
        $labor_cost_el.val(labor_total);
        $('#labor_cost_text_' + id).text(Shifts.locale.currency_symbol + labor_total);

        if(!Shifts.Timecalc.coming_from_page_load){
            if(show_overtime_dialog){
                if(show_max_weekly_dialog){
                    showMaxWeeklyHoursDialog(max_weekly_hours, total_hours, function(){
                        showOvertimeDialog();
                    });
                } else {
                    showOvertimeDialog();
                }
            } else if(show_max_weekly_dialog){
                showMaxWeeklyHoursDialog(max_weekly_hours, total_hours);
            }
        }
    }

    // We'll tally these elsewhere on page load. This unfortunately does it a gazillion times.
    if(!Shifts.Timecalc.coming_from_page_load){
        Shifts.Events.trigger('Timecalc:shiftChanged');
//        tallyDayPercentagesAndTotalLaborAndHours();
    }
	
}

function doShiftBlockWeeklyTally(){
    var total_hours = 0.00;
    var user_ids = [];
    var labor_total = 0,
        user_hourly_wages = {};

    $('div.sched-box-info:visible').each(function(){
        var $td = $(this).parents('td');
        var $tr = $td.parent();
        var is_close = $tr.data('close');
        var is_bd = $tr.data('bd');

        if(!is_close && !is_bd){
            var td_day = $td.data('day');
            var hourly_wage = getHourlyWage(td_day, $(this).find('.shift_hourly_wage').val() || 0);
            var $anchor = $(this).find('.sched_anchor');
            var uid = $anchor.data('uid');
            user_hourly_wages[uid] = $anchor.data('user-hourly-wage') || 0;

            var hours = getHoursWorked(tallyValue($td.data('time-frame-friendly')));
            if(!user_ids[uid]){
                user_ids[uid] = {};
            }

            for(var i = 0, l = days.length; i < l; i++){
                if(!user_ids[uid][days[i]]){
                    user_ids[uid][days[i]] = { daily_hours: 0, hourly_wage: hourly_wage, td: $td };
                }

                if(td_day == days[i]){
                    var hrs = (_.isNaN(hours) ? 0 : hours);
                    user_ids[uid][days[i]].daily_hours += hrs;
                    total_hours += hrs;
                }
            }
        }
    });

    _.each(user_ids, function(days, uid){
        var overtime_hours = [];
        var regular_hours = [];
        var user_total_hours = 0;
        var hourly_wage = 0;
        _.each(days, function(data){
            var ot = overtimeCalculation(null, data.hourly_wage, regular_hours, data.daily_hours, overtime_hours);
            regular_hours = ot.regular_hours;
            overtime_hours = ot.overtime_hours;
            user_total_hours += data.daily_hours;
            hourly_wage = data.hourly_wage;
        });
        labor_total += getLaborTotalForWeek(regular_hours, overtime_hours, user_total_hours, hourly_wage);
    });

    Shifts.Timecalc.shift_blocks.total_hours = total_hours;
    Shifts.Timecalc.shift_blocks.total_labor = labor_total;
}

function overtimeCalculation($td, hourly_wage, reg_hours, daily_hours, ot_hours){
    var show_overtime_dialog = false;

    var regular_hours = reg_hours;
    var overtime_hours = ot_hours;

    if(window.OvertimeSettings.enabled && window.OvertimeSettings.daily_hours){
        var calculate_daily_overtime = (daily_hours > window.OvertimeSettings.daily_hours);
        var method = calculate_daily_overtime ? 'addClass' : 'removeClass';

        if(calculate_daily_overtime){
            var ot_hours = daily_hours - window.OvertimeSettings.daily_hours;
            var reg_hours = daily_hours - ot_hours;
            overtime_hours.push({
                hourly_wage: window.OvertimeSettings.daily_times * hourly_wage,
                hours: ot_hours
            });
            regular_hours.push({
                hourly_wage: hourly_wage,
                hours: reg_hours
            });
        } else {
            if(daily_hours){
                regular_hours.push({
                    hourly_wage: hourly_wage,
                    hours: daily_hours
                });
            }
        }

        if(calculate_daily_overtime && $td && !$td.data('shown_overtime_dialog')){
            show_overtime_dialog = true;
            $td && $td.data('shown_overtime_dialog', true);
        }
        $td && $td[method]('overtime');
    } else {
        if(daily_hours){
            regular_hours.push({
                hourly_wage: hourly_wage,
                hours: daily_hours
            });
        }
    }

    return {
        regular_hours: regular_hours,
        overtime_hours: overtime_hours,
        show_overtime_dialog: show_overtime_dialog
    }
}

function showMaxWeeklyHoursDialog(max_weekly_hours, total_hours, callback_on_close){

    var buttons = {};
    buttons[Shifts.Lang.get('default.ok')] = function(){
        $(this).dialog('close');
    };

    return new Shifts.ui.Dialog({
        el: $('<div id="' + Shifts.Timecalc.max_weekly_hours_dialog_id + '" />').html(Shifts.Lang.get('schedules.hours_scheduled') + '<br/><br/><h3 class="total-hours">' + total_hours + '</h3><br/>' + Shifts.Lang.get('schedules.maximum_weekly_hours_set') + '<br/><br/><h3>' + max_weekly_hours + '</h3>'),
        enter_key_close_btn: Shifts.Lang.get('default.ok'),
        plugin: {
            title: Shifts.Lang.get('schedules.max_weekly_hours_exceeded'),
            close: function(){
                $('#' + Shifts.Timecalc.max_weekly_hours_dialog_id).remove();
                callback_on_close && callback_on_close();
            },
            buttons: buttons
        }
    });

}

// http://www.gov.mb.ca/labour/standards/doc,overtime,factsheet.html
// Writing all of this made me want to kill myself.
function getLaborTotalForWeek(regular_hours, overtime_hours, total_hours, hourly_wage){

    var regular_labor_total = 0;
    var overtime_labor_total = 0;
    var overtime_daily_hours = 0;
    var labor_total = 0;

    _.each(regular_hours, function(o){
        regular_labor_total += o.hourly_wage * o.hours;
    });

    _.each(overtime_hours, function(o){
        overtime_labor_total += o.hourly_wage * o.hours;
        overtime_daily_hours += o.hours;
    });

    if(window.OvertimeSettings.enabled && window.OvertimeSettings.weekly_hours && total_hours > window.OvertimeSettings.weekly_hours){
        var total_extra_hours = total_hours - window.OvertimeSettings.weekly_hours;

        if(overtime_daily_hours > total_extra_hours){
            labor_total = regular_labor_total + overtime_labor_total;
        } else {
            var total_extra_labor = total_extra_hours * (hourly_wage * window.OvertimeSettings.weekly_times);
            labor_total = regular_labor_total - (total_extra_hours * hourly_wage) + total_extra_labor;
        }
    } else {
        labor_total = regular_labor_total + overtime_labor_total;
    }

    return labor_total;
}

function showOvertimeDialog(){
    var buttons = {};
    buttons[Shifts.Lang.get('default.ok')] = function(){
        $(this).dialog('close');
    };

    return new Shifts.ui.Dialog({
        el: $('<div id="' + Shifts.Timecalc.overtime_dialog_id + '" />').text(Shifts.Lang.get('schedules.overtime_detected')),
        enter_key_close_btn: Shifts.Lang.get('default.ok'),
        plugin: {
            title: Shifts.Lang.get('schedules.overtime'),
            close: function(){
                $('#' + Shifts.Timecalc.overtime_dialog_id).remove();
            },
            buttons: buttons
        }
    });
}

// Calculates holiday time properly.
function getHourlyWage(day, hourly_wage)
{

    var $holiday_col = getHolidayDayEl(day);
    if($holiday_col.length)
    {
        // Could be time x 1.5 (time and a half).
        hourly_wage = (hourly_wage * parseFloat($holiday_col.data('hourly-wage-times')));
    }

    return hourly_wage || 0.00;

}

function getHolidayDayEl(day){
    if(!Shifts.Timecalc.holiday_day_els[day]){
        Shifts.Timecalc.holiday_day_els[day] = $('td.holiday.' + day);
    }

    return Shifts.Timecalc.holiday_day_els[day];
}

function getHoursWorked(result)
{
    var new_result = result;
    var len = window.AutoBreakSettings.slots.length;

    // Do a check to see if they've enabled "auto-break".
    // Adjust the result accordingly
    if(window.AutoBreakSettings.enabled)
    {
        // The 'slots' should be ordered asc numerically (schedules.ctp)
        for(var i = 0; i < len; i++)
        {
            var hrs = parseFloat(window.AutoBreakSettings.slots[i].hours);
            if(result && hrs && (result >= hrs))
            {
                new_result = result - ((window.AutoBreakSettings.slots[i].minutes / 60).toFixed(2));
            }
        }
    }

    return new_result;

}

Shifts.Events.on('BudgetTool:statusRendered', function(){

    if(!window.is_shift_blocks){
        var labor = 0;
        $('.' + labor_input_class).each(function(){
            var num = parseFloat($(this).val());
            labor += (isNaN(num)) ? 0 : num;
        });
    }

    var total_labor = window.is_shift_blocks ? Shifts.Timecalc.shift_blocks.total_labor.toFixed(2) : labor.toFixed(2);
	$('#' + notice_labor_id).text(Shifts.locale.currency_symbol + total_labor);

    if(!window.is_shift_blocks){
        var hours = 0;
        $('.' + hours_input_class).each(function(){
            var num = parseFloat($(this).val());
            hours += (isNaN(num)) ? 0 : num;
        });
    }

    var total_hours = window.is_shift_blocks ? Shifts.Timecalc.shift_blocks.total_hours.toFixed(2) : hours.toFixed(2);
    $('#' + notice_hours_id).text(total_hours);

    $('#notice-labor-costs-loader').hide();
    $('#notice-labor-costs-tallies').show();

});

function getTimeInt(time){
   
	// if the string contains am or pm
	if(hasAmPm(time)){
		am_pm = hasAmPm(time);
		times = time.split(am_pm);
		time = times[0] // returns 5 from 5pm
		// if time contains a color, like 5:00;
		if(hasColon(time)){
			time = convert(time,am_pm,true);
		}
		// if it doesn't have a colon.. it's length will be 1 to 4 in length..
		else if(time.length >= 1 && time.length <= 4){
			time = lengthOneOrFour(time,time.length);
			time = convert(time,am_pm,true);
		}
		
		else {
			time = 0;
		}
		return time;
	}
	else if(hasColon(time)) {
		time = convert(time,false,true);
		return time;
	}
	else if(time.length >= 1 && time.length <= 4){
		time = lengthOneOrFour(time,time.length);
		time = convert(time,false,true);
		return time;
	}
	else {
		time = 0;
		return time;
	}
   
}

function lengthOneOrFour(time,length){
	if(length == 1){
		time = time+":00";
	}
	if(length == 2){
		time = time+":00";
	}
	else if(length == 3){
		var hour = time.charAt(0);
		var minuteFirst = time.charAt(1);
		var minuteLast = time.charAt(2);
		time = hour+":"+minuteFirst+minuteLast;
	}
	else {
		var hourFirst = time.charAt(0);
		var hourLast = time.charAt(1)
		var minuteFirst = time.charAt(2);
		var minuteLast = time.charAt(3);
		time = hourFirst+hourLast+":"+minuteFirst+minuteLast;
	}
   
	return time;
}

function convert(time,am_pm,hasColon){
	if(hasColon == true){
		var hours_min = time.split(':');
		var hours = hours_min[0];
		var minutes = hours_min[1];
		minutes = minutes/60;
		hours = parseFloat(hours);

		if(am_pm != false && hours == 12 && am_pm.match(/a/i) != null) hours = 0;
		if(am_pm != false && hours == 12 && am_pm.match(/p/i) != null){
			 hours = 12;
		}
		else if(am_pm != false && hours != 12 && am_pm.match(/p/i) != null){
			hours = parseFloat(hours) + 12;

		}
		var final = hours + parseFloat(minutes);
	}
	return Math.round(final*100)/100; // 2 decimal place
}

function hasColon(time){
	if(time.match(/:/i) != null){
		return true;
	}
	else {
		return false;
	}
}

function hasAmPm(time){
	if(time.match(/a/i) != null){
		return time.match(/a/i).toString();
	}
	else if(time.match(/p/i) != null){
		return time.match(/p/i).toString();
	} else {
		return false;
	}
}

$(function(){


    // When people do a shift pool swap, it doesn't tally up the hours/labor cost on the php-end,
    // so let's do a quick re-tally on the front-end before they save it.
    // Only do one per row, not necessary to do 7 per row, hence name="sun[]"
    if(window.is_shift_blocks){
        Shifts.Events.trigger('Timecalc:finishedRowTally');
    } else {
        var last = 10;
        var $schedule_tr = $('#schedule-table tr:not(.main-sched-heading,.projection-tr)');
        var total_trs = $schedule_tr.length;
        $schedule_tr.each(function(i){
            var ctx = $(this).find('.sched_input').eq(0);
            if(ctx.length && ctx[0]){
                // Saying we're coming from page load
                var page_load = true;
                setTimeout((function(index){
                    return function(){
                        window.schedInputBlurHandler.call(ctx[0], page_load);
                        if((index + 1) == total_trs){
                            Shifts.Events.trigger('Timecalc:finishedRowTally');
                            //tallyDayPercentagesAndTotalLaborAndHours();
                        }
                    }
                })(i), 1000 + last);
            }
            last += 10;
        });
    }

    $('#toggle-weekly-budget').click(function(){
        var $projection_tr = $('.projection-tr');
        var text = ($projection_tr.is(':visible')) ? 'Show' : 'Hide';
        $projection_tr.toggleClass('hide');
        $(this).find('span').text(text);
        return false;
    });

});



Shifts.Schedule = {
    SHIFTPOOL_OFFER_TYPE_ALL: 0,
    SHIFTPOOL_OFFER_TYPE_ROLE: 1,
    SHIFTPOOL_OFFER_TYPE_SPECIFIC_PEOPLE: 2,

    removeShift: function($sched_box, show_deleting){

        var self = this;
        var $td = $sched_box.parents('td');

        // Make sure we always have one. OR you'll save an get errors because it cannot find key 'wed' or whatever.
        var method = ($td.find('.sched-box-info').length == 1) ? 'hide' : 'remove';

        self.resetShift($sched_box, show_deleting);
        $sched_box[method]();
        self.checkForClassOnTd($td);

    },

    checkForClassOnTd: function($td){
        if(!$td.find('.sched-box-info:visible').length){
            $td.removeClass('selected');
        }
    },
    
    resetShift: function($sched_box, show_deleting){

        var shift_id = $sched_box.data('shift-id');
        $sched_box.find('a.sched_anchor').text(Shifts.Timecalc.defaultValue).data('uid', '');
        // The blur causes the row_total to recalculate, which is what we want.
        $sched_box.find('input.sched_input').val(Shifts.Timecalc.defaultValue).blur();
        $sched_box.find('.shift_notes').val('');

        if(show_deleting !== false){
            $('#notice-deleting-shift').show();
        } else {
            $sched_box.attr('style', '');
        }

        Shifts.Schedule.Model.deleteShift(shift_id, function(){
            Shifts.Events.trigger('Shifts.Schedule.deletedShift');
            Shifts.Events.trigger('Schedules.tally', $sched_box.parents('td').data('day'));
            Shifts.Events.trigger('AvailabilityConflictChecker.update');
            if(show_deleting !== false){
                $('#notice-deleting-shift').hide();
            }
        });

    }
};
Shifts.Schedule.Model = {

    /**
     * Copy a schedule from one week to another. BAM.
     *
     * @param group_id {Int} The location id
     * @param from_week {String} What week are we copying from
     * @param from_week_sched_type_id {String} The week's schedule type id we're copying from
     * @param to_week {String} What week we're copying to
     * @param notify {Number} Notify the employees
     * @param copy_following_weeks {Number} The number of weeks to copy to after
     * @param cb {Function} The callback function when it's done copying
     */
    copy: function(group_id, from_week, from_week_sched_type_id, to_week, copy_following_weeks, cb){

        var data = {
            group_id: group_id,
            from_week: from_week,
            from_week_sched_type_id: from_week_sched_type_id,
            to_week: to_week,
            copy_following_weeks: copy_following_weeks
        };

        Shifts.Ajax('schedules/copy', {
            data: data,
            success: cb,
            error: cb,
            type: 'post'
        });

    },

    deleteShift: function(shift_id, cb){
        Shifts.Ajax('shifts/delete', {
            type: 'post',
            data: { shift_id: shift_id },
            complete: function(){
                if(cb){
                    cb.apply(this, arguments);
                }
            }
        });
    },

    editShift: function(data, cb){
        this._saveShift('edit', data, cb);
    },

    addShift: function(data, cb){
        this._saveShift('add', data, cb);
    },

    _saveShift: function(type, data, cb){

        Shifts.Ajax('./ajax/add', {
            type: 'post',
			url: './ajax/add.php',
            data: data,
			dataType: 'json',
            success: function(res){
                
				cb(data, cb, res);
				
            },
            error: function(res){
                Shifts.ui.error('خطایی در ذخیره سازی اطلاعات رخ داده است.');
                if(cb){
                    cb.apply(this, arguments);
                }
            }
        });

    }

};

Shifts.Schedule.View = Backbone.View.extend({

    _allowed_drop: true,
    _allow_add: true,

    defaults: {
        time_format: 'ampm',
        is_shift_blocks: false
    },

    _editing_user_id: null,

    shift_block_templates: {
        available_li: '<li {{#if selected}}class="selected"{{/if}}><a href="#" data-max-weekly-hours="{{ max_weekly_hours }}" data-hourly-wage="{{ hourly_wage }}" data-uid="{{ id }}" class="glyphicon glyphicon-{{#if selected}}check{{else}}unchecked{{/if}}"></a><a href="#" class="avail-name">{{ name }}</a>  <span class="avail-hrs-worked" data-hrs-worked=""><i></i> <em>hrs</em></span><div class="clear"></div></li>',
        not_available_li: '<li {{#if selected}}class="selected"{{/if}}><a href="#" data-max-weekly-hours="{{ max_weekly_hours }}" data-hourly-wage="{{ hourly_wage }}" data-uid="{{ id }}" class="glyphicon glyphicon-{{#if selected}}check{{else}}unchecked{{/if}}"></a><a href="#" class="avail-name">{{ name }}</a>  <span class="avail-hrs-worked" data-hrs-worked=""><i></i> <em>hrs</em></span><div class="clear"></div></li>'
    },

    initialize: function(opts){

        var self = this;
        var els = {
            copy: '.copy',
            schedule_table: '#schedule-table',
            copy_dialog: '#copy-dialog',
            datepicker_modal_input: '#datepicker-modal-input',
            copy_sched_form: '#copy-sched-form',
            from_week: '#from-week',
            from_week_sched_type_id: "#from-week-sched-type-id",
            dialog_notice_wrap: '#dialog-notice',
            dialog_notice_msg: '#dialog-notice .msg',
            create_btn: '#copy-sched-form .submit',
            add_shift: '.add-shift',
            copy_following_weeks: '#copy-following-weeks',
            group_id: 'input[name="group_id"]'
        };

        self._copying_shift = false;
        self.is_dragging = false;
        self.$dragged_from = false;
        self.els = els;
        self.model = Shifts.Schedule.Model;
        self.dialog = null;
        self._draggable_bound_els = [];
        self._droppable_days_els = false;
        self.lifted_shift_key_while_dragging = false;

        this.options = $.extend({}, this.defaults, opts);

        self._bindEvents();
        self.externalEvents();
    },

    externalEvents: function(){
        var self = this;
        Shifts.Events.on('Shifts.Schedule.deletedShift', function(){
            self.showUnpublishedNotice();
        });
    },

    showTrashBar: function(){
        $('#shift-trash').fadeIn('fast');
    },

    hideTrashBar: function(){
        $('#shift-trash').fadeOut('fast');
    },

    /*
     * Gets called several times throughout the drag/drop process to
     * rebind things with different options
     */
    _bindDragDropToEl: function($el, do_not_push){

        var self = this;
        self.is_dragging = false;
        var opts = {
            revert: 'invalid',
            start: function(e, ui)
            {
                self.is_dragging = true;
                var $el = (self._copying_shift) ? ui.helper : $(this);
                $el.addClass('dragging-shift');
                if(!self._copying_shift){
                    self.showTrashBar();
                }
                self.$dragged_from = $(this).parents('td');
            },
            stop: function(e, ui){
                self.is_dragging = false;
                var $el = (self._copying_shift) ? ui.helper : $(this);
                $el.removeClass('dragging-shift');
                self.hideTrashBar();
                self._copying_shift = false;
            }
        };

        opts.helper = (self._copying_shift) ? 'clone' : null;

        $el.draggable(opts);

        if(!do_not_push){
            self._draggable_bound_els.push($el);
        }

    },

    _reBindDragDropToEls: function(){
        var self = this;

        _.each(self._draggable_bound_els, function($el){
            self._bindDragDropToEl($el, true);
        });
    },

    isElementInViewport: function(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document. documentElement.clientWidth)
        );
    },

    _loadViewableDroppables: function(){

        var self = this;

        if(self._droppable_days_els === false){
            self._droppable_days_els = $(self.els.schedule_table).find('td.day');
        }

        var time = 100;

        self._droppable_days_els.each(function(i){
            var $el = $(this);
            if(self.isElementInViewport($el[0])){
                setTimeout(function(){
                    self._bindDragDropCopy($el);
                }, time + 5);
                time += 5;
            } else {
                try { $el.droppable('destroy'); } catch(e){}
            }
        });
    },

    /**
     * Bind the drag drop and copy for scheduled shifts
     */
    _bindDragDropCopy: function($el)
    {

        var self = this;

        $el.droppable({
            accept: function(el){
                // don't allow it to drop on the one we dragged from originally
                var check = !$(this).find(el).length && !el.hasClass('ui-dialog');
                if(self.options.is_shift_blocks){
                    var uid = el.find('.sched_anchor').data('uid');
                    var sbcheck = $(this).find('.sched_anchor,.sched-anchor-disabled').filter(function(){
                        return $(this).data('uid') == uid && uid != 'open-shift';
                    }).length == 0;

                    return check && sbcheck;
                } else {
                    return check;
                }
            },
            hoverClass: "droppable-shift-hover",
            drop: function(event, ui){

                if(Shifts.Device.isTouch()){
                    self._allow_add = false;
                }

                // Trash bar at the bottom
                if($(this).attr('id') == 'shift-trash'){
                    self._allowed_drop = false;
                    setTimeout(function(){
                        Shifts.Schedule.removeShift(ui.draggable, false);
                        setTimeout(function(){
                            self._allowed_drop = true;
                        }, 1000);
                    }, 10);
                    return false;
                }

                if(!self._allowed_drop){
                    return false;
                }

                var $td = $(this).find('.add-shift').parents('td');

                ui.draggable.attr('style', '');
                var $anchor = ui.draggable.find('a.sched_anchor'),
                    select_val = '',
                    orig_role_text = '',
                    time_input_start_val = '',
                    time_input_end_val = '',
                    start_friendly = '',
                    end_friendly = '',
                    close,
                    bd;

                if(self.options.is_shift_blocks){
                    var sb_data = self.getShiftBlockDataFromCell($td);
                    select_val = sb_data.role_id;
                    orig_role_text = sb_data.role_name;
                    time_input_start_val = sb_data.start;
                    time_input_end_val = sb_data.end;
                    start_friendly = sb_data.start_friendly;
                    end_friendly = sb_data.end_friendly;
                    close = sb_data.close;
                    bd = sb_data.bd;
                } else {
                    var $role_options = ui.draggable.find('.role_select_options');
                    select_val = ui.draggable.find('.role_input').val();
                    orig_role_text = $role_options.find('option[value="' + select_val + '"]').text();
                    time_input_start_val = $anchor.data('start');
                    time_input_end_val = $anchor.data('end');
                    close = ui.draggable.find('.shift_close').val();
                    bd = ui.draggable.find('.shift_bd').val();
                    start_friendly = $anchor.data('start-friendly');
                    end_friendly = $anchor.data('end-friendly');
                }

                var role_text = self.getRoleText(orig_role_text);
                var notes_val = $.trim(ui.draggable.find('.shift_notes').val());
                var open_shift,
                    is_dropping_onto_open_shift,
                    user_id,
                    user_fullname,
                    open_shift_offer_type,
                    hourly_wage = null;

                if(self.options.is_shift_blocks){
                    is_dropping_onto_open_shift = $anchor.data('uid') == 'open-shift';
                    open_shift = is_dropping_onto_open_shift;
                    user_id = (open_shift) ? 'open-shift' : $anchor.data('uid');
                    user_fullname = $anchor.data('name');
                    hourly_wage = ui.draggable.find('.shift_hourly_wage').val();
                } else {
                    is_dropping_onto_open_shift = $td.find('.open-shift').length;
                    open_shift = (is_dropping_onto_open_shift) ? ui.draggable.find('.shift_open').val() : 0;
                }

                if(is_dropping_onto_open_shift){
                    if(select_val && orig_role_text){
                        open_shift_offer_type = Shifts.Schedule.SHIFTPOOL_OFFER_TYPE_ROLE;
                    } else {
                        open_shift_offer_type = Shifts.Schedule.SHIFTPOOL_OFFER_TYPE_ALL;
                    }
                } else {
                    open_shift_offer_type = 0;
                }

                // We have a clone laying around, we want to get rid of it.
                // so the schedule tally doesnt double.
                if(self._copying_shift){
                    ui.helper.remove();
                }

                if(user_id != 'open-shift' && self.options.is_shift_blocks && !self.userIsAvailable($td, user_id)){
                    var copying_shift = self._copying_shift;
                    Shifts.ui.confirm(Shifts.Lang.get('schedules.employee_not_avail_work_continue'), function(){
                        self._copying_shift = copying_shift;
                        continueWithInsert();
                        self._copying_shift = false;
                    });
                } else {
                    continueWithInsert();
                }

                function continueWithInsert(){
                    self.insertShift(time_input_start_val, time_input_end_val, start_friendly, end_friendly, select_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, $td, user_id, user_fullname, hourly_wage);

                    if(self._copying_shift){
                        ui.helper.remove();
                    }
                    else{
                        setTimeout(function(){
                            Shifts.Schedule.removeShift(ui.draggable, false);
                        }, 10);
                    }

                    if(self.lifted_shift_key_while_dragging){
                        self._copying_shift = false;
                    }
                    self.lifted_shift_key_while_dragging = false;

                    setTimeout(function(){

                        if(self.$dragged_from && self.$dragged_from.length){
                            Shifts.Events.trigger('Schedules.tally', self.$dragged_from.data('day'));
                            var $sched_box_info_from = self.$dragged_from.find('.sched-box-info');
                            if($sched_box_info_from.length == 1 && $sched_box_info_from.filter(':hidden').length == 1){
                                self.$dragged_from.removeClass('selected');
                            }
                            self.$dragged_from = null;
                        }
                        self._reBindDragDropToEls();
                    }, 30);
                }

            }
        });

    },

    userIsAvailable: function($td, user_id){
        var users = $td.data('users');
        return users.available[user_id] && users.available[user_id].length;
    },

    getShiftBlockDataFromCell: function($td){

        var $tr = $td.parent();
        var $first_td_cell = $tr.find('td').eq(0);

        var $start = $first_td_cell.find('.time-frame-start');
        var $end = $first_td_cell.find('.time-frame-end');

        return {
            role_id: $tr.data('role-id') || '',
            role_name: $tr.data('role-name') || '',
            start: $start.data('timeAutocomplete').getTime(),
            end: $end.data('timeAutocomplete').getTime(),
            start_friendly: $start.val(),
            end_friendly: $end.val(),
            close: ($tr.data('close') == 1 ? 1 : 0),
            bd: ($tr.data('bd') == 1 ? 1 : 0),
            shift_friendly: $.trim($tr.find('.sb-time').text())
        };

    },

    /**
     * Bind the datepicker via the view, since we need to pass some
     * php variables to it
     *
     * @param opts {Object} A list of options passed via PHP in the view
     */
    bindDatePickerModal: function(opts){

        var self = this;
        var day_key = opts.day_key;
        var week = opts.week;

        $(self.els.datepicker_modal_input).datepicker({
            beforeShowDay: function(date){
                return [date.getDay() == day_key && moment(date).format('YYYY-MM-DD') != week];
            },
            showOn: "both",
            buttonImageOnly: true
        });

    },

    /**
     * Hook up any events
     */
    _bindEvents: function(){

        var self = this;

        if(self.options.is_shift_blocks){
            var $list = $('.shift-availability-list');

            $list.on('click', '.avail-name, .glyphicon', function(){
                var shift_length = getHoursWorked($list.data('shift-length')); // Could have auto-break so the length could be different
                var $li = $(this).parent();
                if($li.hasClass('disabled')){
                    return false;
                }
                var $other_lis = $list.find('li');
                self.removeCalculateHours($other_lis, shift_length);
                $other_lis.removeClass('selected').find('a.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
                $li.addClass('selected').find('a.glyphicon').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
                self.addCalculateHours($li, shift_length);
                return false;
            });
        } else {
            var $time_bar_time_frames = $('.time-bar-time-frames');
            var $time_bar_custom_inputs = $('.time-bar-custom-inputs');
            $time_bar_time_frames.find('select').bind('change', function(){
                var $opt = $(this).find('option:selected');
                var start = $opt.data('start');
                var end = $opt.data('end');
                var $end_el = $('.time-input.end');
                $end_el.data('close', $opt.data('close')).data('bd', $opt.data('bd'));
                self.setTime($('.time-input.start'), start);
                self.setTime($end_el, end);
            });

            $('.shift-use-time-frame').on('click', function(){
                $time_bar_time_frames.show().find('select:visible').trigger('change');
                $time_bar_custom_inputs.hide();
                return false;
            });

            $('.shift-use-custom-time').on('click', function(){
                $time_bar_time_frames.hide();
                $time_bar_custom_inputs.show();
                return false;
            });
        }


        $(self.els.copy).bind('click', function(){
            self.resetDialogNotice();
            self._showCopyDialog();
            return false;
        });

        this._bindDragDropCopy($('#shift-trash'));
        $(window).bind('scroll.dropdebounce', _.debounce(function(){
            self._loadViewableDroppables();
        }, 200)).trigger('scroll.dropdebounce');

        this._hookupStickyUnpublishedShiftsNotice();


        if(Shifts.Device.isTouch()){
            $(self.els.schedule_table).find('.sched-box-info').bind('taphold', { duration: 250 }, function(e){
                e.preventDefault();
                self._bindDragDropToEl($(this));
                $.ui.mouse.prototype._touchStart.call($.ui.mouse.prototype, e);
                return false;
            });
        } else {
            $(self.els.schedule_table).on('mouseenter', '.sched-box-info', function(){
                self._bindDragDropToEl($(this));
            });
        }

        $(document).bind('keyup.ScheduleCopy keydown.ScheduleCopy', function(e){
            var shift = (e.keyCode == 16);
            if(e.type == 'keyup' && shift){
                if(self.is_dragging){
                    self.lifted_shift_key_while_dragging = true;
                }
                else {
                    self._copying_shift = false;
                    self._reBindDragDropToEls();
                }
            }
            else if(e.type == 'keydown' && shift){
                if(!self.is_dragging){
                    self._copying_shift = true;
                    self._reBindDragDropToEls();
                }
            }
        });

        // Adding a shift
        $(self.els.schedule_table).on('click', self.els.add_shift, function(e){

            if(Shifts.Device.isTouch() && !self._allow_add){
                return false;
            }

            $(document).trigger('click');
            var $btn = $(this);
            var $td = $btn.parents('td');
            var $sched_box_info = $td.find('.sched-box-info');

            var $sched_box_hidden = $sched_box_info.filter(':hidden');
            // If we have a hidden one, show the first hidden one.
            var $sched_box = ($sched_box_hidden.length) ? $sched_box_hidden.first() : $sched_box_info.eq(0);
            var user_role_html = $sched_box.find('.user_role').html();

            self.showTimeOverlay($btn, {
                type: 'add',
                role: user_role_html,
                notes: '',
                name: (self.options.is_shift_blocks ? Shifts.Lang.get('schedules.shift') : $.trim($td.parents('tr').find('.name').text()))
            }, function(time_input_start_val, time_input_end_val, start_val_friendly, end_val_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, user_id, user_name, hourly_wage){
                self.insertShift(time_input_start_val, time_input_end_val, start_val_friendly, end_val_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, $td, user_id, user_name, hourly_wage);
            });

            return false;

        });

        $(self.els.copy_sched_form).bind('submit', function(){

            self.resetDialogNotice();

            $(self.els.create_btn).attr('disabled', 'disabled');

            var from_week = $.trim($(self.els.from_week)[0].value);
            var sched_type_id = $.trim($(self.els.from_week_sched_type_id)[0].value);
            var to_week = $.trim($(self.els.datepicker_modal_input)[0].value);
            var copy_following_weeks = $(self.els.copy_following_weeks)[0].value;
            var group_id = $(self.els.group_id)[0].value;

            if(to_week == ''){
                self._setDialogNotice('error', Shifts.Lang.get('schedules.week_copying_cannot_be_blank'));
                $(self.els.create_btn).removeAttr('disabled');
                return false;
            }

            self.model.copy(group_id, from_week, sched_type_id, to_week, copy_following_weeks, $.proxy(self, "_copyScheduleResponse"));

            return false;

        });

    },


    showProperTimeFrameDropdowns: function(role_id){
        $('.time-frame-role-group').hide();
        $('#time-frame-role-id-' + role_id).show();
        $('.time-bar-time-frames select:visible').trigger('change');
    },

    removeCalculateHours: function($lis, shift_length){
        var $li = $lis.filter('.selected');
        var $avail_hrs_worked = $li.find('.avail-hrs-worked');
        var orig_hrs_worked = $avail_hrs_worked.data('hrs-worked') || 0;

        if(this._editing_user_id && $li.find('.glyphicon[data-uid="' + this._editing_user_id + '"]').length){
            orig_hrs_worked = this.convert2Decimal(orig_hrs_worked - shift_length);
            $avail_hrs_worked.data('hrs-worked-adjusted', orig_hrs_worked);
        }

        this.tallyHoursWarning($li, orig_hrs_worked);
        $avail_hrs_worked.find('i').text(orig_hrs_worked);
    },

    addCalculateHours: function($li, shift_length){
        var $avail_hrs_worked = $li.find('.avail-hrs-worked');
        var orig_hrs_worked = $avail_hrs_worked.data('hrs-worked') || 0;
        var adjusted = $avail_hrs_worked.data('hrs-worked-adjusted');
        var new_hours = 0;
        if(typeof(adjusted) != 'undefined'){
            new_hours = orig_hrs_worked;
        } else {
            new_hours = this.convert2Decimal(this.convert2Decimal(orig_hrs_worked) + shift_length);
        }

        this.tallyHoursWarning($li, new_hours);
        $avail_hrs_worked.find('i').text(new_hours);
    },

    convert2Decimal: function(hours){
        if(~("" + hours + "").indexOf('.')){
            var decimals = ("" + hours + "").split('.')[1];
            if(decimals.length > 2){
                hours = parseFloat(hours).toFixed(2);
            } else {
                hours = parseFloat(hours);
            }
        } else {
            hours = parseInt(hours, 10);
        }

        return hours;
    },

    /*
     * Maybe show the unpublished notice that's fixed
     */
    _hookupStickyUnpublishedShiftsNotice: function(){

        $(window).bind("scroll.unpublished", function(){
            if(Shifts.Timecalc.unpublished){
                var top = $(this).scrollTop();
                var method = (top >= 402) ? 'show' : 'hide';
                $('#unpublished-shifts-to-fix')[method]();
            }
        });

    },

    _closeTimeOverlayBox: function(){
        $('#time-overlay').hide().find('.shift-save').unbind(Shifts.Device.getClickEvent());
        if(this.options.is_shift_blocks){
            $('#time-overlay').find('.shift-availability-list li').removeClass('selected')
        }
    },

    insertShift: function(time_input_start_val, time_input_end_val, start_friendly, end_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, $td, user_id, user_fullname, hourly_wage){

        var self = this;
        var $sched_box_info = $td.find('.sched-box-info');
        var $sched_box_hidden = $sched_box_info.filter(':hidden');
        // If we have a hidden one, show the first hidden one.
        var $sched_box = ($sched_box_hidden.length) ? $sched_box_hidden.first() : $sched_box_info.eq(0);
        var is_open_shift = !!$sched_box.find('a.open-shift').length;
        var $tr = $td.parents('tr');
		
		console.log($tr);
		
        user_id = $tr.attr('data-group');
		
		
		var tindex = $td.index();
        var date = $('.main-sched-heading th').eq(tindex).attr('data-date');
        var friendly_text = user_fullname || this.generateTimeFriendly(start_friendly, end_friendly, close, bd);

        if($sched_box.is(':hidden'))
        {
            $sched_box.show();
            $sched_box.find('a.sched_anchor').text(friendly_text)
                .data('start', time_input_start_val)
                .data('end', time_input_end_val)
                .data('start-friendly', start_friendly)
                .data('end-friendly', end_friendly)
                .data('name', user_fullname)
                .data('uid', user_id);

            $sched_box.find('.shift_hourly_wage').val(hourly_wage);
            $sched_box.find('.sched_input').val(friendly_text).trigger('blur');

            if(!this.options.is_shift_blocks && !$sched_box.find('.role_select_options option[value="' + role_val + '"]').length && !is_open_shift){
                var $option = $sched_box.find('.role_select_options option:first');
                role_val = $option.val();
                orig_role_text = $option.text();
                role_text = this.getRoleText(orig_role_text);
            }

            if(this.options.is_shift_blocks){
                $sched_box.data('role-id', role_val);
            } else {
                $sched_box.find('.role_input').val(role_val);
            }

            $sched_box.find('.role_label').text(role_text).attr('title', orig_role_text);
            $sched_box.attr('data-role-style', role_val);
            $sched_box.find('.shift_notes').val(notes_val);
            $sched_box.find('.shift_close').val(close);
            $sched_box.find('.shift_bd').val(bd);
        }
        // Clone the first one (everything else)
        else
        {
            var $new = $sched_box.clone();
            $new.addClass('cloned');
            $sched_box_info.eq(-1).after($new);
            $new.find('a.sched_anchor').text(friendly_text)
                .data('start', time_input_start_val)
                .data('end', time_input_end_val)
                .data('start-friendly', start_friendly)
                .data('end-friendly', end_friendly)
                .data('name', user_fullname)
                .data('uid', user_id);

            $new.find('.shift_hourly_wage').val(hourly_wage);
            $new.find('input.sched_input').val(friendly_text).trigger('blur');
            if(role_val){
                if(!this.options.is_shift_blocks && !$new.find('.role_select_options option[value="' + role_val + '"]').length && !is_open_shift){
                    var $option = $new.find('.role_select_options option:first');
                    role_val = $option.val();
                    orig_role_text = $option.text();
                    role_text = this.getRoleText(orig_role_text);
                }
            }

            if(this.options.is_shift_blocks){
                $new.data('role-id', role_val);
            } else {
                $new.find('.role_input').val(role_val);
            }

            $new.find('.role_label').text(role_text).attr('title', orig_role_text);
            $new.attr('data-role-style', role_val);
            $new.find('.shift_notes').val(notes_val);
            $new.find('.shift_close').val(close);
            $new.find('.shift_bd').val(bd);
        }

        this.showUnpublishedNotice();

        this.ajaxAddShift({
            group: (isNaN(user_id) ? 0 : user_id), // could be 'open-shift'
            start: time_input_start_val,
            end: time_input_end_val,
            notes: notes_val,
            date: date,
        }, function(result,a,b){
			console.log(result, a,b);
			$('<div class="xe"><div class="times"><a class="sched_anchors" href="#">'+result.start+' - '+result.end+'</a><div class="clear"></div></div></div>').prependTo($td);
			
		});

    },

    getRoleText: function(text){
        return text.toUpperCase().substr(0, 1);
    },

    ajaxAddShift: function(data, cb){
        var self = this;
        this.showSavingSpinner();

        Shifts.Schedule.Model.addShift(data, function(){
            self.hideSavingSpinner();
            if(cb){
                cb.apply(this, arguments);
            }
        });
    },

    ajaxEditShift: function(data, cb){
        var self = this;
        this.showSavingSpinner();

        Shifts.Schedule.Model.editShift(data, function(){
            self.hideSavingSpinner();
            if(cb){
                cb.apply(this, arguments);
            }
        });
    },

    showSavingSpinner: function(){
        $('#notice-saving-shift').addClass('saving');
    },

    hideSavingSpinner: function(){
        $('#notice-saving-shift').removeClass('saving');
    },

    editShift: function($anchor){

        var self = this;

        var clicked_anchor = $anchor.hasClass('sched_anchor');
        $anchor = clicked_anchor ? $anchor : $anchor.parents('.sched-box-info').find('.sched_anchor');
        var start = $anchor.data('start');
        var end = $anchor.data('end');

        var $sched_box = $anchor.parents('.sched-box-info');
        var $role = $sched_box.find('.user_role');
        var role_html = ($role.length) ? $role.html() : '';
        var notes = $sched_box.find('.shift_notes').val();
        var close = parseInt($sched_box.find('.shift_close').val(), 10);
        var bd = parseInt($sched_box.find('.shift_bd').val(), 10);

        if(self.options.is_shift_blocks){
            var open_shift = $anchor.data('uid') == 'open-shift';
        } else {
            var open_shift = $sched_box.find('.shift_open').val();
        }

        var open_shift_offer_type = $sched_box.find('.shift_open_offer_type').val();
        var edit_id = (self.options.is_shift_blocks ? $anchor.data('uid') : '');

        var opts = {
            close: close,
            bd: bd,
            time_input_start: start,
            time_input_end: end,
            notes: notes,
            type: 'edit',
            open: open_shift,
            open_offer_type: open_shift_offer_type,
            name: (self.options.is_shift_blocks ? Shifts.Lang.get('schedules.shift') : $.trim($anchor.parents('tr').find('.name').text())),
            edit_id: edit_id
        };

        if(role_html){
            opts.role = role_html;
            opts.selected_role = $role.find('.role_input').val();
        }

        this.showTimeOverlay($anchor, opts, function(time_input_start_val, time_input_end_val, start_friendly, end_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, user_id, user_name, hourly_wage){
            self.updateShift(time_input_start_val, time_input_end_val, start_friendly, end_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, $sched_box, user_id, user_name, hourly_wage);
        });

    },

    updateShift: function(time_input_start_val, time_input_end_val, start_friendly, end_friendly, role_val, role_text, orig_role_text, notes_val, close, bd, open_shift, open_shift_offer_type, $sched_box, user_id, user_fullname, hourly_wage){

        var $tr = $sched_box.parents('tr');
        var id = $sched_box.data('shift-id');
        user_id = user_id || $tr.data('user-id');
        var group_id = $tr.data('group-id');
        hourly_wage = hourly_wage || $tr.data('hourly-wage') || '0.00';
        var schedule_type_id = $tr.data('schedule-type-id');
        var $td = $sched_box.parents('td');
        var date = $td.data('date');

        var draft = (
            (time_input_start_val != $sched_box.data('original-shift-start')) ||
            (time_input_end_val != $sched_box.data('original-shift-end')) ||
            (role_val && role_val != $sched_box.data('original-role-id')) ||
            (notes_val != $sched_box.data('original-notes')) ||
            (close != $sched_box.data('original-close')) ||
            (bd != $sched_box.data('original-bd')) ||
            (this.options.is_shift_blocks && user_id != $sched_box.data('original-uid'))
        ) ? 1 : 0;

        var friendly_text = user_fullname || this.generateTimeFriendly(start_friendly, end_friendly, close, bd);

        if(draft){
            this.showUnpublishedNotice();
        }

        var $anchor = $sched_box.find('a.sched_anchor');

        $anchor.text(friendly_text)
            .data('start', time_input_start_val)
            .data('end', time_input_end_val)
            .data('start-friendly', start_friendly)
            .data('end-friendly', end_friendly);

        $sched_box.find('.shift_hourly_wage').val(hourly_wage);
        $sched_box.find('.sched_input').val(friendly_text).trigger('blur');

        if(this.options.is_shift_blocks){
            $sched_box.data('role-id', role_val);
            $anchor.attr({
                'data-uid': user_id,
                'data-name': user_fullname
            }).data({
                'uid': user_id,
                'name': user_fullname
            });
        } else {
            $sched_box.find('.role_input').val(role_val);
        }

        $sched_box.find('.role_label').text(role_text).attr('title', orig_role_text);
        $sched_box.attr('data-role-style', role_val);

        $sched_box.find('.shift_notes').val(notes_val);
        $sched_box.find('.shift_close').val(close);
        $sched_box.find('.shift_bd').val(bd);
        $sched_box.find('.shift_open').val(open_shift);
        $sched_box.find('.shift_open_offer_type').val(open_shift_offer_type);

        this.ajaxEditShift({
            id: id,
            start: time_input_start_val,
            end: time_input_end_val,
            role_id: role_val || 0,
            notes: notes_val,
            hourly_wage: hourly_wage,
            schedule_type_id: schedule_type_id,
            user_id: (isNaN(user_id) ? 0 : user_id), // could be 'open-shift'
            group_id: group_id,
            date: date,
            close: close,
            bd: bd,
            draft: draft,
            open: open_shift ? 1 : 0,
            open_offer_type: open_shift_offer_type,
            notified: draft ? 0 : 1
        }, function(res){
            if(res && res.data && res.data.id){
                Shifts.Events.trigger('Schedules.tally', $td.data('day'));
                Shifts.Events.trigger('AvailabilityConflictChecker.update');
            }
        });

    },

    generateTimeFriendly: function(start, end, close, bd){

        start = start.replace(' ', '');
        end = close == 1 ? (lang == 'en' ? 'CL' : 'FE') : end.replace(' ', '');
        end = bd == 1 ? (lang == 'en') ? 'BD' : 'BD' : end;

        var time = start + ' - ' + end;

        time = time.replace(/:00/g, '');

        return time;
    },

    showUnpublishedNotice: function(){
        Shifts.Timecalc.unpublished = true;
        $('.unpublished-shifts').show();
        $(window).trigger("scroll.unpublished");
    },

    showTimeOverlay: function($btn, opt_vals, hide_callback){

        var self = this;
        var is_open_shift;
        var $time_overlay = $('#time-overlay');
        var $offer_to = $time_overlay.find('.offer-to');
        var $time_input_start = $time_overlay.find('.time-input.start').show();
        var $time_input_end = $time_overlay.find('.time-input.end').show();
        var $shift_avail_list = $time_overlay.find('.shift-availability-list');
        var $time_bar_wrap = $time_overlay.find('.time-bar-wrap');
        var $time_bar_time_frames = $time_overlay.find('.time-bar-time-frames');

        if(self.options.is_shift_blocks){
            $time_bar_wrap.hide();
            $shift_avail_list.show();
            this.setUsersList($time_overlay, $btn, opt_vals.edit_id);
            this._editing_user_id = (opt_vals.edit_id) ? opt_vals.edit_id : null;
            if(opt_vals.open == 1){
                self._setSelectedAvailListItem($shift_avail_list.find('.shift-availability-open-shifts li'));
            }
            self._displayWeeklyWorkedHours($shift_avail_list);
        } else {
            is_open_shift = $btn.hasClass('open-shift');
        }

        $offer_to[is_open_shift ? 'show' : 'hide']();

        if(opt_vals.type == 'add'){
            $time_overlay.find('.shift-delete').hide().removeData('shift-id');
            $time_overlay.find('.shift-save').addClass('full');
        } else {
            var shift_id = $btn.parents('.sched-box-info').data('shift-id');
            $time_overlay.find('.shift-delete').show().data('shift-id', shift_id);
            $time_overlay.find('.shift-save').removeClass('full');
        }

        // Show avail/time off in the dialog
        this.setAvailStatusContent($time_overlay, $btn);

        // Better time selection dropdowns for ipads etc.
        if(Shifts.Device.isTouch()){
            $time_input_start.add($time_input_end).attr({ 'type': 'time', 'step': 300 });
        } else {
            $time_input_start.timeAutocomplete();
            $time_input_end.timeAutocomplete({
                from_selector: $time_input_start
            });
        }

//        if(opt_vals.type == 'add'){
            //$time_input_start.add($time_input_end).val('');
//        }

        

        var max_width = 370;
        var position = $btn.offset();
        var width = $btn.outerWidth(true);
        var height = $btn.outerHeight(true);
        $time_overlay.find('.time-overlay-title').text(opt_vals.name);
        var left = 'auto';
        var right = 'auto';
        var time_overlay_css = {
            width: 0,
            height: 'auto',
            visibility: 'hidden',
            top: position.top + (height / 2)
        };

        if((position.left + width + 100) > $(window).width()){
            time_overlay_css.right = 20;
            right = 40;
        } else {
            time_overlay_css.left = position.left + (width / 2);
            left = position.left - (max_width / 2) + (width / 2);
        }

        $time_overlay.css(time_overlay_css);
        var max_height = $time_overlay.height();
        $time_overlay.css('visibility', 'visible').show();

        var altered_css = {
            width: max_width,
            left: left,
            right: right,
            top: position.top - (max_height / 2) + (height / 2) + 80
        };

        $time_overlay.css(altered_css);

        if(!Shifts.Device.isTouch()){
            $time_input_start.focus();
        }

        try {
            $time_input_start.add($time_input_end).autocomplete('destroy');
        } catch(e){}

        if(opt_vals && !this.is_shift_blocks && $time_bar_time_frames.find('option').length && typeof(opt_vals.time_input_start) != 'undefined' && typeof(opt_vals.time_input_end) != 'undefined'){
            if(this.setTimeFrameSelection(opt_vals.time_input_start, opt_vals.time_input_end)){
                $('.time-bar-time-frames').show();
                $('.time-bar-custom-inputs').hide();
            } else {
                $('.time-bar-time-frames').hide();
                $('.time-bar-custom-inputs').show();
            }
        }

        if(!this.is_shift_blocks && $time_bar_time_frames.is(':visible')){
            $time_bar_time_frames.find('select:visible').trigger('change');
        }

        if(hide_callback){
            $time_overlay.find('.shift-save').unbind(Shifts.Device.getClickEvent()).bind(Shifts.Device.getClickEvent(), function(e){

                e.preventDefault();

                if(self.options.is_shift_blocks){
                    var data = self.getShiftBlockDataFromCell($btn.parents('td'));
                    var shift_start_friendly = data.start_friendly;
                    var shift_end_friendly = data.end_friendly;
                    var shift_start = data.start;
                    var shift_end = data.end;
                    var close = data.close;
                    var bd = data.bd;
                    var role = data.role_id;
                    var orig_role_text = data.role_name;
                    is_open_shift = $time_overlay.find('.shift-availability-open-shifts li.selected').length;
                    var open_shift_offer_type =  (is_open_shift ? Shifts.Schedule.SHIFTPOOL_OFFER_TYPE_ROLE : 0);
                    var $selected_li = $time_overlay.find('.shift-availability-list li.selected');
                    var $selected_a = $selected_li.find('a[data-uid]');
                    var user_id =  $selected_a.data('uid');
                    var user_name = $selected_li.find('.avail-name').text();
                    var hourly_wage = $selected_a.data('hourly-wage');
                } else {
                    var shift_start_friendly = self.getTimeForDisplay($time_overlay.find('.time-input.start'));
                    var shift_end_friendly = self.getTimeForDisplay($time_overlay.find('.time-input.end'));
                    var shift_start = self.getTimeForStoring($time_overlay.find('.time-input.start'));
                    var shift_end = self.getTimeForStoring($time_overlay.find('.time-input.end'));
                    var role = $time_overlay.find('.role_select_options').val();
                    var $role_opt = $time_overlay.find('.role_select_options option[value="' + role + '"]');
                    var orig_role_text = $role_opt.text();
                    var bd = ((!$time_bar_time_frames.is(':visible') && $time_overlay.find('.shift-bd').is(':checked')) || ($time_bar_time_frames.is(':visible') && $time_overlay.find('.time-input.end').data('bd'))) ? 1 : 0;
                    var close = ((!$time_bar_time_frames.is(':visible') && $time_overlay.find('.shift-close').is(':checked')) || ($time_bar_time_frames.is(':visible') && $time_overlay.find('.time-input.end').data('close'))) ? 1 : 0;
                    var open_shift_offer_type = $time_overlay.find('.offer-to').val();
                    var user_id = null;
                    var user_name = null;
                    var hourly_wage = null;
                }

                var role_text = self.getRoleText(orig_role_text);
                var notes = $.trim($time_overlay.find('.shift-notes').val());
                var open = is_open_shift ? 1 : 0;
                if(is_open_shift && open_shift_offer_type != Shifts.Schedule.SHIFTPOOL_OFFER_TYPE_ROLE){
                    role = '';
                    role_text = '';
                    orig_role_text = '';
                }

                hide_callback(shift_start, shift_end, shift_start_friendly, shift_end_friendly, role, role_text, orig_role_text, notes, close, bd, open, open_shift_offer_type, user_id, user_name, hourly_wage);
                self._closeTimeOverlayBox();
            });
        }

    },

    setTimeFrameSelection: function(start, end){
        var $option = $('.time-bar-time-frames select:visible option[data-start="' + start + '"][data-end="' + end + '"]');

        if($option.length){
            $option[0].selected = true;
            return true;
        } else {
            return false;
        }
    },

    _displayWeeklyWorkedHours: function($list){

        var uids_obj = {};
        var self = this;

        $('.sched-anchor-disabled:visible, .sched_anchor:visible').each(function(){
            var uid = $(this).data('uid');
            if(uid != ''){
                if(typeof(uids_obj[uid]) == 'undefined'){
                    uids_obj[uid] = 0;
                }
                var info = self.getShiftBlockDataFromCell($(this).parents('td'));
                uids_obj[uid] += getHoursWorked(Shifts.differenceInHours(info.start, info.end));
            }
        });

        $list.find('li a[data-uid]').each(function(){
            var $anchor = $(this);
            var $li = $anchor.parents('li');
            var uid = $anchor.data('uid');
            if(uid != 'open-shift'){
                var hours = 0;
                if(uids_obj[uid]){
                    hours = self.convert2Decimal(uids_obj[uid]);
                }
                var $avail_hrs_worked = $(this).parent().find('.avail-hrs-worked');
                $avail_hrs_worked.find('i').text(hours);
                $avail_hrs_worked.data('hrs-worked', hours);
                self.tallyHoursWarning($li, hours);
            }
        });

    },

    tallyHoursWarning: function($li, hours_worked){

        var $avail_hrs_worked = $li.find('.avail-hrs-worked');
        var max_weekly_hours = $li.find('a[data-uid]').data('max-weekly-hours');
        var is_in_weekly_overtime = (window.OvertimeSettings.enabled && window.OvertimeSettings.weekly_hours && hours_worked > window.OvertimeSettings.weekly_hours);

        if((max_weekly_hours && hours_worked > max_weekly_hours) || is_in_weekly_overtime){
            $avail_hrs_worked.addClass('over');
        } else {
            $avail_hrs_worked.removeClass('over');
        }

    },

    setUsersList: function($time_overlay, $el, edit_id){
        var $td = $el.parents('td');
        var users = $td.data('users');

        var already_scheduled_uids = $td.find('.sched_anchor').map(function(){
            var uid = $(this).data('uid');
            if(uid){
                return uid;
            }
        }).get();

        var day = $td.data('day');
        var shift_block_data = this.getShiftBlockDataFromCell($td);
        var start = shift_block_data.start;
        var end = shift_block_data.end;
        var rendered_users = this.getUsersWorkingToday(day, start, end, $.extend(true, {}, users), edit_id, already_scheduled_uids);

        $time_overlay.find('.shift-availability-list').data('shift-length', $td.parents('tr').data('shift-length'));
        this._renderOpenShifts($time_overlay, already_scheduled_uids);
        this._renderAvailability(edit_id, already_scheduled_uids, $time_overlay, rendered_users, 'available', 'available', 'available_li');
        this._renderAvailability(edit_id, already_scheduled_uids, $time_overlay, rendered_users, 'not_available', 'not-available', 'not_available_li');
    },

    getUsersWorkingToday: function(day, start, end, all_users, edit_id, already_scheduled_uids){

        var conflict_data = [];
        var make_not_available = [];
        var self = this;

        $('td.' + day).each(function(){
            $(this).find('.sched-box-info:visible,.sched-box-info-disabled:visible').each(function(){
                var $sched_box = $(this);
                var data = self.getShiftBlockDataFromCell($sched_box.parents('td'));
                var finder_cls = $sched_box.hasClass('sched-box-info') ? 'sched_anchor' : 'sched-anchor-disabled';

                if(Shifts.timeOverlaps(start, end, data.start, data.end)){
                    var $anchor = $sched_box.find('.' + finder_cls);
                    var uid = ("" + $anchor.data('uid') + "");
                    var hourly_wage = $sched_box.find('.shift_hourly_wage').val() || 0;
                    var name = $anchor.data('name');
                    conflict_data.push({
                        id: uid,
                        name: name,
                        hourly_wage: hourly_wage
                    });
                }
            });
        });

        _.each(all_users, function(data, key){
            _.each(data, function(o, user_id){
                var exists = _.findWhere(conflict_data, { id: user_id });
                if(key == 'available' && exists){
                    make_not_available.push(exists);
                    delete all_users[key][user_id];
                }
            });
        });

        _.each(make_not_available, function(o){
            if(o.id != edit_id && !~already_scheduled_uids.indexOf(parseInt(o.id, 10))){
                all_users['not_available'][o.id] = [o];
            }
        });

        return all_users;

    },

    _renderAvailability: function(edit_id, already_scheduled_uids, $time_overlay, users, type, cls, tpl_key){
        var html = '';

        if(users && users[type]){
            var tpl = Handlebars.compile(this.shift_block_templates[tpl_key]);
            var rendered_avail = _.sortBy(users[type], function(a){ return a[0].name });

            _.each(rendered_avail, function(arr){
                var disabled = !!($.inArray(arr[0].id, already_scheduled_uids) != -1 && edit_id != arr[0].id);
                var selected = (edit_id && parseInt(edit_id, 10) == arr[0].id);
                if(!disabled){
                    html += tpl({
                        id: arr[0].id,
                        name: arr[0].name,
                        selected: selected,
                        hourly_wage: arr[0].hourly_wage,
                        max_weekly_hours: arr[0].max_weekly_hours
                    });
                }
            }, this);
        }

        $time_overlay.find('.shift-availability-' + cls).html(html);
    },

    _renderOpenShifts: function($time_overlay){
        var $li = $time_overlay.find('.shift-availability-open-shifts li');
        $li.removeClass('selected').find('.glyphicon').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    },

    _setSelectedAvailListItem: function($li){
        $li.addClass('selected').find('.glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');
    },

    setAvailStatusContent: function($time_overlay, $el){
        var html = '';
        var avail_content = $el.parents('td').data('avail-status');
        if(avail_content && avail_content.length){
            _.each(avail_content, function(obj){
                html += '<div class="' + obj['class'] + '">' + obj.message + '</div>';
            });
        }
        $time_overlay.find('.shift-avail-content').html(html);
    },

    setTime: function($el, time){
        if($el.data('timeAutocomplete')){
            $el.data('timeAutocomplete').setTime(time);
        } else {
            $el.val(time);
        }
    },

    getTimeForStoring: function($el){
        if($el.data('timeAutocomplete')){
            return $el.data('timeAutocomplete').getTime();
        } else {
            // input type="time" value (will be in 13:10 format)
            return $el.val() || '00:00:00';
        }
    },

    getTimeForDisplay: function($el){
        var val = $el.val();
        if($el.data('timeAutocomplete')){
            return val;
        } else {
            var time;
            if(this.options.time_format == 'ampm'){
                time = val ? moment(val, 'HH:mm').format('h:mm a') : '12:00 am';
            } else {
                time = val;
            }
            return time;
        }
    },

    /**
     * Reset the success/error messages in the jquery ui dialog
     */
    resetDialogNotice: function(){

        this._setDialogNotice('', '');

    },

    /**
     * Set a dialog notice with a class and a message
     *
     * @param klass {String} The class success or error
     * @param msg {String} The message
     */
    _setDialogNotice: function(klass, msg){

        var self = this;

        $(self.els.dialog_notice_wrap)[0].className = klass;
        $(self.els.dialog_notice_msg)[0].innerHTML = msg;

    },

    /**
     * The response from copying a schedule. It could come back as false (0)
     * meaning the schedule already exists.
     *
     * @param res {String} The ajax response
     */
    _copyScheduleResponse: function(res){
        var self = this,
            klass,
            msg;

        if(res.status == 'success'){
            // Select the month we just cloned.
            klass = 'success';
            msg = Shifts.Lang.get('schedules.copying') + '...';

            setTimeout(function(){
                window.location.href = Shifts.base_url + 'schedules?group_id=' + res.data.posted_data.group_id + '&week=' + res.data.posted_data.to_week + '&schedule_type_id=' + res.data.posted_data.from_week_sched_type_id;
            }, 2000);
        }
        else {
            klass = 'error';
        }

        $(self.els.create_btn).removeAttr('disabled');
        self._setDialogNotice(klass, msg);

    },

    /**
     * Show the dialog box and create a new instance of the jquery
     * ui dialog box
     */
    _showCopyDialog: function(){

        var self = this;

        self.dialog = new Shifts.ui.Dialog({
            el: self.els.copy_dialog,
            plugin: {
                width: 320
            }
        });

    }

});

Shifts.Views.Schedules.AvailabilityConflictChecker = Backbone.View.extend({

    events: {},

    _conflict_count: 0,

    defaults: {
        conflicts_el: null,
        is_shift_blocks: false
    },

    initialize: function(){
        this.options = $.extend(true, {}, this.defaults, this.options);
        _.bindAll(this);
        this.externalEvents();
    },

    externalEvents: function(){
        Shifts.Events.on('AvailabilityConflictChecker.update', this.update);
    },

    update: function(){
        var self = this;
        this._conflict_count = 0;

        this.$el.find('td.day').each(function(){
            if(self.options.is_shift_blocks){
                self._handleCheckForShiftBlocks($(this));
            } else {
                self._handleCheckForList($(this));
            }
        });

        this._updateAvailConflictsWidget(this.getConflictCount());
    },

    getConflictCount: function(){
        return this._conflict_count;
    },

    _handleCheckForList: function($td){

        var self = this;

        var avail_info = $td.data('avail-status');
        var $anchors = $td.find('a.sched_anchor:visible');

        if(avail_info){
            $anchors.removeClass('shift-avail-conflict').each(function(){
                var $el = $(this);
                var shift_data = $el.data();

                if(shift_data.start && shift_data.end){
                    var shift_start = moment('2013-01-01 ' + shift_data.start, 'YYYY-MM-DD HH:mm:ss').unix();
                    var shift_end = moment('2013-01-01 ' + shift_data.end, 'YYYY-MM-DD HH:mm:ss').unix();

                    _.each(avail_info, function(avail){
                        self._performAvailabilityCheckForList($el, avail, shift_start, shift_end);
                    });
                }
            });
        }

    },

    _performAvailabilityCheckForList: function($el, avail, shift_start, shift_end){

        if(avail.from){
            var from_unix = moment('2013-01-01 ' + avail.from, 'YYYY-MM-DD HH:mm:00').unix();
        }
        if(avail.to){
            var to_unix = moment('2013-01-01 ' + avail.to, 'YYYY-MM-DD HH:mm:00').unix();
        }

        if(from_unix && to_unix && to_unix < from_unix){
            to_unix = moment('2013-01-02 ' + avail.to, 'YYYY-MM-DD HH:mm:00').unix();
        }

        if(avail.type == 'not_available'){
            if(avail.from && avail.to){
                if(shift_end <= from_unix || shift_start >= to_unix){} else {
                    $el.addClass('shift-avail-conflict');
                    this._conflict_count++;
                }
            } else {
                $el.addClass('shift-avail-conflict');
                this._conflict_count++;
            }
        }
        else if(avail.from && avail.to) {
            if(shift_start >= from_unix && shift_end <= to_unix){} else {
                $el.addClass('shift-avail-conflict');
                this._conflict_count++;
            }
        }

    },

    _handleCheckForShiftBlocks: function($td){

        var self = this;
        var avail = $td.data('users').available;
        var $anchors = $td.find('a.sched_anchor');

        $anchors.removeClass('shift-avail-conflict').each(function(){
            var uid = $(this).data('uid');
            if(uid && parseInt(uid, 10) > 0 && typeof(avail[uid]) == 'undefined'){
                $(this).addClass('shift-avail-conflict');
                self._conflict_count++;
            }
        });

    },

    _updateAvailConflictsWidget: function(conflict_count){

        if(conflict_count == 0){
            this.options.conflicts_el.addClass('none');
        } else {
            this.options.conflicts_el.removeClass('none');
        }

        this.options.conflicts_el.find('span').text(conflict_count);
    },

    render: function(){
        this.update();
    }

});

// https://github.com/richadams/jquery-taphold
!function(a){function c(a){var c=jQuery(this);if(settings=jQuery.extend({},b,a.data),"undefined"!=typeof c.data("events")&&"undefined"!=typeof c.data("events").click){for(var d in c.data("events").click)if(""==c.data("events").click[d].namespace){var e=c.data("events").click[d].handler;c.data("taphold_click_handler",e),c.unbind("click",e);break}}else"function"==typeof settings.clickHandler&&c.data("taphold_click_handler",settings.clickHandler);c.data("taphold_triggered",!1),c.data("taphold_clicked",!1),c.data("taphold_cancelled",!1),c.data("taphold_timer",setTimeout(function(){c.data("taphold_cancelled")||c.data("taphold_clicked")||(c.trigger(jQuery.extend(a,jQuery.Event("taphold"))),c.data("taphold_triggered",!0))},settings.duration))}function d(a){var b=jQuery(this);b.data("taphold_cancelled")||(clearTimeout(b.data("taphold_timer")),b.data("taphold_triggered")||b.data("taphold_clicked")||("function"==typeof b.data("taphold_click_handler")&&b.data("taphold_click_handler")(jQuery.extend(a,jQuery.Event("click"))),b.data("taphold_clicked",!0)))}function e(){a(this).data("taphold_cancelled",!0)}var b={duration:1e3,clickHandler:null},f="ontouchstart"in window||"onmsgesturechange"in window;a.event.special.taphold={setup:function(b){a(this).bind(f?"touchstart":"mousedown",b,c).bind(f?"touchend":"mouseup",d).bind(f?"touchmove":"mouseleave",e)},teardown:function(){a(this).unbind(f?"touchstart":"mousedown",c).unbind(f?"touchend":"mouseup",d).unbind(f?"touchmove":"mouseleave",e)}}}(jQuery);




(function(n){n.List=Backbone.View.extend({events:{"click .deletebtn":"deleteSchedule","click .editbtn":"editSchedule"},deleteSchedule:function(n){var t=this;return Shifts.ui.confirm(Shifts.Lang.get("schedules.are_you_sure_delete"),function(){t.redirect($(n.currentTarget).attr("href"))}),!1},redirect:function(n){window.location.href=n},editSchedule:function(n){$(n.currentTarget).parents("li").find(".grey-loader").show()}})})(Shifts.Views.Schedules);


(function($,c,b){$.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "),function(d){a(d)});a("focusin","focus"+b);a("focusout","blur"+b);$.addOutsideEvent=a;function a(g,e){e=e||g+b;var d=$(),h=g+"."+e+"-special-event";$.event.special[e]={setup:function(){d=d.add(this);if(d.length===1){$(c).bind(h,f)}},teardown:function(){d=d.not(this);if(d.length===0){$(c).unbind(h)}},add:function(i){var j=i.handler;i.handler=function(l,k){l.target=k;j.apply(this,arguments)}}};function f(i){$(d).each(function(){var j=$(this);if(this!==i.target&&!j.has(i.target).length){j.triggerHandler(e,[i.target])}})}}})(jQuery,document,"outside");


(function(t){var e="timeAutocomplete",i=e+".time",o=function(){this.initialize.apply(this,arguments)};o.prototype={el:null,_formatter:null,_calling_from_init:!1,default_opts:{auto_complete:{delay:0,autoFocus:!0,minLength:0},value:"",formatter:"ampm"},initialize:function(e,i){this.options=t.extend(!0,{},this.default_opts,i),this.el=e},_callAutocomplete:function(){if(this.options.auto_complete.source=this._callFormatterMethod("filterSource",[this.el],function(){throw Error("You must set a hook_filterSource method in your formatter.")}),t.fn.autocomplete===void 0)throw Error("You need to include the jQuery UI bundle that has the Autocomplete plugin.");this.el.autocomplete(this.options.auto_complete)},_bindEvents:function(){var i=this,o=!0;t("body").on("click."+e,"ul.ui-autocomplete a",function(){o=!1,setTimeout(function(){o=!0},100)}),this.el.bind("keydown."+e,function(){i._keydownAutocomplete.apply(i,arguments)}).bind("keyup."+e,function(){i._keyupAutocomplete.apply(i,arguments)}).bind("blur."+e,function(){i._blurAutocomplete.apply(i,arguments)}).bind("focus."+e,function(){o&&i._focusAutocomplete.apply(i,arguments)}).trigger("blur."+e)},_setupPlaceholder:function(){this.el.attr("placeholder")===void 0&&this.el.attr("placeholder",this._callFormatterMethod("placeholderValue",[],""))},_focusAutocomplete:function(){var e=t.trim(this.el.val()).substr(0,2);this.el.data("uiAutocomplete")&&this.el.autocomplete("search",e)},_keydownAutocomplete:function(e){var i=t.trim(this.el.val()),o=[13,9,38,40];if(!~t.inArray(e.which,o)&&(8==e.which||i.length>1&&!~i.indexOf("h")&&!~i.indexOf(":")&&t.isNumeric(i)))try{this.el.autocomplete("close").autocomplete("disable")}catch(e){}},_keyupAutocomplete:function(){""==t.trim(this.el.val())&&this.el.data("uiAutocomplete")&&this.el.autocomplete("enable")},_blurAutocomplete:function(){var e=t.trim(this.el.val());e=this._callFormatterMethod("blur",[e],e);var i="";i=e?this._createStringFromFormat(this._readMind(e)):this._callFormatterMethod("blurEmpty",[e],e),this.el.val(i),this._attacheUsableTimeData()},_attacheUsableTimeData:function(){var e=t.trim(this.el.val());this.el.data(i,this._callFormatterMethod("getUsableTimeValue",[e]))},setFormatter:function(e){if(this.options.formatter=e||this.options.formatter,!t.timeAutocomplete.formatters[this.options.formatter])throw Error("Formatter: '"+e+"' was not found. Make sure you're loading it (formatters/"+this.options.formatter+".js) after you load src/TimeAutocomplete.js");this._formatter=new t.timeAutocomplete.formatters[this.options.formatter](this,this.options),this._calling_from_init||this._callAutocomplete(),this._calling_from_init=!1},getFormatter:function(){return this._formatter},getTime:function(){return this.el.data(i)||""},_callFormatterMethod:function(e,i,o){var s=this.getFormatter();return t.isFunction(s["hook_"+e])?s["hook_"+e].apply(s,i):o},_readMind:function(t){return this._callFormatterMethod("readMind",[t],t)},_createStringFromFormat:function(t){var e=""+t.h+t.sep+(""+t.m);return t.postfix&&(e+=t.postfix),e},_setValueAsTime:function(){var e=t.trim(this.el.val()),i=e.split(":");if(""==e&&this.options.value)this.setTime(this.options.value);else if(3==i.length&&this.isNumber(i[0])&&this.isNumber(i[1])&&this.isNumber(i[2]))this.setTime(e);else{var o=this._getCurrentTimeAsValue();this.el.val(o),this._attacheUsableTimeData()}},isNumber:function(t){return!isNaN(parseFloat(t))&&isFinite(t)},setTime:function(t){var e=t.replace(/[^0-9.]/g,""),i=e.match(/^[0-9]+$/);if(!i||!i.length||5!=i[0].length&&6!=i[0].length)throw Error("Setting a time must be in H:i:s format. Example: 03:30:00");var o=this._callFormatterMethod("getTimeObjectFromHis",[t]);o=this._createStringFromFormat(o),this.el.val(o),this._attacheUsableTimeData()},_getCurrentTimeAsValue:function(){for(var e=this.getFormatter(),i=[1987,1,17],o=this._getCurrentDate(),s=o.getHours(),r=o.getMinutes(),n=new Date(i[0],i[1],i[2],s,r).getTime(),a=e.options.times.slice().concat(e.options.times),m=[],p=0,h=a.length;h>p;p++){var l=this._callFormatterMethod("getTime",[a[p],i]),u=a[p+1]?this._callFormatterMethod("getTime",[a[p+1],i]):!1,c=!(-1===t.inArray(u,m));if(m.push(u),n>l&&(u&&u>=n||c))return a[p+1]}},_getCurrentDate:function(){return new Date},destroy:function(){this.el.removeData(e),this.el.removeData(i),this.el.unbind("."+e),this.el.data("uiAutocomplete")&&this.el.autocomplete("destroy")},render:function(){return this._calling_from_init=!0,this.setFormatter(),this._callAutocomplete(),this._setValueAsTime(),this._bindEvents(),this._setupPlaceholder(),this}},t.timeAutocomplete={formatters:{},_raw:o},t.fn.timeAutocomplete=function(i){return this.each(function(){var s=t(this);s.data(e)&&s.data(e).destroy();var r=new o(s,i).render();s.data(e,r)})}})(jQuery),function(t){t.timeAutocomplete.formatters.ampm=function(){this.initialize.apply(this,arguments)},t.timeAutocomplete.formatters.ampm.prototype={main_instance:null,options:{},default_opts:{from_selector:"",increment:15,start_hour:0,end_hour:24,pm_text:"PM",am_text:"AM",blur_empty_populate:!0,times:[],empty:{h:"12",m:"00",sep:":",postfix:" PM"}},initialize:function(e,i){this.main_instance=e,this.options=t.extend(!0,{},this.default_opts,i),this.generateTimes()},hook_placeholderValue:function(){return this.main_instance._createStringFromFormat(this.options.empty)},hook_filterSource:function(e){var i=this;return e=e[0],function(i,o){return function(s,r){var n=t.trim(e.value),a=t.ui.autocomplete.escapeRegex(s.term),m=~a.toLowerCase().indexOf("a"),p=~a.toLowerCase().indexOf("p"),h="",l=!(1!=n),u=(m||p)&&2>=a.replace(/a|m|p/gi,"").length;u&&(a=t.trim(a.replace(/a|m|p/gi,""))+":00 ",a+=m?o.options.am_text:o.options.pm_text),o.options.from_selector&&(h=o.detectAMPMFromInstanceOverlap()==o.options.am_text?o.options.pm_text:o.options.am_text);var c=RegExp("^"+a,"i"),f=[];n&&(f=t.grep(i,function(t){var e=h&&RegExp(h,"gi").test(t)||l&&"1:"!=t.substring(0,2)||~n.toLowerCase().indexOf("p")&&!~t.toLowerCase().indexOf("p")||~n.toLowerCase().indexOf("a")&&!~t.toLowerCase().indexOf("a");if(!e)return c.test(t)})),r(f)}}(i.options.times,i)},hook_blur:function(t){return 0==t.charAt(0)&&(t=t.substr(1)),t},hook_blurEmpty:function(){return this.options.blur_empty_populate?this.main_instance._createStringFromFormat(this.options.empty):""},hook_readMind:function(t){var e="";return t=t.toLowerCase(),!this.options.from_selector||~t.indexOf("a")||~t.indexOf("p")||(e=this.detectAMPMFromInstanceOverlap()),this.getTimeObject(t,e)},hook_getUsableTimeValue:function(t){return this.parseTime(t)},hook_getTime:function(t,e){var i=this.parseTime(t).split(this.options.empty.sep),o=i[0],s=i[1];return new Date(e[0],e[1],e[2],o,s).getTime()},hook_getTimeObjectFromHis:function(t){var e=t.split(":"),i=e[0],o=e[1],s=i>=12?this.options.pm_text:this.options.am_text;2==i.length&&10>parseInt(i,10)&&(i=i.substr(1)),i>12&&(i-=12),0==i&&(i=12);var r={h:parseInt(i,10),m:o,sep:this.options.empty.sep,postfix:" "+s};return r},detectAMPMFromInstanceOverlap:function(){var e="",i=this.getTimeObject(t(this.options.from_selector).val()),o=this.getTimeObject(t.trim(this.main_instance.el.val()));if(i.postfix&&(~i.postfix.toLowerCase().indexOf("a")||~i.postfix.toLowerCase().indexOf("p"))){var s=~i.postfix.toLowerCase().indexOf("a")?this.options.am_text:this.options.pm_text,r=o.h,n=i.h;e=12==n&&12!=r?s==this.options.am_text?this.options.am_text:this.options.pm_text:12==r&&12!=n?s==this.options.am_text?this.options.pm_text:this.options.am_text:n>r?s==this.options.am_text?this.options.pm_text:this.options.am_text:s==this.options.am_text?this.options.am_text:this.options.pm_text}return e},getTimeObject:function(t,e){var i,o=this.parseTime(t,"g:i:A").split(":"),s=o[0],r=o[1];return i=s||r?{h:s,m:r,sep:":",postfix:" "+(e?e:o[2])}:this.options.empty},generateTimes:function(){if(!this.options.times.length){var t=60,e=this.options.increment,i=new Date(2012,1,1,this.options.start_hour-1,t-e),o=[],s=60,r=this.options.end_hour,n=r-this.options.start_hour,a=!1;24==n&&(a=!0);for(var m=0,p=n*(s/e);p>=m;m++){i.setMinutes(i.getMinutes()+e);var h=i.getHours(),l=i.getMinutes(),u=h>11?this.options.pm_text:this.options.am_text;0==h&&(h=12),h>12&&(h-=12),1==(""+l).length&&(l="0"+l);var c=h+":"+l+" "+u;o.push(c)}a&&o.pop(),this.options.times=o}},parseTime:function(t,e){var i,o,e=e||"H:i:s",s=null!==t.match(/p/i),r=t.replace(/[^0-9]/g,"");switch(r.length){case 4:i=parseInt(r.charAt(0)+r.charAt(1),10),o=parseInt(r.charAt(2)+r.charAt(3),10);break;case 3:i=parseInt(r.charAt(0),10),o=parseInt(r.charAt(1)+r.charAt(2),10);break;case 2:case 1:i=parseInt(r.charAt(0)+(r.charAt(1)||""),10),o=0;break;default:return""}if(12==i&&s===!1?i=0:s===!0&&i>0&&12>i&&(i+=12),0>=i&&(i=0),i>=24&&2==(""+i).length){var n=(""+i).split("");i=parseInt(n[0],10),o=parseInt(n[1],10),6>o&&(o+="0")}return(0>o||o>59)&&(o=0),i>=13&&23>=i&&(s=!0),e.replace(/g/g,0===i?"12":"g").replace(/g/g,i>12?i-12:i).replace(/h/g,(""+i).length>1?i>12?i-12:i:"0"+(i>12?i-12:i)).replace(/H/g,(""+i).length>1?i:"0"+i).replace(/i/g,(""+o).length>1?o:"0"+o).replace(/s/g,"00").replace(/A/g,s?this.options.pm_text:this.options.am_text)}}}(jQuery),function(t){t.timeAutocomplete.formatters["24hr"]=function(){this.initialize.apply(this,arguments)},t.timeAutocomplete.formatters["24hr"].prototype={main_instance:null,options:{},default_opts:{increment:15,start_hour:"00",hour_max:24,blur_empty_populate:!0,times:[],empty:{h:"12",m:"00",sep:":",postfix:""}},initialize:function(e,i){this.main_instance=e,this.options=t.extend(!0,{},this.default_opts,i),this.generateTimes()},hook_placeholderValue:function(){return this.main_instance._createStringFromFormat(this.options.empty)},hook_getTime:function(t,e){var i=t.split(this.options.empty.sep),o=i[0],s=i[1];return new Date(e[0],e[1],e[2],o,s).getTime()},hook_getTimeObjectFromHis:function(t){var e=t.split(":"),i=e[0],o=e[1],s={h:i,m:o,sep:this.options.empty.sep};return s},hook_filterSource:function(e){var i=this;return e=e[0],function(i,o){return function(s,r){var n=t.trim(e.value);1==s.term.length&&10>s.term.substr(0,1)&&(s.term="0"+s.term);var a=t.ui.autocomplete.escapeRegex(s.term),m=RegExp("^"+a,"i"),p=[];n&&(p=t.grep(i,function(t){return 0==t.substr(0,1)&&1==t.length&&(t=t.substr(1)),m.test(t)})),r(p);var h=n.toLowerCase();!p.length&&h.length>5&&o.main_instance.el.val(h.substr(0,5))}}(i.options.times,i)},hook_blurEmpty:function(){return this.options.blur_empty_populate?this.main_instance._createStringFromFormat(this.options.empty):""},hook_readMind:function(t){return t=t.toLowerCase(),this.getTimeObject(t)},hook_getUsableTimeValue:function(t){return t+":00"},getTimeObject:function(t){var e="",i="",o="";if(~t.indexOf("h")){var s=t.split("h");e=s[0]?s[0]:this.options.empty.h,i=s[1]?s[1]:this.options.empty.m}else{var r=t.replace(/[^\d]/g,"");r=r.split(""),4==r.length?(e=r[0]+r[1],i=r[2]+r[3]):3==r.length?(e="0"+r[0],i=r[1]+r[2]):2==r.length?(e=r.join(""),i="00"):1==r.length&&(e=r.join(""),i="00")}return e>24&&"00"==i&&(e=e.split(""),i=e[1]+"0",e="0"+e[0]),1==e.length&&(e="0"+e),1==i.length&&(i+="0"),o=e||i?{h:e,m:i,sep:this.options.empty.sep}:this.options.empty},generateTimes:function(){if(!this.options.times.length){for(var t=60,e=this.options.increment,i=new Date(2012,1,1,this.options.start_hour-1,t-e),o=[],s=60,r=this.options.hour_max,n=0,a=r*(s/e);a>n;n++){i.setMinutes(i.getMinutes()+e);var m=i.getHours(),p=i.getMinutes();1==(""+m).length&&(m="0"+m),1==(""+p).length&&(p="0"+p);var h=m+this.options.empty.sep+p;o.push(h)}this.options.times=o}}}}(jQuery),function(t){t.timeAutocomplete.formatters.french=function(){this.initialize.apply(this,arguments)},t.timeAutocomplete.formatters.french.prototype=t.extend(!0,{},t.timeAutocomplete.formatters["24hr"].prototype,{default_opts:{empty:{sep:"h"}},hook_getUsableTimeValue:function(t){return t.replace(this.options.empty.sep,":")+":00"}})}(jQuery);


(function(e,i){"use strict";function t(t,o){var d=this;d.$el=e(t),d.el=t,d.$el.bind("destroyed",e.proxy(d.teardown,d)),d.$window=e(i),d.$clonedHeader=null,d.$originalHeader=null,d.isCloneVisible=!1,d.leftOffset=null,d.topOffset=null,d.init=function(){d.options=e.extend({},l,o),d.$el.each(function(){var i=e(this);i.css("padding",0),d.$originalHeader=e("thead:first",this),d.$clonedHeader=d.$originalHeader.clone(),d.$clonedHeader.addClass("tableFloatingHeader"),d.$clonedHeader.css({position:"fixed",top:0,"z-index":1,display:"none"}),d.$originalHeader.addClass("tableFloatingHeaderOriginal"),d.$originalHeader.after(d.$clonedHeader),e("th",d.$clonedHeader).on("click."+n,function(){var i=e("th",d.$clonedHeader).index(this);e("th",d.$originalHeader).eq(i).click()}),i.on("sortEnd."+n,d.updateWidth),d.$printStyle=e('<style type="text/css" media="print">.tableFloatingHeader{display:none !important;}.tableFloatingHeaderOriginal{visibility:visible !important;}</style>'),e("head").append(d.$printStyle)}),d.updateWidth(),d.toggleHeaders(),d.bind()},d.destroy=function(){d.$el.unbind("destroyed",d.teardown),d.teardown()},d.teardown=function(){e.removeData(d.el,"plugin_"+n),d.unbind(),d.$clonedHeader.remove(),d.$originalHeader.removeClass("tableFloatingHeaderOriginal"),d.$originalHeader.css("visibility","visible"),d.$printStyle.remove(),d.el=null,d.$el=null},d.bind=function(){d.$window.on("scroll."+n,d.toggleHeaders),d.$window.on("resize."+n,d.toggleHeaders),d.$window.on("resize."+n,d.updateWidth)},d.unbind=function(){d.$window.off("."+n,d.toggleHeaders),d.$window.off("."+n,d.updateWidth),d.$el.off("."+n),d.$el.find("*").off("."+n)},d.toggleHeaders=function(){d.$el.each(function(){var i=e(this),t=isNaN(d.options.fixedOffset)?d.options.fixedOffset.height():d.options.fixedOffset,n=i.offset(),l=d.$window.scrollTop()+t,o=d.$window.scrollLeft();if(l>n.top&&n.top+i.height()>l){var a=n.left-o;if(d.isCloneVisible&&a===d.leftOffset&&t===d.topOffset)return;d.$clonedHeader.css({top:t,"margin-top":0,left:a,display:"block"}),d.$originalHeader.css("visibility","hidden"),d.isCloneVisible=!0,d.leftOffset=a,d.topOffset=t}else d.isCloneVisible&&(d.$clonedHeader.css("display","none"),d.$originalHeader.css("visibility","visible"),d.isCloneVisible=!1)})},d.updateWidth=function(){e("th",d.$clonedHeader).each(function(i){var t=e(this),n=e("th",d.$originalHeader).eq(i);this.className=n.attr("class")||"",t.css({"min-width":n.width(),"max-width":n.width()})}),d.$clonedHeader.css("width",d.$originalHeader.width())},d.init()}var n="stickyTableHeaders",l={fixedOffset:0};e.fn[n]=function(i){return this.each(function(){var l=e.data(this,"plugin_"+n);l?"string"==typeof i&&l[i].apply(l):"destroy"!==i&&e.data(this,"plugin_"+n,new t(this,i))})}})(jQuery,window);


    var ScheduleView;

    
    $(function () {

        new Shifts.Tooltip('.employee-notes');
        new Shifts.Tooltip('.employee-shift-notes');
        new Shifts.Views.Schedules.List({
            el: '.nice-list'
        });

        $('#schedule-table').stickyTableHeaders();

        // The day graph button
        $('a.day-graph-btn').on(Shifts.Device.getClickEvent(), function () {

            var $el = $(this);
            $el.addClass('loading');

            var data = $el.data();
            var day = data.dayHeading;
            var post_data = [];
            var $td = $('td.' + day);

            if(is_shift_blocks){
                $td.each(function(){
                    var data = ScheduleView.getShiftBlockDataFromCell($(this));
                    $(this).find('.sched_anchor:visible').each(function(){
                        post_data.push({
                            shift_friendly: data.shift_friendly,
                            role: data.role_name,
                            role_id: data.role_id,
                            name: $(this).data('name'),
                            shift_notes: $.trim($(this).parents('.sched-box-info').find('.shift_notes').val()),
                            start: data.start,
                            end: data.end
                        })
                    });
                });
            } else {
                $td.each(function(){
                    var $sched_box_visible = $(this).find('.sched-box-info:visible');
                    var name = $(this).parents('tr').eq(0).find('td.name-col .name').text();
                    $sched_box_visible.each(function () {
                        var $time_input = $(this).find('input.sched_input');
                        // Edit permissions
                        if ($time_input.length) {
                            var time = $time_input.val();
                            var shift_notes = $(this).find('input.shift_notes').val();
                            var role = $(this).find('.role_label').attr('title');
                            var role_id = $(this).attr('data-role-style');
                            var start = $(this).find('.sched_anchor').data('start');
                        }

                        if (time != '0:00-0:00') {
                            post_data.push({
                                shift_friendly: $.trim(time),
                                role: $.trim(role),
                                name: $.trim(name),
                                role_id: role_id,
                                shift_notes: $.trim(shift_notes),
                                start: start
                            })
                        }
                    });
                });
            };

            $.ajax({
                data: {
                    date: data.dateYmd,
                    user_data: post_data
                },
                type: 'post',
                url: Shifts.base_url + 'schedules/day_graph',
                success: function (res) {
                    $el.removeClass('loading');
                    $('#day-graph-dialog').html(res).dialog({
                        modal: true,
                        width: 940,
                        title: data.dateFriendly
                    });
                }
            });

            return false;

        });

    });

    $(function () {
        new Shifts.Tooltip('td.payable-hours');
        new Shifts.Tooltip('.add-shift[title]');

        new Shifts.Tooltip('.schedule-holiday');
        ScheduleView = new Shifts.Schedule.View({
            time_format: (Shifts.current_lang == 'fr' ? '24hr' : 'ampm'),
            is_shift_blocks: is_shift_blocks
        });
        ScheduleView.bindDatePickerModal({
            day_key: 0,
            week: "2014-04-06"        });
        $('td.day').delegate('.sched_input', 'blur',function () {
            window.schedInputBlurHandler.apply(this, arguments);
        }).delegate('.sched_anchor, .role_label', 'click', function () {
            var data = $(this).data();
            ScheduleView.editShift($(this));
            return false;
        });

        // Publish button shortcut
        $('a.publish-text').on('click', function(){
            $('#createschedbtn').trigger('click');
            return false;
        });
    });



    var clicked_save = false;
    $('#createschedbtn').bind('click.TrackUnpublished', function () {
        clicked_save = true;
    });
