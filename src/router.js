function route( handle, pathname, request, response ) {
  console.log("about to route a request: ", pathname );
  if (typeof handle[pathname] === 'function') {
    handle[pathname]( request, response);
  } else {
    console.log("no requesthandler for ", pathname );
    response.writeHead( 404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;

