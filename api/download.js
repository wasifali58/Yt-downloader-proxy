// Proxy Father — Vercel Serverless Function
export default async function handler(req, res) {
    // CORS headers (آپ کی API کی طرح allow all)
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
        // Google Video لنک سے فائل fetch کریں
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.status}`);
        }

        // فائل کو buffer میں تبدیل کریں
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());

        // اہم: یہ headers براؤزر کو ڈاؤن لوڈ کرنے پر مجبور کرتے ہیں
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);

        // فائل بھیجیں
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
