// functions/gofile-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    try {
        const contentId = event.queryStringParameters.contentId;
        const apiResponse = await fetch(`https://api.gofile.io/contents/${contentId}/directlinks`);
        const data = await apiResponse.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch from Gofile API.' }),
        };
    }
};