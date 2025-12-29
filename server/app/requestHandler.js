const url = require('url');

class RequestHandler {
    static async parseRequest(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const parsedUrl = url.parse(req.url, true);
                    
                    // Parse body if it exists
                    let parsedBody = {};
                    if (body && body.trim()) {
                        try {
                            parsedBody = JSON.parse(body);
                        } catch (e) {
                            console.error('❌ JSON parse error:', e.message);
                            throw new Error('Invalid JSON format');
                        }
                    }
                    
                    // Get client IP
                    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                                   req.headers['x-real-ip'] || 
                                   req.socket.remoteAddress || 
                                   '127.0.0.1';
                    
                    // Attach parsed data to request object
                    req.parsedUrl = parsedUrl;
                    req.parsedBody = parsedBody;
                    req.clientIP = clientIP;
                    req.body = parsedBody; // Standard Express-like body
                    req.query = parsedUrl.query;
                    req.params = {}; // For future route parameters
                    
                    resolve(req);
                } catch (error) {
                    reject(error);
                }
            });
            
            req.on('error', reject);
        });
    }

    static sendResponse(res, statusCode, data, headers = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        const responseHeaders = { ...defaultHeaders, ...headers };
        
        res.writeHead(statusCode, responseHeaders);
        res.end(JSON.stringify(data));
    }

    static handleError(res, error) {
        console.error('❌ Request error:', error);
        
        if (!res.headersSent) {
            this.sendResponse(res, 500, {
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = RequestHandler;