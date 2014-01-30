var schemaInspector = require('schema-inspector');
var apiSchemas = require('../model/api-schemas.js');
var request = require('request');
var crypto = require('crypto');

// Request Handlers
function statusRequest(req, res) {
    res.send('ok!');
}

// todo (jmccarthy14@) validate responses to prevent 'undefined' errors
function assetRequest(req, res) {
    var requestedResourceBundle = req.body;
    var returnedAssets = [];
    var urlsToProcess = requestedResourceBundle.Urls.length;
    requestedResourceBundle.Urls.forEach(function(resource) {
        request(resource.Url, function (error, response, body) {
            var data = resource.Type == 'STRING' ? body : new Buffer(body).toString('base64');
            var shasum = crypto.createHash('sha1').update(data);
            var returnedAsset = {
                Url: resource.Url,
                Token: shasum.digest('hex'),
                ContentType: response.headers['content-type'].split(';')[0],
                Type: resource.Type == 'STRING' ? resource.Type : 'DATA_URI'
            };

            if (returnedAsset.Token != resource.Token) {
                returnedAsset.Data = data;
            }
            returnedAssets.push(returnedAsset);
            if (--urlsToProcess == 0) {
                res.send(JSON.stringify(returnedAssets));
            }
        })
    });
}


// Utility
function validatedRequest(requestHandler, bodySchema) {
    return function (req, res) {
        schemaInspector.validate(bodySchema, req.body, function validationResult(err, result) {
            if (err) {
                console.log(result.format());
            } else {
                requestHandler(req, res);
            }
        });
    };
}

module.exports = {
    assetRequest: validatedRequest(assetRequest, apiSchemas.requestedResourceBundle),
    statusRequest: statusRequest
};