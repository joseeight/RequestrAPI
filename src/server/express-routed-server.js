
var expressServer = require('./express-server.js');
var viewHandlers = require('../handler/view-handlers.js');
var xhrHandlers = require('../handler/xhr-handlers.js');

expressServer.all('*', function(req, res, next){
    console.log('inside cors');
    if (!req.get('Origin')) {
        return next();
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) {
        return res.send(200);
    }
    return next();
});

// Start routes
// TODO (jmccarthy14@): Make a single handler per resource.
expressServer.get('/', viewHandlers.indexView);
expressServer.get('/status', xhrHandlers.statusRequest);
expressServer.post('/asset', xhrHandlers.assetRequest);


module.exports = expressServer;