const axios = require('axios');

exports.handler = async (event) => {
    const { path, rawQuery } = event;

    const dynamicPath = path.replace('/.netlify/functions/proxy/', '');
    const baseUrl = `http://ec2-54-157-195-16.compute-1.amazonaws.com:8080/geoserver/${dynamicPath}`;
    const url = rawQuery ? `${baseUrl}?${rawQuery}` : baseUrl;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return {
            statusCode: 200,
            headers: {
                'Content-Type': response.headers['content-type'],
                'Access-Control-Allow-Origin': '*',
            },
            body: Buffer.from(response.data, 'binary').toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Proxy failed', details: error.message }),
        };
    }
};
