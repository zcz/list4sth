// sqlite database implementation, contain following tables
//1. object( hash(PK), json ) contains {BLOB, TREE, MARK}
//2. link( name(PK), json ) contains {LINK} 

var db = initDB("/tmp/test.db");

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

function insertObject(object, callback) {
    db.run("INSERT OR REPLACE INTO object (hash, json) VALUES (?, ?)", object.hash(), object.json(), function(err) {
        if (err === null) {
            if (typeof callback === 'function' ) callback();
        }
        else {
            throw "db, insertObject, err:" + err;
        }
    });
}

function getObjectByHash(id, callback) {
    db.get("SELECT * FROM object WHERE hash=?", id, function(err, raw) {
        if (raw !== undefined) {
            if (typeof callback === 'function') callback( JSON.parse(raw.json) );
        }
        else {
            throw "db, getObjectById, err:" + err;
        }
    });
}

exports.insertObject = insertObject;
exports.getObjectByHash = getObjectByHash;

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
//test();
