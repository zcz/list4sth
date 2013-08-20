
// this function should match what defined in app
function getUrl( username, linkname ) {
    var prefix = "/me";
    if (username === undefined && linkname === undefined) {
        return "/";
    }
    if (username !== undefined && linkname === undefined) {
        return prefix + "/" + username;
    }
    if (username !== undefined && linkname !== undefined) {
        // special treatement for link name, could be any utf8 string
        return prefix + "/" + username + "/" + encodeURIComponent(linkname);
    }
}

exports.getUrl = getUrl;