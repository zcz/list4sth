(function($) {

    // export function
    $.addTextEvent = addTextEvent;
    $.sortListByDate = sortListByDate;
    
    var initFlag = false;
    
	function init() {
        
        $("div#wrap").prepend('<div id="calendar"></div>');
        $("div#treeBlock").addClass("limitWidth_420");
        
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
    
    function parseEventFromString( text ) {
        function trim( s ) {
            return s.replace(/^\s+|\s+$/g, '');    
        }
        var validDate = /^([a-z0-9A-z,\._\- :\/]+--){1}.*$/g;
        var delimeter = "--";
        
        if (validDate.test(text) === true) {
            var s = text;
            var dateString = s.slice(0, s.indexOf( delimeter ) );    
            var textString = s.slice(s.indexOf( delimeter ) + delimeter.length);
            textString=trim(textString);
            var theDate = Date.parse(dateString);
            if (theDate === null) {
                alert("no date found in string: \"" + s + "\"");
                return null;
            } else {
                if (theDate.between( Date.today().addDays(-30), Date.today().addDays(30) ) === false) {
                    alert("entry: \"" + s + "\" is not within 30 days, is it correct?" );
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
        var event = parseEventFromString(text);
        if (event !== null) {
            if (initFlag === false) {
                init();
                initFlag = true;
            }
            $('#calendar').fullCalendar("addEventSource", [event]);
            return $.datepicker.formatDate('dd, M DD', event.start) + " -- " + event.title;
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



