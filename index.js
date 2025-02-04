import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { createReadStream, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: 'https://promptopia.net',
    methods: ['GET']
}));

// PDF download route
app.get('/download', (req, res) => {
    const filePath = join(__dirname, 'pdfs', 'AI-Genius-AI-Prompts-For-Creators-1_230216_083125.pdf');
    
    if (!existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const stat = statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=AI-Genius-AI-Prompts-For-Creators.pdf');
        
        const readStream = createReadStream(filePath);
        
        readStream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(500).json({ error: 'Error streaming file' });
        });

        readStream.pipe(res);
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

// Test route
app.get('/', (req, res) => {
    res.json({ status: 'Download server is running' });
});

app.listen(PORT, () => {
    console.log(`Download server is running on port ${PORT}`);
    console.log(`Access the download at: http://localhost:${PORT}/download`);
});