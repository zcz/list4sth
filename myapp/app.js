
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , objectController = require("./routes/objectController")
  , linkController = require('./routes/linkController')
  , userController = require('./routes/userController');

var app = express();

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger(":remote-addr - [:date] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.basicAuth(function(user, pass) {
 return user === 'zcz' && pass === '89622';
}));
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

app.get("/", userController.showAllUser);                       //e.g. "/"
app.get("/me/:userName", userController.showOneUser);           //e.g. "/me/zcz"
app.get("/me/:userName/:linkName", linkController.showLink);    //e.g. "/me/zcz/todo"

app.get("/me/:userName/:linkName/remove/*", linkController.removeItem );    //e.g. /todo/remove/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/append/*", linkController.appendItem );    //e.g. /todo/append/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/insert/*", linkController.insertItem );    //e.g. /todo/subtree/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3
app.get("/me/:userName/:linkName/edit/*", linkController.editItem );    //e.g. /todo/edit/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3

app.get(/^\/([a-f0-9]{40})$/, objectController.showObject);     //e.g. /24c64397de58751168bda5e769f9343ee255a9cf
app.get(/^\/JSON\/([a-f0-9]{40})$/, objectController.getJSON);  //e.g. /JSON/24c64397de58751168bda5e769f9343ee255a9cf
//app.get("/remove/*", objectController.removeJSON );             //e.g. /remove/24c64397de58751168bda5e769f9343ee255a9cf_1_2_3

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
