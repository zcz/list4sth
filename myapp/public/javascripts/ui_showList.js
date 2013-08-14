$(function() {

    var id = $("#expList").find("ul li").attr("hash");
    var linkName = $("#expList").attr("linkName");
    expand($("#expList").find("ul"), id);
    
    function expand( holder, id) {
        var hash = holder.find("#"+id).attr("hash");
        $.get('JSON/'+hash, function(data) {
            if (data.type === "BLOB") {
                holder.find("#"+id).html( prepareElement(data.text, id) );
                prepareAppend( holder.find("#"+id).find(".appendLink") );
            } else {
                holder.find("#"+id).html( prepareElement(hash, id) );
                prepareAppend( holder.find("#"+id).find(".appendLink") );
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
            }
            // add onClick listener to the append url
        });
    }

    function prepareElement( text, uri ) {
        var removeUri = linkName + "/remove/" + uri;
        var appendUri = linkName + "/append/" + uri;
        var subtreeUri = linkName + "/subtree/" + uri;
        var s = 
            "<div>"+
                "<span style='padding-right:10px'>" + text + "</span>" +
                "<span>"+
                    "<a rel='"+appendUri+"' href='' title='append a text to this object' class='appendLink' >A</a>"+
                    "&nbsp;|&nbsp;" + 
                    "<a href='"+subtreeUri+"' title='turn this object into a subTree' >T</a>"+
                    "&nbsp;|&nbsp;" +                     
                    "<a href='"+removeUri+"' title='remove this object' >R</a>" + 
                "</span>"+    
            "</div>";
        return s;
    }
    
    function prepareAppend( holder ) {
        holder.click( function() {
            //alert($(this).attr("rel"));
            if (this.visitted === undefined) {
                this.visitted = true;
                var form = $( ".appendFormTmp" ).clone().removeClass("appendFormTmp");
                form.attr('action', $(this).attr("rel"));
                $(this).parent().parent().append(form);
                form.find("input").focus();
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