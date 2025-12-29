const AuthController = require('../controllers/authController');
const RequestHandler = require('../app/requestHandler');

// Helper function to verify token
function verifyToken(token) {
    try {
        if (!token) return null;
        
        const [header, payload, signature] = token.split('.');
        
        if (!header || !payload || !signature) {
            return null;
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.JWT_SECRET || 'your-secret-key-change-this')
            .update(`${header}.${payload}`)
            .digest('base64');

        if (signature !== expectedSignature) {
            return null;
        }

        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
        
        // Check if token is expired
        if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return decodedPayload;
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return null;
    }
}

module.exports = async function authMiddleware(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return RequestHandler.sendResponse(res, 401, {
                success: false,
                message: 'No token provided or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return RequestHandler.sendResponse(res, 401, {
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Get user from database
        const user = AuthController.getUserFromToken(token);
        
        if (!user) {
            return RequestHandler.sendResponse(res, 401, {
                success: false,
                message: 'User not found'
            });
        }

        // Attach user to request object
        req.user = user;
        req.token = token;

        // Continue to next handler
        await next();

    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        return RequestHandler.sendResponse(res, 500, {
            success: false,
            message: 'Authentication error'
        });
    }
};