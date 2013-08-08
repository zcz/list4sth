// sqlite database implementation, contain following tables
//1. object( id(PK), json ) contains {BLOB, TREE, MARK}
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
    
    db.run("CREATE TABLE IF NOT EXISTS object (id TEXT PRIMARY KEY, json TEXT)", 
        function(err) {
            console.log('create table "object", err', err);
        });
    db.run("CREATE TABLE IF NOT EXISTS link (name TEXT PRIMARY KEY, json TEXT)", 
        function(err) {
            console.log('create table "link", err', err);
        });
    return db;
}

function insertObject( id, json, callback ) {
    if (typeof json !== "string") {
        json = JSON.stringify(json);
    }
    db.run("INSERT OR REPLACE INTO object (id, json) VALUES (?, ?)", id, json, function (err) {
        if (err === null) {
            callback();            
        } else {
            throw "db, insertObject, err:" + err;
        }
    });
}

function getObjectById( id, callback ) {
    db.each( "SELECT * FROM object WHERE id=?", id, function(err, raw) {
        if (err === null) {
            callback(JSON.parse(raw.json));
            //callback(raw.json);
        } else {
            throw "db, getObjectById, err:" + err;
        }
    }); 
}

exports.insertObject = insertObject;
exports.getObjectById = getObjectById;


// ------------------------ test ----------------------------

function test() {
    var objects = require("./object.js");
    var o = objects.newObject("MARK");
    //o.setText("hello world");
    var id = objects.hash( o );
    insertObject( id, o, function() { console.log("finished insert into db")});
    getObjectById( id, function(row) { console.log("load object", row, "type", row.type)});
}
test();

