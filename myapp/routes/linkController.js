
/*
 * GET users listing.
 */
 
var manager = require('../js_src/objectManager.js');
var dao = require('../js_src/sqliteDAO');

function showAll( req, res ) {
    dao.getAllLink( function( objs ) {
        var a = [];
        for (var i = 0; i<objs.length; ++i) {
            a.push(objs[i].getName());
        }
        res.render('linkList', { 
            title: 'Links' + "(" + objs.length + ")",
            links: a
        });
    } );
}


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
            });
        });   
    });
}



function removeItem( req, res ) {
    var linkName = req.params.linkName;
    var uri = req.params[0];
    
    var arr = uri.split(/_/);
    if (arr.length === 1 || arr.length === 0) {
        manager.loadOrCreateLink(linkName, function(link) {
            dao.removeObject( link );
            res.redirect("/");
        });
    } else {
        findThroughPath( linkName, uri, function(arr, origin, link) {
            var last = arr.length -1;
            var tmp = arr[last-1].removeFromList(origin[last]);
            for (var i = last-2; i>=0; --i) {
                tmp = arr[i].listReplace(origin[i+1], tmp.hash());                        
            }
            link.setTarget( tmp.hash() );
            res.redirect("/"+linkName);
        });
    }
};

function appendItem(req, res) {
    var linkName = req.params.linkName;
    var uri = req.params[0];
    var text = req.query.append; 
    findThroughPath( linkName, uri, function(arr, origin, link) {
        var last = arr.length -1;
        var tmp = manager.addObjToObj(text, arr[last-1], parseInt(origin[last], 10) + 1);        
        for (var i = last-2; i>=0; --i) {
            tmp = arr[i].listReplace(origin[i+1], tmp.hash());                        
        }
        link.setTarget( tmp.hash() );
        res.redirect("/"+linkName);
    });
}

function subtreeItem(req, res) {
    var linkName = req.params.linkName;
    var uri = req.params[0];
    findThroughPath( linkName, uri, function(arr, origin, link) {
        var last = arr.length -1;
        var tmp = manager.addObjToObj(arr[last], undefined, 0);        
        for (var i = last-1; i>=0; --i) {
            tmp = arr[i].listReplace(origin[i+1], tmp.hash());                        
        }
        link.setTarget( tmp.hash() );
        res.redirect("/"+linkName);
    });    
};

function findThroughPath( linkName, uri, callback ){
    var arr = uri.split(/_/);
    var origin = uri.split(/_/);
    var last = arr.length - 1;
    manager.loadOrCreateLink(linkName, function(link) {        
        (function findAll( arr, idx ) {
            manager.getObjectShallow( arr[idx], function( obj ) {
                arr[idx] = obj;
                if (idx < last) {
                    var id = obj.getKth( arr[idx+1] );
                    arr[idx+1] = id;
                    findAll( arr, idx+1 );
                }  else {
                    if (typeof callback === 'function') {
                        callback( arr, origin, link );
                    }
                }
            });
        } )(arr, 0);
    });
}

exports.showLink = showLink;
exports.removeItem = removeItem;
exports.showAll = showAll;
exports.appendItem = appendItem;
exports.subtreeItem = subtreeItem;