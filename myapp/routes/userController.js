var manager = require('../js_src/objectManager.js');
var dao = require('../js_src/sqliteDAO.js');
var baseObj = require('../js_src/object.js');
var utility = require("../js_src/utility.js");

function showAllUser( req, res ) {
    
    var addUser = req.query.addUser;
    if (addUser !== undefined) {
        console.log("create new user: " + addUser);
        var user = baseObj.newObject("USER");
        user.setName( addUser );
        res.redirect(utility.getUrl( addUser ));
    }
    
    dao.getAllUsers( function( objs ) {
        var a = [];
        for (var i = 0; i<objs.length; ++i) {
            var user = {};
            user.name = objs[i].getName();
            user.url = utility.getUrl( objs[i].getName() );
            user.count = countProperties( objs[i].getLinks() );
            a.push( user );
        }
        res.render('userList', { 
            title: 'User' + "(" + objs.length + ")",
            users: a
        });
    } );
}

function showOneUser( req, res ) {    
    var userName = req.params.userName;
    console.log("showOneUser:" + userName);
    
    dao.getUserByName(userName, function( user ) {
        
        // for the add one more link function
        var addLink = req.query.addLink;
        if (addLink !== undefined && user.getLinks()[addLink] === undefined) {
           // console.log("addLink called");
            var link = baseObj.newObject("LINK");
            user.setLink( addLink, link );
            res.redirect(utility.getUrl( userName ) );
        }
        
        var objs = user.getLinks();
        var a = [];
        for (var linkName in objs ) {
            var tmplink = {};
            tmplink.name = linkName;
            tmplink.url = utility.getUrl( user.getName(), linkName );
            a.push(tmplink);
        }
        res.render('linkList', { 
            title: user.getName() + " (" + a.length + ")",
            links: a
        });
    } );
}

exports.showAllUser = showAllUser;
exports.showOneUser = showOneUser;

// ---------------------- internal functions ----------------------------

function countProperties(obj) {
    var count = 0;
    
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}
