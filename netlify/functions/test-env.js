exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ? 'present' : 'missing',
      AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ? 'present' : 'missing',
      AMADEUS_HOSTNAME: process.env.AMADEUS_HOSTNAME || 'undefined',
      NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID ? 'present' : 'missing',
      NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN ? 'present' : 'missing',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
    })
  };
};
