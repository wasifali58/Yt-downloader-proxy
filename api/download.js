// Proxy Father — Fixed for Google Video (403 bypass)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = req.query.url;
    const filename = req.query.filename || 'video.mp4';

    if (!url) {
        return res.status(400).json({
            success: false,
            error: "URL parameter is required",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    try {
        // 🔧 بہتر Headers تاکہ Google بلاک نہ کرے
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'identity;q=1, *;q=0',
                'Range': 'bytes=0-',
                'Origin': 'https://www.youtube.com',
                'Referer': 'https://www.youtube.com/',
                'Sec-Fetch-Dest': 'video',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site',
                'Connection': 'keep-alive'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.status}`);
        }

        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());

        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);

        return res.send(buffer);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }
}
