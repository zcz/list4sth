(function($) {

    // export function
    $.daoLoadObject = daoLoadObject;
    $.daoSaveObjects = daoSaveObjects;
    
    var allObject = {};
    
    function daoLoadObject( hash, callback ) {
        if (allObject[hash] !== undefined) {
            callback( allObject[hash] );
        } else {
            $.ajax({
                type: "GET",
                url: '/JSON/'+hash, 
                success : function( data ) {
                    allObject[hash] = data;
                    callback( data );
                },
            });
        }
    }
    
    function daoSaveObjects( objects ) {
        $.extend( allObject, objects );
    }
    
})(jQuery);



