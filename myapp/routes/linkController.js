
/*
 * GET users listing.
 */
 
var manager = require('../js_src/objectManager.js');

function showLink(req, res){
    var linkName = req.params[0];
    manager.loadOrCreateLink(linkName, function(link) {    
        manager.getObjectShallow( link.getTarget(), function( obj ){
            var addBegin = req.query.begin;
            var addEnd = req.query.end;
            if (addBegin !== undefined) {
                obj = manager.addObjToObj(addBegin, obj, 0);  
                link.setTarget( obj.hash() );
                res.redirect("/"+linkName);
            }
            if (addEnd !== undefined) {
                obj = manager.addObjToObj(addEnd, obj, -1);
                link.setTarget( obj.hash() );
                res.redirect("/"+linkName);
            }
            res.render('object', { 
                title: 'List: '+link.getName(),
                listHash : obj.hash(),
                listType : obj.getType(),  
                linkName : linkName,
            })
        })   
    });
};

function removeItem( req, res ) {
    var linkName = req.params.linkName;
    var uri = req.params[0];

    var arr = uri.split(/_/);
    var origin = uri.split(/_/);
    var last = arr.length - 1;
    manager.loadOrCreateLink(linkName, function(link) {        
        if (arr.length === 1 || arr.length === 0) {
            link.setTarget("24c64397de58751168bda5e769f9343ee255a9cf");
            res.redirect("/"+linkName);
            //res.redirect("/"+"24c64397de58751168bda5e769f9343ee255a9cf");  //empty tree
        } else {
            (function findAll( arr, idx ) {
                manager.getObjectShallow( arr[idx], function( obj ) {
                    arr[idx] = obj;
                    if (idx < last) {
                        var id = obj.getKth( arr[idx+1] );
                        arr[idx+1] = id;
                        findAll( arr, idx+1 );
                    }  else {
                        var tmp = arr[last-1].removeFromList(origin[last]);
                        for (var i = last-2; i>=0; --i) {
                            tmp = arr[i].listReplace(origin[i+1], tmp.hash());                        
                        }
                        link.setTarget( tmp.hash() );
                        res.redirect("/"+linkName);
                    }
                });
            } )(arr, 0);
        }
    });
};

exports.showLink = showLink;
exports.removeItem = removeItem;