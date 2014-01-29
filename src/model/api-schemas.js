
exports.requestedResourceBundle = {
    // And the validation!
    type: "object",
    properties: {
        Urls: {
            type: "array",
            items: {
                type: "object",
                minLength: 1,
                properties : {
                    Url : {
                        type : "string",
                        minLength : 4
                    },
                    Token : {
                        type : "string"
                    },
                    ContentType : {
                        type : "string",
                        minLength : 4
                    }
                }
            }
        }
    }
}