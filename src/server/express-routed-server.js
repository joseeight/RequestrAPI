
var expressServer = require('./express-server.js');
var viewHandlers = require('../handler/view-handlers.js');
var xhrHandlers = require('../handler/xhr-handlers.js');

// Start routes
// todo (jmccarthy14@) make a handler per resource
expressServer.get('/', viewHandlers.indexView);
expressServer.get('/status', xhrHandlers.statusRequest);
expressServer.post('/asset', xhrHandlers.assetRequest);


module.exports = expressServer;