const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const targetUrl = queryObject.q;

    // If no URL is searched, show a simple search bar interface
    if (!targetUrl) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1>My Searchable Proxy</h1>
                <form action="/" method="GET">
                    <input type="text" name="q" placeholder="Enter full URL (e.g., http://example.com)" style="width: 300px; padding: 10px;">
                    <button type="submit" style="padding: 10px;">Browse</button>
                </form>
                <p>Note: Only standard http:// websites are supported on this free script.</p>
            </body>
            </html>
        `);
        return;
    }

    try {
        const parsedUrl = url.parse(targetUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        protocol.get(targetUrl, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        }).on('error', (e) => {
            res.writeHead(500);
            res.end("Error fetching the site: " + e.message);
        });
    } catch (err) {
        res.writeHead(400);
        res.end("Invalid URL provided.");
    }
});

server.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
