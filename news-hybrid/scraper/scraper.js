const { chromium } = require('playwright');
const cheerio = require('cheerio');
const http = require('http');
const url = require('url');

async function scrape(targetUrl) {
    let browser;
    try {
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        });

        await page.goto(targetUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        const html = await page.content();
        const $ = cheerio.load(html);

        // Content cleaner
        $('script, style, nav, footer, iframe').remove();

        const title = $('h1').first().text().trim();
        const content = $('article').text().trim() || $('main').text().trim() || $('body').text().trim();
        const image = $('meta[property="og:image"]').attr('content');

        return {
            status: 'success',
            data: { title, content, image }
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// If running as CLI
if (process.argv[2]) {
    const targetUrl = process.argv[2];
    scrape(targetUrl).then(result => {
        console.log(JSON.stringify(result));
        process.exit(result.status === 'success' ? 0 : 1);
    });
} else {
    // Run as HTTP server
    const server = http.createServer(async (req, res) => {
        // Simple routing
        const parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/scrape') {
            const targetUrl = parsedUrl.query.url;
            if (!targetUrl) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'URL query parameter is required' }));
                return;
            }

            console.log(`[Scraper] Scraping URL: ${targetUrl}`);
            const result = await scrape(targetUrl);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Not Found' }));
        }
    });

    const PORT = 3000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`[Scraper] HTTP server running on port ${PORT}`);
    });
}
