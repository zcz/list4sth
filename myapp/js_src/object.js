// object type: 
// 1. tree : contain blob or tree, like folder in file system
// 2. link : pointing to object, like soft link in file system

var crypto = require('crypto');
var storage = require('./sqliteDAO');

// save object when it is generated
function save(obj) {
    //console.log("save called: " + obj.getType());
    if( obj.getType() === "TREE" || obj.getType() === "LINK") {
        storage.insertObject( obj );
    }
    if (obj.getType() === "USER") {
        storage.saveUser( obj );
    }
    return obj;
}

function getBaseObject( that ) {
    if (that === undefined || that === null) {
        var that = {};
    }
    if (that.type === undefined) that.type = "";
    
    that.hash = function () {
        var s = that.json();
        return crypto.createHash("sha1").update(s).digest('hex');
    };
    that.json = function () {
        return JSON.stringify(that);
    };
    that.getType = function() {
        return that.type;
    };
    return that;
}

var objectInfo = {
    TREE: function(that) {
        that.type = "TREE";
        // text element, used to be in BLOB object
        if (that.text === undefined) that.text = that.hash();
        
        that.setText = function(text) {
            that.text = text;
            return save(that);
        };
        // List element contain subtrees
        if (that.list === undefined) that.list = []; // list order is importnat
        that.addToList = function( obj, pos ) {  //position: // 0: beginning // -1 : end // int : some place in the tree
            pos = typeof pos !== 'undefined' ? pos : 0;  // default add to the beginning of a lise
            if (pos > that.list.length || pos < 0) {
                pos = that.list.length;
            }
            obj = toTREE( obj );
            that.list.splice( pos, 0, obj.hash() );
            return save(that);
        };
        that.removeFromList = function( pos ) {
            that.list.splice(pos, 1);
            return save(that);
        };
        that.getKth = function( pos ) {
            //if (pos < 0) return that.list[that.list.length-1];
            if (pos >= that.list.length || pos < 0) {
                return that.hash();
            }
            return that.list[pos];
        };
        that.listReplace = function( pos, hash ) {
            that.list[pos] = hash;
            return save(that);
        };
        return save(that);
    },
    LINK: function(that) {
        that.type = "LINK";
        if (that.prev === undefined) that.prev = null;
        if (that.target === undefined) {
            that.target = newObject("TREE").hash();
        }
        
        that.getPrev = function() {
            return that.prev;
        };
        that.getTarget = function() {
            return that.target;
        };
        that.setTarget = function( hash ) {
            that.prev = that.hash();    // for the list history function
            that.target = hash;
            return save(that);
        };
        //if (that.softLink === undefined) that.softLink = false;  // no need at this point
        //if (that.mark === undefined) that.mark = "";  // a pointer to marks, see the comment in mark type
        return save(that);
    },
    USER: function( that ) {
        that.type = "USER";
        if (that.name === undefined) that.name = "";
        if (that.links === undefined) that.links = {};
        
        that.getName = function( name ) {
            return that.name;
        };
        that.setName = function( name ) {
            that.name = name;
            return save(that);
        };
        that.setLink = function( name, link ) {
            that.links[name] = link.hash();
            return save(that);
        };
        that.removeLink = function( name ) {
            delete that.links[name];
            return save(that);
        };
        that.getLinks = function() {
            return that.links;
        };
        return save(that);
    }
/*  not implemented, lock it
    MARK: function(that) { // mark can be used in todo list
        that.type = "MARK";
        if (that.set === undefined) that.set = {};
        return save(that);
    },
*/
};

// function only accept string and TREE object
function toTREE( obj ) {
    if (typeof obj === 'string') {  // turn string to tree
        var tmp = newObject( "TREE" );
        tmp.setText( obj );
        return tmp;
    }
    if (obj.getType() === 'TREE') {  
        return obj;
    } else {
        throw "erro, toTREE failed: obj=" + JSON.stringify(obj);
    }
}

function newObject(type, obj) {
    // temperal convert from BLOB to TREE
    if (type === "BLOB") {
        type = "TREE";
    } 
    if (objectInfo[type] !== undefined) {
        return new objectInfo[type]( getBaseObject( obj ) );
    }
    else {
        throw "type[" + type + "] not found in objectInfo, not supported";
    }
}

function wireObject( obj ){
    if (typeof obj === "string") {
        obj = JSON.parse(obj);
    }
    return( newObject(obj.type, obj) );
}

exports.newObject = newObject;
exports.wireObject = wireObject;

// ------------------------ test ----------------------------

function testNewObject() {
    var blob = newObject("TREE");
    blob.setText("hello world");
    console.log( blob.hash(), blob.json() );
    
    var tree = newObject("TREE");
    var link = newObject("LINK");
    console.log(blob.hash(), tree.hash(), link.hash());
    //var other = newObject("OTHER_ERROR");
}
function testAddTree() {
    var a = newObject("TREE");
    var b = newObject("TREE"); b.setText("first");
    var c = newObject("TREE"); c.setText("last");
    var d = newObject("TREE"); d.setText("middle");
    a.addToList( b, 0 );
    a.addToList( c, -1);
    a.addToList( d, 1 );
    console.log(b.hash(), c.hash(), d.hash());
    console.log(a.json());
}
function testLinkInit() {
    var link = newObject("LINK");
    link.setName("testLink");
    link.setTarget(newObject("TREE").hash());
    console.log("hash:", link.hash(), "JSON", link.json());
}
//testLinkInit();
//testNewObject();
//testAddTree();