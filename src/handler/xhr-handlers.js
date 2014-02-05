var schemaInspector = require('schema-inspector');
var apiSchemas = require('../model/api-schemas.js');
var request = require('request');
var crypto = require('crypto');

// Request Handlers
function statusRequest(req, res) {
    res.send('ok!');
}

// todo (jmccarthy14@) validate responses to prevent 'undefined' errors
// todo (jmccarthy14@) create header blacklist
function assetRequest(req, res) {
    var requestedResourceBundle = req.body;
    var returnedAssets = [];
    var urlsToProcess = requestedResourceBundle.Urls.length;
    var options = {
        headers : {
            'User-Agent': req.headers['user-agent'],
            'Origin': req.headers.origin
        }
    };
    requestedResourceBundle.Urls.forEach(function(resource) {
        options.url = resource.Url;
        request(options, function (error, response, body) {
            // todo (jmc@) error handling
            var data = resource.Type == 'STRING' ? body : new Buffer(body).toString('base64');
            var shasum = crypto.createHash('sha1').update(data);
            var returnedAsset = {
                Url: resource.Url,
                Token: shasum.digest('hex'),
                ContentType: response.headers['content-type'].split(';')[0],
                Type: resource.Type == 'STRING' ? resource.Type : 'DATA_URI'
            };

            if (returnedAsset.Token != resource.Token) {
                returnedAsset.Data = "data:" + returnedAsset.ContentType + ";base64," + data;
            }
            returnedAssets.push(returnedAsset);
            if (--urlsToProcess == 0) {
                res.send(JSON.stringify(returnedAssets));
            }
        })
    });
}


// Utility
// TODO (jmc@) include this once nodejs is upgraded past 11.2 or patch schema-inspector
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
//    assetRequest: validatedRequest(assetRequest, apiSchemas.requestedResourceBundle),
    assetRequest: assetRequest,
    statusRequest: statusRequest
};