// Vercel Serverless Function — YouTube Download Proxy
export default async function handler(req, res) {
    // CORS headers (تاکہ آپ کی سائٹ سے استعمال ہو سکے)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url, filename } = req.query;
    if (!url) {
        return res.status(400).json({ error: "URL parameter is required" });
    }

    try {
        // 🔥 اصلی براؤزر جیسے headers — Google 403 بلاک نہیں کرے گا
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.youtube.com/',
                'Range': 'bytes=0-',  // ڈاؤن لوڈ شروع کرنے کا سگنل
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // ✅ زبردستی ڈاؤن لوڈ کروانے کے لیے ضروری header
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename || 'video.mp4')}"`);
        res.setHeader('Content-Length', response.headers.get('content-length') || '');
        res.setHeader('Cache-Control', 'no-cache');

        // Stream the video file
        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
