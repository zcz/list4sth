var crypto = require('crypto');

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

function md5( s ) {
    return crypto.createHash("md5").update(s).digest('hex');
}

exports.getUrl = getUrl;
exports.md5 = md5;

// -------------------------- test -------------------------------

function test() {
    console.log("md5 for zcz is: " + md5("zcz"));
}
//test();