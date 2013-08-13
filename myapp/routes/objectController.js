/*
 * GET list
 */

var manager = require('../js_src/objectManager.js');

function showObject(req, res){
    var hash = req.params[0];  
    var addBegin = req.query.begin;
    var addEnd = req.query.end;

    manager.getObjectShallow(hash,  function(obj) {
        if (addBegin !== undefined) {
            obj = manager.addObjToObj(addBegin, obj, 0);            
            res.redirect('/' + obj.hash());
        }
        if (addEnd !== undefined) {
            obj = manager.addObjToObj(addEnd, obj, -1);
            res.redirect('/' + obj.hash());
        }
        res.render('object', { 
            title: 'Show Object',
            listHash : hash,
            listType : obj.getType(),
            linkName : ".",
        }) } );
};

function getJSON( req, res ) {
    var hash = req.params[0];  
    manager.getObjectShallow(hash,  function(obj) {
        res.json( obj ); 
    });
}

function removeJSON( req, res ) {
    var uri = req.params[0];
    var arr = uri.split(/_/);
    var origin = uri.split(/_/);
    var last = arr.length - 1;
    if (arr.length === 1 || arr.length === 0) {
        res.redirect("/"+"24c64397de58751168bda5e769f9343ee255a9cf");  //empty tree
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
                    res.redirect("/"+tmp.hash());
                }
            });
        } )(arr, 0);
    }
}

exports.showObject = showObject; 
exports.getJSON = getJSON;
exports.removeJSON = removeJSON;
