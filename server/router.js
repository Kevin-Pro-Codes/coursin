const AuthController = require('./controllers/authController');
const ContactController = require('./controllers/contactController');
const authMiddleware = require('./middleware/authMiddleware');

class Router {
    constructor() {
        this.routes = [];
        this.allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
    }

    // Method to add routes
    addRoute(method, path, handler) {
        this.routes.push({
            method,
            path,
            handler
        });
    }

    // Method to handle CORS
    handleCORS(req, res) {
        const requestOrigin = req.headers.origin;
        
        if (this.allowedOrigins.includes(requestOrigin)) {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        }
        
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return false; // Stop further processing
        }

        return true; // Continue processing
    }

    // Initialize all routes
    initializeRoutes() {
        // Public routes
        this.addRoute('GET', '/api/health', this.healthCheck.bind(this));
        this.addRoute('GET', '/', this.healthCheck.bind(this));
        
        // Auth routes
        this.addRoute('POST', '/api/auth/register', AuthController.register.bind(AuthController));
        this.addRoute('POST', '/api/auth/login', AuthController.login.bind(AuthController));
        
        // Protected routes (with middleware)
        this.addRoute('GET', '/api/auth/profile', (req, res) => {
            authMiddleware(req, res, () => {
                AuthController.getProfile(req, res);
            });
        });
        
        // Contact routes
        this.addRoute('POST', '/api/contact', async (req, res) => {
            // Apply rate limiter
            const canProceed = await ContactController.checkRateLimit(req, res);
            if (canProceed) {
                await ContactController.sendContactEmail(req, res);
            }
        });
        
        // Rate limit status endpoint
        this.addRoute('GET', '/api/contact/rate-limit', 
            ContactController.getRateLimitStatus.bind(ContactController)
        );
    }

    // Health check handler
    healthCheck(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        }));
    }

    // 404 handler
    notFound(req, res) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Route not found'
        }));
    }

    // Error handler
    handleError(error, req, res) {
        console.error('Router error:', error);
        
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            }));
        }
    }

    // Main router handler
    async handleRequest(req, res) {
        // Handle CORS first
        const shouldContinue = this.handleCORS(req, res);
        if (!shouldContinue) return;

        try {
            const url = req.url;
            const method = req.method;

            console.log(`[${new Date().toISOString()}] ${method} ${url} from ${req.headers.origin || 'unknown origin'}`);

            // Find matching route
            const route = this.routes.find(r => 
                r.method === method && r.path === url
            );

            if (route) {
                await route.handler(req, res);
            } else {
                this.notFound(req, res);
            }
        } catch (error) {
            this.handleError(error, req, res);
        }
    }
}

// Create and configure router instance
const router = new Router();
router.initializeRoutes();

module.exports = router;