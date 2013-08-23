$(function() {

    var linkName = $("#expList").attr("linkName");
    var objectHash = $("#expList").attr("hash");
    var waitingList = {};
    expand($("#expList"), objectHash, objectHash, 0);
    
    //shallow sort
    var refreshId = setInterval( function() 
    {
       if (JSON.stringify(waitingList) === "{}") {
            clearInterval(refreshId);
            $.sortListByDate($("#expList").children('ul'));
        } 
    }, 100);
    
    
    function expand( holder, id, hash, depth) {
        //var hash = holder.find("#"+id).attr("hash");
        waitingList[id] = id;
        $.ajax({
            type: "GET",
            cache: true,
            url: '/JSON/'+hash, 
            success : function(data) {
                if (depth > 0) {
                    holder.html( prepareElement(data.text, id, hash) );
                    prepareAppend( holder.find(".appendLink"), holder );
                    prepareEdit( holder.find(".editLink"), holder );
                    prepareInsert( holder.find(".insertLink"), holder );
                    prepareHash( holder.find(".hashLink"), holder);    
                    prepareEditEntry( holder );
                }
                delete waitingList[id];
                
                if (data.list.length > 0) {
                    var idd = "";
                    var i = 0;
                    holder.append("<ul></ul>");
                    holder = holder.find("ul");
                    for ( i = 0; i < data.list.length; ++i) {
                        idd = prepareChildId(id, i);
                        holder.append("<li id=" + idd +" hash=" + data.list[i]+ "></li>");
                    };
                    for ( i = 0; i < data.list.length; ++i) {
                        idd = prepareChildId(id, i);
                        expand(holder.find("#"+idd), idd, data.list[i], depth+1);
                    }
                }
            },
            async : true
        });
    }

    function prepareElement( text, uri, hash ) {
        // the addTextEvent may return true, indicating entry is added to the calender
        text = $.addTextEvent(text);
        
        var editUri = linkName + "/edit/" + uri;
        var removeUri = linkName + "/remove/" + uri;
        var appendUri = linkName + "/append/" + uri;
        var insertUri = linkName + "/insert/" + uri;
        var s = 
            "<div>"+
                "<span style='padding-right:10px' class='textEntry'>" + text + "</span>" +
                "<span class='editEntry'>"+ 
                    "<a href='"+removeUri+"' title='remove this object' >R</a>" +
                "</span>" +
                "<span style='padding-right:10px' class='editEntry optionalEntry'>"+
                    "&nbsp;|&nbsp;" +                     
                    "<a rel='"+editUri+"' href='' title='edit this object' class='editLink' >E</a>"+
                    "&nbsp;|&nbsp;" + 
                    "<a rel='"+appendUri+"' href='' title='append to this object' class='appendLink' >A</a>"+
                    "&nbsp;|&nbsp;" + 
                    "<a rel='"+insertUri+"' href='' title='insert into this object' class='insertLink' >T</a>"+
                    "&nbsp;|&nbsp;" +                     
                    "<a rel='"+hash+"' href='' title='show object hash' class='hashLink' >H</a>" +
                "</span>"+    
            "</div>";
        return s;
    }
    
    function prepareEditEntry (holder) {
        $(holder).find(".optionalEntry").hide();
        $(holder).find(".editEntry").hover( function(){
            $(this).parent().find(".optionalEntry").show();
        }, 
        function() {
            if (holder.visitted !== true){
                $(this).parent().find(".optionalEntry").hide(); 
            }
        });
    }
    
    function prepareAppend( holder, parent ) {
        holder.click( function() {
            //alert($(this).attr("rel"));
            if (this.visitted === undefined) {
                this.visitted = true;
                parent.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                $(this).parent().parent().parent().after(form);
                form.find("input").focus();
            }
            return false;
        });
    }
    
    function prepareEdit( holder, parent ) {
        holder.click( function() {
            //alert($(this).attr("rel"));
            if (this.visitted === undefined) {
                this.visitted = true;
                parent.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                $(this).parent().parent().after(form);
                $(this).parent().parent().hide();
                form.find("input").val( $(this).parent().parent().find(".textEntry").text() ).focus();
            }
            return false;
        });
    }
    
    function prepareInsert( holder, parent ) {
        holder.click( function() {
            if (this.visitted === undefined) {
                this.visitted = true;
                parent.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                
                $(this).parent().parent().append(form);
                form.find("input").focus();
            }
            return false;
        });
    }
    
    function prepareHash( holder, parent ) {
        holder.click( function() {
            if (this.showIt === undefined) {
                this.showIt = true;
                parent.visitted = true;
                var s = "<span class='hashText'>[" + $(this).attr("rel") + "]</span>";
                $(this).parent().parent().append(s);
            } else {
                parent.visitted = false;
            	$(this).parent().parent().find(".hashText").toggle();            	
            }
            return false;
        });
    }
    
    function prepareChildId( id, i ) {
        return id + "_" + i;
    }
});

var showObject = function(name, object) {
    if (name === undefined) return;
    if (object === undefined) {
        object = name;
        name = "";
    };
    alert(name + " : " + JSON.stringify(object));
};