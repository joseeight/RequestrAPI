var express = require('express');
var path = require('path');

var server = express();



server.configure(function() {
    server.use(express.favicon());
    server.use(express.logger('dev'));
    server.use(express.json());
    server.use(express.urlencoded());
    server.use(express.methodOverride());
//    server.use(server.router);
    server.use(express.static(path.join(__dirname, 'public')));
});

if ('development' == server.get('env')) {
    server.use(express.errorHandler());
}



module.exports = server;

