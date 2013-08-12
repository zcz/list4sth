
/*
 * GET users listing.
 */

function showLink(req, res){
    var linkName = req.params[0];
    res.send("link: " + linkName);
};

exports.showLink = showLink;