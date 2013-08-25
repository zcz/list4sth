(function($) {

    // export function
    $.refreshCalender = refreshCalender;
    $.addTextEvent = addTextEvent;
    $.sortListByDate = sortListByDate;
    $.standardizeDateForForm = standardizeDateForForm;
    
    var initFlag = false;
    
    // do the inverse thing compared with init
    function refreshCalender() {
        if (initFlag === true) {
            $('#calendar').fullCalendar( 'removeEvents' );
            //$("#calendar").remove();
            //$("div#treeBlock").removeClass("limitWidth_420");
            //initFlag = false;
        }
    }
    
	function init() {
        initFlag = true;
        $("div#wrap").prepend('<div id="calendar"></div>');
        $("div#treeBlock").addClass("limitWidth_420");
        $("#endingForm").hide();
        
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: false,
            events : [],
        });
	}
    
    function parseEventFromString( text, showAlert, errorSet ) {
        if (errorSet === undefined) errorSet = { error: true};
        if (showAlert === undefined) showAlert = false;
        function trim( s ) {
            return s.replace(/^\s+|\s+$/g, '');    
        }
        var validDate = /--/g;
        var delimeter = "--";
        
        if (validDate.test(text) === true) {
            var s = text;
            var dateString = s.slice(0, s.indexOf( delimeter ) );    
            var textString = s.slice(s.indexOf( delimeter ) + delimeter.length);
            //textString=trim(textString);
            
            var theDate = Date.parse(dateString);
            if (theDate === null) {
                errorSet.error = true;
                if (showAlert === true) {
                    alert("ERROR: no date found in string: \"" + s + "\"");                 
                }
                return null;
            } else {
                var event = {
                    title: textString,
                    start: theDate,
                    allDay: true,
                };

                
                if (theDate.between( Date.today().addDays(-30), Date.today().addDays(30) ) === false) {
                    if (showAlert === true) {
                        var answer = confirm("ERROE: \"" + s + "\" is not within 30 days, continue?");
                        if (answer === false) {
                            errorSet.error = true;
                        }  
                    }
                }
                return event;                    
            }
        } else {
            return null;
        } 
    }
    
    function addTextEvent( text ) {
        // no need to do validation at this stage, too late
        var event = parseEventFromString(text, false);
        if (event !== null) {
            if (initFlag === false) {
                init();
            }
            $('#calendar').fullCalendar("addEventSource", [event]); 
            console.log("finish adding event");
        }
    }
    
    function standardizeDateForForm( form ) {
        var input = $(form).find("input");
        var text = $(input).val();
        var errorSet = {error : false};
        var event = parseEventFromString( text, true, errorSet );
        if (errorSet.error === false) {
            
            if (event !== null) {
                var s = " --" + event.title;
                if (event.start.getFullYear() !== new Date().getFullYear()) {
                    s = $.datepicker.formatDate('dd M yy', event.start) + s;
                } else {
                    s = $.datepicker.formatDate('dd M DD', event.start) + s;                
                }
                $(input).val( s );                
            }
            $(input).removeClass('ui-state-error');
            return true;
        } else {
            $(input).addClass('ui-state-error');
            return false;
        }
    } 
    
    function sortListByDate(list) {
        // if there is no calander element, return, without sort anything.
        if (initFlag === false) {
            return;
        }
        //sort the list
        var mylist = list;
        var listitems = mylist.children('li').get();
        listitems.sort(function(a, b) {
           var eventA = parseEventFromString($(a).text());
           var eventB = parseEventFromString($(b).text());
           var dateA = new Date(0);
           var dateB = new Date(0);
           if (eventA !== null) {
               dateA = eventA.start;
           }
           if (eventB !== null) {
               dateB = eventB.start;
           }
           return dateA.compareTo(dateB);
        });
        $.each(listitems, function(idx, itm) { mylist.append(itm); });
    }
	
})(jQuery);



