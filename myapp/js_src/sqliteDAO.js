// sqlite database implementation, contain following tables
//1. object( hash(PK), json ) contains {BLOB, TREE, MARK}
//2. link( name(PK), json ) contains {LINK} 

var db = initDB("./test.db");
var baseObj = require('./object');

function initDB(fileLocation) {
    var fs = require("fs");
    var exists = fs.existsSync(fileLocation);
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(fileLocation, "w");
    }
    var sqlite3 = require("sqlite3").verbose();
    var db = new sqlite3.Database(fileLocation);

    db.run("CREATE TABLE IF NOT EXISTS object (hash TEXT PRIMARY KEY, json TEXT)",
        function(err) {
            console.log('create table "object", err', err);
        });
        
    db.run("CREATE TABLE IF NOT EXISTS link (name TEXT PRIMARY KEY, json TEXT)",
        function(err) {
            console.log('create table "link", err', err);
        });
    return db;
}

function insertObject(object, callback, ifReplace) {
    ifReplace = typeof ifReplace !== undefined ? ifReplace : false;
    var query = "";
    if (ifReplace === true) {
        query = "INSERT OR REPLACE INTO object (hash, json) VALUES (?, ?)";
    } else {
        query = "INSERT OR IGNORE INTO object (hash, json) VALUES (?, ?)";
    }
    db.run(query, object.hash(), object.json(), function(err) {
        if (err === null) {
            if (typeof callback === 'function' ) callback();
        }
        else {
            throw "db, insertObject, err:" + err;
        }
    });
}

function getObjectByHash(id, callback, objIfNull) {
    db.get("SELECT * FROM object WHERE hash=?", id, function(err, raw) {
        var obj = undefined;
        if (raw !== undefined) {
            obj = baseObj.wireObject(raw.json);
        }
        if (objIfNull !== undefined && obj === undefined) {
            obj = objIfNull;
        }
        if (obj !== undefined) {
            callback( obj );
        } else {
            throw "db, getObjectByHash, err:" + err;            
        }
    });
}

function removeObject( obj, callback ) {
    var s = "delete from object where hash=?";
    db.run( s, obj.hash(), callback );
}

function getAllLink(callback) {
    db.all("select * from object where LENGTH(hash) < 40", function(err, raws) {
        for (var i=0; i<raws.length; ++i) {
            raws[i] = baseObj.wireObject(raws[i].json);   
        };
        if (typeof callback === 'function') {
            callback( raws );
        }
    });
}

exports.insertObject = insertObject;
exports.getObjectByHash = getObjectByHash;
exports.getAllLink = getAllLink;
exports.removeObject = removeObject;

// ------------------------ test ----------------------------

function test() {
    var objects = require("./object.js");
    var o = objects.newObject("BLOB");
    o.setText("hello world");
    
    insertObject(o, function() {
        console.log("finished insert into db")
    });
    
    var id = o.hash();
    getObjectByHash(id, function(row) {
        console.log("call back function, load object", row, "type", row.type)
    });
}
function testRemove() {
    var objects = require("./object.js");
    var link = objects.newObject("LINK");
    link.setName("testRemove");
    removeObject( link );
    removeObject( link, function() {
        getObjectByHash("testRemove", function( obj ) {
            console.log( "obj:" + obj.json());
        });
    });
}
//testRemove();
//test();
