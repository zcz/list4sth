$(function() {

    var id = $("#expList").find("ul li").attr("hash");
    expand($("#expList").find("ul"), id);
    
    function expand( holder, id) {
        var hash = holder.find("#"+id).attr("hash");
        $.get('JSON/'+hash, function(data) {
            if (data.type === "BLOB") {
                holder.find("#"+id).html( prepareElement(data.text, "remove/"+id) );
            } else {
                holder.find("#"+id).html( prepareElement(id, "remove/"+id) );
                if (data.list.length > 0) {
                    var idd = "";
                    var i = 0;
                    for ( i = 0; i < data.list.length; ++i) {
                        idd = id + "_" + i;
                        holder.find("#"+id).append("<ul><li id=" + idd +" hash=" + data.list[i]+ "></li></ul>");
                        //expand(holder.find("ul"), idd);
                    };
                    for ( i = 0; i < data.list.length; ++i) {
                        idd = id + "_" + i;
                        expand(holder.find("ul"), idd);
                    }
                }
            }
        });
    }

    function prepareElement( text, uri ) {
        var s = 
            "<div>"+text+
                "<span>"+
                    "<a href='"+uri+"' style='padding-left: 10px;'>remove</a>"+
                "</span>"+    
            "</div>";
        return s;
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