/**
 * Requestr doesn't have many, if any, views and their logic should be minimal.
 */

/*
 * GET home page.
 */
exports.indexView = function(req, res){
    res.send('index');
};