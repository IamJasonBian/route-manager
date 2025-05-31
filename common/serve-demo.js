import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightPricesRouter from './api/flight-prices.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/flight-prices', flightPricesRouter);

const server = http.createServer(async (req, res) => {
    try {
        // Parse the URL
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        
        // Handle API requests
        if (url.pathname.startsWith('/api/')) {
            // Let Express handle API routes
            app(req, res);
            return;
        }

        // Handle static files
        if (url.pathname === '/styles.css') {
            const cssPath = path.join(__dirname, 'styles.css');
            try {
                const content = await fs.promises.readFile(cssPath, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(content);
                return;
            } catch (error) {
                console.error('Error reading CSS file:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
        }

        // Map URL to file system path
        let filePath = path.join(
            __dirname,
            url.pathname === '/' ? 'price-history-demo.html' : url.pathname
        );

        // Check if file exists
        try {
            await fs.promises.access(filePath);
        } catch (error) {
            // For any other route, serve the main HTML file (client-side routing)
            filePath = path.join(__dirname, 'price-history-demo.html');
        }

        // Set content type based on file extension
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.jsx': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        contentType = mimeTypes[extname] || 'application/octet-stream';

        // Read the file
        let content;
        try {
            content = await fs.promises.readFile(filePath, 'utf-8');
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        
        // Set CORS headers for development
        const headers = {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Serve the file
        res.writeHead(200, headers);
        res.end(content, 'utf-8');
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500);
        res.end(`Error: ${error.message}`);
    }
});

server.listen(PORT, () => {
    console.log(`Flight UI Demo server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server has been stopped');
        process.exit(0);
    });
});