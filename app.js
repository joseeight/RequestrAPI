var expressRoutedServer = require('./src/server/express-routed-server.js');
var requestrConfig = require('./config/base-config.json');

expressRoutedServer.listen(requestrConfig.hostPort);