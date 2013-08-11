// object type: 
// 1. blob : real data
// 2. tree : contain blob or tree, like folder in file system
// 
// 3. link : pointing to object, like soft link in file system

var crypto = require('crypto');
var storage = require('./sqliteDAO');

// save object when it is generated
function save(obj) {
    storage.insertObject(obj);
    return obj;
}

function getBaseObject( that ) {
    if (that === undefined) {
        var that = {};
    }
    if (that.type === undefined) that.type = "";
    that.hash = function() {
        return hash(that);
    };
    that.json = function() {
        return json(that);
    };
    that.getType = function() {
        return that.type;
    };

    return that;
}

var objectInfo = {
    BLOB: function(that) {
        that.type = "BLOB";
        if (that.text === undefined) that.text = "";
        that.setText = function(text) {
            that.text = text;
            save(that);
        };
        return save(that);
    },
    TREE: function(that) {
        that.type = "TREE";
        if (that.list === undefined) that.list = []; // list order is importnat
        that.addToList = function( obj, pos ) {  //position: // 0: beginning // -1 : end // int : some place in the tree
            pos = typeof pos !== 'undefined' ? pos : 0;  // default add to the beginning of a lise
            if (pos > that.list.length || pos < 0) {
                pos = that.list.length;
            }
            that.list.splice( pos, 0, obj.hash() );
            return save(that);
        };
        that.removeFromList = function( pos ) {
            that.list.splice(pos, 1);
            return save(that);
        };
        return save(that);
    },
    MARK: function(that) { // mark can be used in todo list
        that.type = "MARK";
        if (that.set === undefined) that.set = {};
        return save(that);
    },
    LINK: function(that) {
        that.type = "LINK";
        if (that.name === undefined) that.name = ""; // the name of the link, like the directory name
        if (that.target === undefined) that.target = ""; // cat point to object (hard) or link (soft)
        if (that.softLink === undefined) that.softLink = false;
        if (that.mark === undefined) that.mark = "";  // a pointer to marks, see the comment in mark type
        return save(that);
    },
};

function newObject(type, obj) {
    if (objectInfo[type] !== undefined) {
        return new objectInfo[type](getBaseObject( obj ));
    }
    else {
        throw "type[" + type + "] not found in objectInfo, not supported";
    }
}

function json(object) {
    return JSON.stringify(object);
}

function hash(object) {
    var s = object.json();
    return crypto.createHash("sha1").update(s).digest('hex');
}

function wireObject( obj ){
    return( newObject(obj.type, obj) );
}

exports.newObject = newObject;
exports.wireObject = wireObject;

// ------------------------ test ----------------------------

function testNewObject() {
    var blob = newObject("BLOB");
    blob.setText("hello world");
    console.log( blob.hash(), blob.json() );
    
    var tree = newObject("TREE");
    var mark = newObject("MARK");
    var link = newObject("LINK");
    console.log(blob.hash(), tree.hash(), mark.hash(), link.hash());
    var other = newObject("OTHER_ERROR");
}
function testAddTree() {
    var a = newObject("TREE");
    var b = newObject("BLOB"); b.setText("first");
    var c = newObject("BLOB"); c.setText("last");
    var d = newObject("BLOB"); d.setText("middle");
    a.addToList( b, 0 );
    a.addToList( c, -1);
    a.addToList( d, 1 );
    console.log(b.hash(), c.hash(), d.hash());
    console.log(a.json());
}
//testNewObject();
//testAddTree();
