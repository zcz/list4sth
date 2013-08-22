(function($) {

    // export function
    $.addTextEvent = addTextEvent;
    
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
        var validDate = /^([a-z0-9A-z,\._ :\/]+\|){1}.*$/g;
        var delimeter = "|";
        
        if (validDate.test(text) === true) {
            var s = text;
            var dateString = s.slice(0, s.indexOf( delimeter ) );    
            var textString = s.slice(s.indexOf( delimeter ) + 1);
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
        }
    }
	
})(jQuery);