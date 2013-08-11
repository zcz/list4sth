var baseObj = require('./object');
var dao = require('./sqliteDAO');

function toBLOB( obj ) {
    if (typeof obj === 'undefined') {
        return baseObj.newObject( "BLOB" );
    }
    if (typeof obj === 'string') {
        var tmp = baseObj.newObject( "BLOB" );
        tmp.setText(obj);
        return tmp;
    }
    if (obj.getType() !== 'BLOB') {
        throw "erro, toBLOB failed: obj=" + JSON.stringify(obj);
    } else {
        return obj;
    }
}

function toTREE( obj ) {
    if (typeof obj === 'undefined') {
        return baseObj.newObject( "TREE" );
    }
    if (typeof obj === 'string') {
        obj = toBLOB(obj);
        return addObjToObj( obj, baseObj.newObject("TREE") );
    }
    if (obj.getType() !== 'TREE') {
        throw "erro, toTREE failed: obj=" + JSON.stringify(obj);
    } else {
        return obj;
    }
}

function addObjToObj( add, to, pos ) {
    if (add.getType !== "TREE") {
        add = toBLOB( add );
    }
    to = toTREE( to );
    return to.addToList( add, pos );
}

function getObjectShallow( hash, callback ) {
    return dao.getObjectByHash(hash, function(obj) {
        obj = baseObj.wireObject( obj );
        callback(obj);
    });
}

exports.getObjectShallow = getObjectShallow;
exports.addObjToObj = addObjToObj;

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


