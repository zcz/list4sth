(function($) {

    // export function
    $.addTextEvent = addTextEvent;
    $.sortListByDate = sortListByDate;
    $.standardizeDate = standardizeDate;
    $.refreshCalender = refreshCalender;
    
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
    
    function parseEventFromString( text, showAlert ) {
        if (showAlert === undefined) showAlert = false;
        function trim( s ) {
            return s.replace(/^\s+|\s+$/g, '');    
        }
        var validDate = /^([a-z0-9A-z,\._\- :\/]+--){1}.*$/g;
        var delimeter = "--";
        
        if (validDate.test(text) === true) {
            var s = text;
            var dateString = s.slice(0, s.indexOf( delimeter ) );    
            var textString = s.slice(s.indexOf( delimeter ) + delimeter.length);
            //textString=trim(textString);
            var theDate = Date.parse(dateString);
            if (theDate === null) {
                if (showAlert) {
                    alert("no date found in string: \"" + s + "\"");                    
                }
                return null;
            } else {
                if (theDate.between( Date.today().addDays(-30), Date.today().addDays(30) ) === false) {
                    if (showAlert){
                        alert("entry: \"" + s + "\" is not within 30 days, is it correct?" );                        
                    }
                }
                var event = {
                    title: textString,
                    start: theDate,
                    allDay: true,
                };
                return event;
            }
        } else {
            return null;
        } 
    }
    
    function addTextEvent( text ) {
        var event = parseEventFromString(text, true);
        if (event !== null) {
            if (initFlag === false) {
                init();
            }
            $('#calendar').fullCalendar("addEventSource", [event]);       
        }
    }
    
    function standardizeDate( text ) {
        var event = parseEventFromString( text );
        if (event !== null) {
            return $.datepicker.formatDate('dd, M DD', event.start) + " --" + event.title;
        } else {
            return text;
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



