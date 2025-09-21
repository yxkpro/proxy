// functions/gofile-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Define CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://freerider.app',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle the preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Your main logic for the GET request
  try {
    const contentId = event.queryStringParameters.contentId;
    const apiResponse = await fetch(`https://api.gofile.io/contents/${contentId}/directlinks`);
    const data = await apiResponse.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch from Gofile API.' }),
    };
  }
};