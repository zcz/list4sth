var http = require("http");
var url = require("url");

function start( port, route, handle ) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var postData = "";
    console.log("Request for " + pathname + " received." );

    route( handle, pathname, request, response ); 
  }
  //http.createServer(onRequest).listen( port );
  //test on cloud9
  http.createServer(onRequest).listen( process.env.PORT, process.env.IP );
  console.log(new Date(), "server started at port", port );
}

exports.start = start;

