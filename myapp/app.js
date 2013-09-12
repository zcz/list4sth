
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , JSONController = require("./routes/JSONController")
  , linkController = require('./routes/linkController')
  , userController = require('./routes/userController')
  , utility = require("./js_src/utility");

var app = express();

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger(":remote-addr - [:date] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('Authentication Tutorial '));
app.use(express.session());

var auth = express.basicAuth(function(user, pass) {
    
    var userList = {
        zcz     : "ca7c1c3117df370a8c6cbc1f06d8f247",
        sudi    : "3438f260571c87024e4462586686096e",
        pengyun : "6744ecb5cc4257098c1867ce48c72f75", // default password
    };

    if ( utility.md5(user+"_"+pass) === userList[user] ) return true;  
    else return false;    
});

var accessOwnLimit = function( req, res, next ) {
    var userName = req.params.userName;
    if (req.user === userName) return next();
    else res.send("[user:"+ userName + "] access denied");
};

var authAdmin = express.basicAuth(function(user, pass) {
    
    var userList = {
        zcz     : "ca7c1c3117df370a8c6cbc1f06d8f247",
    };

    if ( utility.md5(user+"_"+pass) === userList[user] ) {
        return true;   
    } else {
        return false;
    }    
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(err, req, res, next){  // error handle
//  console.error(err.stack);
//  res.send(500, 'Something broke!');
//});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// authentication functions
// based on http://danialk.github.io/blog/2013/02/20/simple-authentication-in-nodejs/
/*
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    var userList = {
        zcz     : "ca7c1c3117df370a8c6cbc1f06d8f247",
        pengyun : "6744ecb5cc4257098c1867ce48c72f75", // default password
    };

    if (userList[name] !== undefined) {
        if ( utility.md5(name+"_"+pass) === userList[name] ) {
            return fn(null, name);
        } else {
            return fn(new Error('invalid password'));
        }
    } else {
        return fn(new Error('cannot find user'));
    };
}

function __authenFn(req, res, err, user) {
    if (user) {
        req.session.regenerate(function () {
            req.session.user = user;
            //req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
            res.redirect('/me/'+user);
        });
    } else {
        //req.session.error = 'Authentication failed, please check your ' + ' username and password.';
        res.send('login error');
    }
}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        //req.session.error = 'Access denied!';
        res.redirect('login error');
    }
}*/

app.get(/^\/JSON\/([a-f0-9]{40})$/, JSONController.getJSON);                    //e.g. /JSON/24c64397de58751168bda5e769f9343ee255a9cf

app.get("/", auth, function(req, res) {
    res.redirect('/me/'+req.user);
});                                                           //e.g. "/"
app.get("/me/:userName", [auth, accessOwnLimit], userController.showOneUser);                     //e.g. "/me/zcz"
app.get("/me/:userName/:linkName", auth, linkController.showLink);              //e.g. "/me/zcz/todo"

app.get("/me/:userName/:linkName/remove/*", [auth, accessOwnLimit], linkController.removeItem );  //e.g. /todo/remove/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/append/*", [auth, accessOwnLimit], linkController.appendItem );  //e.g. /todo/append/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/insert/*", [auth, accessOwnLimit], linkController.insertItem );  //e.g. /todo/subtree/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/edit/*", [auth, accessOwnLimit], linkController.editItem );      //e.g. /todo/edit/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3

// admin link
app.get("/admin", authAdmin, userController.showAllUser);                       //e.g. "/admin"

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
