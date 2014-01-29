var schemaInspector = require('schema-inspector');
var apiSchemas = require('../model/api-schemas.js');
var request = require('request');

// Request Handlers
function statusRequest(req, res){
    res.send('ok!');
}

function assetRequest(req, res){
    var requestedResourceBundle = req.body;
    var returnedAssets = [];
    var urlsToProcess = requestedResourceBundle.Urls.length;
    requestedResourceBundle.Urls.forEach(function(resource) {
        request(resource.Url, function (error, response, body) {
            returnedAssets.push({
                Url:            resource.Url,
                Data:           resource.Type == 'STRING' ? body : new Buffer(body).toString('base64'),
                Type:           resource.Type == 'STRING' ? resource.Type : 'DATA_URI',
                ContentType:    response.headers['content-type'].split(';')[0]
            });
            if(--urlsToProcess == 0) {
                res.send(JSON.stringify(returnedAssets));
            }
        })
    });
}


// Utility
function validatedRequest(requestHandler, bodySchema) {
    return function(req, res) {
        schemaInspector.validate(bodySchema, req.body, function validationResult(err, result) {
            if(err) {
                console.log(result.format());
            } else {
                requestHandler(req, res);
            }
        });
    };
}

module.exports = {
    assetRequest : validatedRequest(assetRequest, apiSchemas.requestedResourceBundle),
    statusRequest : statusRequest
};