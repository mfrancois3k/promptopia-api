import { join } from 'path';
import { createReadStream, statSync, existsSync } from 'fs';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', 'https://promptopia.net');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const filePath = join(process.cwd(), 'pdfs', 'AI-Genius-AI-Prompts-For-Creators-1_230216_083125.pdf');

    if (!existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const stat = statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=AI-Genius-AI-Prompts-For-Creators.pdf');
        
        const readStream = createReadStream(filePath);
        readStream.pipe(res);
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: 'Error downloading file' });
    }
}