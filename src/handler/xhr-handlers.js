var schemaInspector = require('schema-inspector');
var apiSchemas = require('../model/api-schemas.js');
var request = require('request');
var crypto = require('crypto');

/**
 * Returns the status of the server.
 * @param {object} request The express-js request object.
 * @param (object) response The express-js response object.
 * @param (object) next The function to call the next filter
 *     in the chain.
 */
function statusRequest(request, response, next) {
    response.send({
        Up: true,
        Service: 'Greenfield'
    });
}

// TODO (jmccarthy14@): Validate  the responses to prevent 'undefined' errors.
// TODO (jmccarthy14@): Create a header blacklist.
/**
 * Requests the physical asset from the remote servers.
 * @param {object} request The express-js request object.
 * @param (object) response The express-js response object.
 * @param (object) next The function to call the next filter
 *     in the chain.
 */
function assetRequest(request, response, next) {
    var requestedResourceBundle = request.body;
    var returnedAssets = [];
    var urlsToProcess = requestedResourceBundle.Urls.length;

    requestedResourceBundle.Urls.forEach(function(resource) {
        var ops = {uri: resource.Url};
        if (resource.Type !== 'STRING') {
          ops.encoding = 'binary';
        }
        request(ops, function (error, assetResponse, body) {
            // TODO (jmccarthy14@): Add error handling here.
            var data = resource.Type == 'STRING' ? body : new Buffer(body.toString(), 'binary').toString('base64');
            var shasum = crypto.createHash('sha1').update(data);
            var returnedAsset = {
                Url: resource.Url,
                Token: shasum.digest('hex'),
                ContentType: assetResponse.headers['content-type'].split(';')[0],
                Type: resource.Type == 'STRING' ? resource.Type : 'DATA_URI'
            };

            if (returnedAsset.Token != resource.Token) {
                returnedAsset.Data = returnedAsset.Type == 'STRING' ? data : ("data:" + returnedAsset.ContentType + ";base64," + data);
            }
            returnedAssets.push(returnedAsset);
            if (--urlsToProcess == 0) {
                response.send(JSON.stringify({Resources: returnedAssets}));
            }
        })
    });
}


// TODO (jmccarthy14@): Include this once nodejs is upgraded past 11.2 or patch schema-inspector
/**
 * A meta-function to be sure that the inputs for all API resources are validated.
 * @param {function(object,object,object)} requestHandler The actual xhr request handler for the API resource.
 * @param {object} bodySchema The schema type to match for the inputted
 * @returns {Function}
 */
function validatedRequest(requestHandler, bodySchema) {
    return function (request, response, next) {
        schemaInspector.validate(bodySchema, req.body, function validationResult(err, result) {
            if (err) {
                console.log(result.format());
                response.send('Invalid JSON object, be sure it is properly hydrated.');
            } else {
                requestHandler(request, response, next);
            }
        });
    };
}

module.exports = {
//    assetRequest: validatedRequest(assetRequest, apiSchemas.requestedResourceBundle),
    assetRequest: assetRequest,
    statusRequest: statusRequest
};