$(function() {

    var id = $("#expList").find("ul li").attr("id");
    expand($("#expList").find("ul"), id);
    
    function expand( holder, id) {
        //console.log("load:"+id);
        $.get('JSON/'+id, function(data) {
            if (data.type === "BLOB") {
                holder.find("#"+id).html(data.text);
            } else {
                holder.find("#"+id).html(id);
                if (data.list.length > 0) {
                    for (var i = 0; i < data.list.length; ++i) {
                        var idd = data.list[i];
                        holder.find("#"+id).append("<ul><li id=" + idd +"></li></ul>");
                        expand(holder.find("ul"), idd);
                    }                    
                }
            }
        });
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