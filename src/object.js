// object type: 
// 1. blob : real data
// 2. tree : contain blob or tree, like folder in file system
// 3. link : pointing to object, like soft link in file system

var crypto = require('crypto');

var objectInfo = {
  BLOB : function() {
    var that = {};
    that.type = "BLOB";
    that.text = "";
    that.setText = function( text ) {
        that.text = text;
    };
    return that;
  },
  TREE : function() {
    var that = {};
    that.type = "TREE";
    // list order is importnat
    that.list = [];
    return that;
  },
  // mark can be used in todo list
  MARK : function() {
    var that = {};
    that.type = "MARK";
    that.set = {};
    return that;
  },
  LINK : function() {
    var that = {};
    that.type = "LINK";
    // the name of the link, like the directory name
    that.name = "";
    // cat point to object (hard) or link (soft)
    that.target = "";
    that.softLink = false;
    // a pointer to marks, see the comment in mark type
    that.mark = "";
    return that;
  },
};

function newObject( type ) {
  if ( objectInfo[type] !== undefined ) {
    return new objectInfo[type]();
  } else {
    throw "type["+type+"] not found in objectInfo, not supported";
  }
}

function hash( object ) {
  var s = JSON.stringify( object );
  return crypto.createHash("sha1").update( s ).digest('hex');
}

exports.newObject = newObject;
exports.hash = hash;

// ------------------------ test ----------------------------

function test() {
  var blob = newObject( "BLOB" );
  var tree = newObject( "TREE" );
  var mark = newObject( "MARK" );
  var link = newObject( "LINK" );
  console.log( hash(blob), hash(tree), hash(mark), hash(link));
  var other = newObject( "OTHER_ERROR" );
};
//test();
