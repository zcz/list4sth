$(function() {

    var id = $("#expList").find("ul li").attr("hash");
    var linkName = $("#expList").attr("linkName");
    expand($("#expList").find("ul"), id);
    
    function expand( holder, id) {
        var hash = holder.find("#"+id).attr("hash");
        $.get('JSON/'+hash, function(data) {
            holder.find("#"+id).html( prepareElement(data.text, id, hash) );
            prepareAppend( holder.find("#"+id).find(".appendLink") );
            prepareEdit( holder.find("#"+id).find(".editLink") );
            prepareInsert( holder.find("#"+id).find(".insertLink") );
            prepareHash( holder.find("#"+id).find(".hashLink"));
            
            if (data.list.length > 0) {
                var idd = "";
                var i = 0;
                for ( i = 0; i < data.list.length; ++i) {
                    idd = prepareChildId(id, i);
                    holder.find("#"+id).append("<ul><li id=" + idd +" hash=" + data.list[i]+ "></li></ul>");
                };
                for ( i = 0; i < data.list.length; ++i) {
                    idd = prepareChildId(id, i);
                    expand(holder.find("ul"), idd);
                }
            }
        });
    }

    function prepareElement( text, uri, hash ) {
        var editUri = linkName + "/edit/" + uri;
        var removeUri = linkName + "/remove/" + uri;
        var appendUri = linkName + "/append/" + uri;
        var insertUri = linkName + "/insert/" + uri;
        var s = 
            "<div>"+
                "<span style='padding-right:10px' class='text'>" + text + "</span>" +
                "<span style='padding-right:10px'>"+
                    "<a rel='"+editUri+"' href='' title='edit this object' class='editLink' >E</a>"+
                    "&nbsp;|&nbsp;" + 
                    "<a rel='"+appendUri+"' href='' title='append to this object' class='appendLink' >A</a>"+
                    "&nbsp;|&nbsp;" + 
                    "<a rel='"+insertUri+"' href='' title='insert into this object' class='insertLink' >T</a>"+
                    "&nbsp;|&nbsp;" +                     
                    "<a href='"+removeUri+"' title='remove this object' >R</a>" +
                    "&nbsp;|&nbsp;" +                     
                    "<a rel='"+hash+"' href='' title='show object hash' class='hashLink' >H</a>" +
                "</span>"+    
            "</div>";
        return s;
    }
    
    function prepareAppend( holder ) {
        holder.click( function() {
            //alert($(this).attr("rel"));
            if (this.visitted === undefined) {
                this.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                $(this).parent().parent().parent().after(form);
                form.find("input").focus();
            }
            return false;
        });
    }
    
    function prepareEdit( holder ) {
        holder.click( function() {
            //alert($(this).attr("rel"));
            if (this.visitted === undefined) {
                this.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                //alert("content:"  + $(this).parent().parent().find(".text").text() );
                $(this).parent().parent().after(form);
                $(this).parent().parent().hide();
                form.find("input").val( $(this).parent().parent().find(".text").text() ).focus();
            }
            return false;
        });
    }
    
    function prepareInsert( holder ) {
        holder.click( function() {
            if (this.visitted === undefined) {
                this.visitted = true;
                var form = $( ".formTmp" ).clone().removeClass("formTmp");
                form.attr('action', $(this).attr("rel"));
                
                $(this).parent().parent().append(form);
                form.find("input").focus();
            }
            return false;
        });
    }
    
    function prepareHash( holder ) {
        holder.click( function() {
            if (this.showIt === undefined) {
                this.showIt = true;
                var s = "<span class='hashText'>[" + $(this).attr("rel") + "]</span>";
                $(this).parent().parent().append(s);
            } else {
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