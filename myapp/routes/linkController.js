
/*
 * GET users listing.
 */
 
var manager = require('../js_src/objectManager.js');
var dao = require('../js_src/sqliteDAO');
var utility = require("../js_src/utility.js");

function showLink(req, res){    
    loadObject( req, function( user, link, obj, userName, linkName ) {
        res.render('treeAndCalender', { 
            title: 'List: '+ linkName,
            objectHash : obj.hash(), 
            linkName : encodeURIComponent(linkName),
        }); 
    });
}


function removeItem( req, res ) {
    var uri = req.params[0];
    var arr = uri.split(/_/);
    
    loadObject( req, function( user, link, obj, userName, linkName ) {
        if (arr.length === 1 || arr.length === 0) {
            // remove the whole link
            user.removeLink( linkName );
            res.redirect(utility.getUrl( userName ));
        } else {
            findThroughPath( uri, function(arr, origin ) {
                var last = arr.length-1;
                arr[last-1] = arr[last-1].removeFromList( origin[last] );
                var whole = prepareResponseObjectArray( arr, origin, last-2 ); 
                setLinkTarget(user, link, arr[0], linkName); 
                res.json( whole );
            });
        }
    });
}

function appendItem(req, res) {
    var uri = req.params[0];
    var text = req.query.text; 
    loadObject( req, function( user, link, obj, userName, linkName ) {
        findThroughPath( uri, function(arr, origin) {
            loadTextObject( text, function( text ) {
                var last = arr.length-1;
                arr[last-1] = manager.addObjToObj(text, arr[last-1], parseInt(origin[last], 10) + 1);    
                var whole = prepareResponseObjectArray( arr, origin, last-2 ); 
                setLinkTarget(user, link, arr[0], linkName); 
                res.json( whole );
            });
        });
    });
}

function insertItem(req, res) {
    var uri = req.params[0];
    var text = req.query.text; 
    loadObject( req, function( user, link, obj, userName, linkName ) {
        findThroughPath( uri, function(arr, origin) {
            loadTextObject( text, function( text ) {           
                var last = arr.length -1;
                arr[last] = manager.addObjToObj(text, arr[last], 0);        
                var whole = prepareResponseObjectArray( arr, origin, last-1 ); 
                setLinkTarget(user, link, arr[0], linkName); 
                res.json( whole );
            });
        });    
    });
}

function editItem( req, res ) {
    var uri = req.params[0];
    var text = req.query.text; 
    loadObject( req, function( user, link, obj, userName, linkName ) {
        findThroughPath( uri, function(arr, origin) {
            loadTextObject( text, function( text ) {
                var last = arr.length - 1;
                if (typeof text === "string") {
                    arr[last].setText( text );
                } else {
                    arr[last] = text;
                }
                var whole = prepareResponseObjectArray( arr, origin, last-1 ); 
                
                setLinkTarget(user, link, arr[0], linkName); 
                res.json( whole );
            });
        });
    });
}

function loadTextObject( text, callback ) {
    var link = /^\[TREE:([a-f0-9]{40})\]$/g;
    var hash = /([a-f0-9]{40})/g;

    if (link.test(text) === true) {
        // the text is a tree hash, e.g. "[TREE:4e3ced2d13614fd67c2a1c2c046b1ea888adda8b]"
        var treeHash = text.match( hash )[0];
        dao.getObjectByHash( treeHash, function( obj ) {
            callback( obj );
        } );
    } else {
        callback( text );   
    }
}

function loadObject(req, callback) {
    var userName = req.params.userName;
    var linkName = decodeURIComponent(req.params.linkName);

    // get user
    dao.getUserByName( userName, function( user ) {
        var linkHash = user.getLinks()[linkName];
        //get link
        dao.getObjectByHash( linkHash, function( link ) {
            var linkTargetHash = link.getTarget();
            //get root object
            dao.getObjectByHash( linkTargetHash, function( obj ){
                callback(user, link, obj, userName, linkName);
            });
        });
    });
}

function setLinkTarget( user, link, obj, linkName ) {
    link.setTarget( obj.hash() );
    user.setLink(linkName, link);    
}

function findThroughPath( uri, callback ){
    var arr = uri.split(/_/);
    var origin = uri.split(/_/);
    var last = arr.length - 1;
    
    (function findAll( arr, idx ) {
        dao.getObjectByHash( arr[idx], function( obj ) {
            arr[idx] = obj;
            if (idx < last) {
                var id = obj.getKth( arr[idx+1] );
                arr[idx+1] = id;
                findAll( arr, idx+1 );
            }  else {
                if (typeof callback === 'function') {
                    callback( arr, origin );
                }
            }
        });
    } )(arr, 0);
}

function prepareResponseObjectArray( arr, origin, pos ) {
    var i;
    var whole = {
        rootHash : "",
        objects : {},
    };
    for (i = pos; i>=0; --i) {
        arr[i] = arr[i].listReplace(origin[i+1], arr[i+1].hash());                        
    }
    for (i = 0; i < arr.length; ++i ) {
        whole.objects[arr[i].hash()] = arr[i];
        //console.log("add hash:"+arr[i].hash()+" obj:"+arr[i]);
    }
    whole.rootHash = arr[0].hash();
    return(whole);
}

exports.showLink = showLink;
exports.removeItem = removeItem;
exports.appendItem = appendItem;
exports.insertItem = insertItem;
exports.editItem = editItem;

