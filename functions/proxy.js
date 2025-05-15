import fetch from 'node-fetch';

export async function handler(event) {
    const { path, rawQuery } = event;

    const dynamicPath = path.replace('/.netlify/functions/proxy/', '');

    const baseUrl = `http://ec2-50-16-5-92.compute-1.amazonaws.com:8080/geoserver/${dynamicPath}`;
    const url = rawQuery ? `${baseUrl}?${rawQuery}` : baseUrl;

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        const buffer = await response.buffer();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true,
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Proxy failed', details: error.message }),
        };
    }
}
