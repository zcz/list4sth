// used to combine the object definition: object.js with DAO

var baseObj = require('./object');
var dao = require('./sqliteDAO');


// function only accept string and TREE object
function toTREE( obj ) {
    if (typeof obj === 'string') {  // turn string to tree
        var tmp = baseObj.newObject( "TREE" );
        tmp.setText( obj );
        return tmp;
    }
    if (obj.getType() === 'TREE') {  
        return obj;
    } else {
        throw "erro, toTREE failed: obj=" + JSON.stringify(obj);
    }
}

function addObjToObj( add, to, pos ) {
    add = toTREE( add );
    to = toTREE( to );
    return to.addToList( add, pos );
}

/*
function getObjectShallow( hash, callback ) {
    return dao.getObjectByHash(hash, function(obj) {
        callback(obj);
    });
}
*/

/*
function removeObject( tree, numberList ) {
    var k = parseInt( numberList.shift(), 10 );
    if (typeof k !== "number" || k.isNaN()) {
        return null;
    }
}
*/

//exports.getObjectShallow = getObjectShallow;
exports.addObjToObj = addObjToObj;

