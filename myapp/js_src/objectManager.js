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

function getObjectShallow( hash, callback ) {
    return dao.getObjectByHash(hash, function(obj) {
        callback(obj);
    });
}

function removeObject( tree, numberList ) {
    var k = parseInt( numberList.shift(), 10 );
    if (typeof k !== "number" || k.isNaN()) {
        return null;
    }
}

function loadOrCreateLink(linkName, callback) {
    var link = baseObj.newObject("LINK");
    link.setName( linkName );
    dao.getObjectByHash(linkName, function(obj) {
        callback(obj);
    }, link);
}

exports.getObjectShallow = getObjectShallow;
exports.addObjToObj = addObjToObj;
exports.loadOrCreateLink = loadOrCreateLink;

function test() {
    var obj = addObjToObj("hello", "world");
    console.log(obj.hash());
    /*
    getObjectShallow( 'f011b0b1f09925e1e3d08cdd18ddcac39919730e', 
        function( obj ) {
            addObjToObj( "haha, first", obj );
            console.log( obj.hash() );
        } );
    */
}
//test();


