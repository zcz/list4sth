
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , list = require("./routes/list");

var app = express();

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);
//app.all('/api/*', api);
app.get(/^\/([a-f0-9]{40})$/, list.showObject);
app.get(/^\/JSON\/([a-f0-9]{40})$/, list.getJSON);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
