import { join } from 'path';
import { createReadStream, statSync } from 'fs';

export default function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://promptopia.net');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const filePath = join(process.cwd(), 'pdfs', 'AI-Genius-AI-Prompts-For-Creators-1_230216_083125.pdf');
    
    try {
        const stat = statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=AI-Genius-AI-Prompts-For-Creators.pdf');
        
        const readStream = createReadStream(filePath);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Error downloading file' });
    }
}