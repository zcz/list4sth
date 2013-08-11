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
        res.render('list', { 
            title: 'Show Object',
            listHash : hash,
            listType : obj.getType(),
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
    if (arr.length === 1 || arr.length === 0) {
        res.redirect("/"+manager.addObjToObj().hash());
    }
    res.send( arr.join("END<br>") );
}

exports.showObject = showObject; 
exports.getJSON = getJSON;
exports.removeJSON = removeJSON;
