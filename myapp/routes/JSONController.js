/*
 * GET list
 */
var dao = require('../js_src/sqliteDAO');

function getJSON( req, res ) {
    var hash = req.params[0];  
    dao.getObjectByHash(hash,  function(obj) {
        res.json( obj ); 
    });
}

exports.getJSON = getJSON;