
/*
 * GET home page.
 */

exports.index = function(req, res){
    var os = require('os');
    res.render('index', { title: 'Kinisi Console', arch: os.arch(), os_type: os.type(), os_platform: os.platform() });
};
