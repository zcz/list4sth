//var exec = require("child_process").exec;
var queryString = require("querystring");
var fs = require("fs");
var util = require("util");
var formidable = require("formidable");

var listFileName = "/tmp/list";

function start( request, response ) {
  console.log( "Request handler 'start' was called." );

  var body = '<html>' + 
    '<head>'+ 
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post" accept-charset="UTF-8" enctype="multipart/form-data">'+
    '<input type="text" name="listEntry" size="60">'+
    '</form>'+
    '<pre><code>'+fs.readFileSync( listFileName )+'</code><pre>'
    '</body>'+
    '</html>';

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload( request, response ) {
  console.log( "Request handler 'upload' was called." );

  var form = new formidable.IncomingForm();
  form.parse(request, function(err, fields, files) {
    fs.appendFileSync(listFileName, fields.listEntry+"\n");
    response.writeHead(302, { 'Location': '/' });
    response.end();
  });
}

exports.start = start;
exports.upload = upload;

