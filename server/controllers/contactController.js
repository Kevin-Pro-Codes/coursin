const nodemailer = require('nodemailer');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limiter: 2 requests per 20 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 2, // 2 requests
  duration: 20 * 60, // per 20 minutes
  blockDuration: 20 * 60 // Block for 20 minutes if exceeded
});

class ContactController {
  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    this.ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    this.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  // Parse JSON body from request
  parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error('Invalid JSON'));
        }
      });
      req.on('error', reject);
    });
  }

  // Validate contact form data
  validateContactData(data) {
    const errors = {};
    
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    // Optional fields validation
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    const validInterests = ['web-development', 'data-science', 'design', 'mobile-dev', 'ai-ml', 'business', 'other', ''];
    if (data.courseInterest && !validInterests.includes(data.courseInterest)) {
      errors.courseInterest = 'Invalid course interest selected';
    }
    
    return errors;
  }

  // Check rate limit middleware
  async checkRateLimit(req, res, next) {
    const clientIP = req.socket.remoteAddress || req.connection.remoteAddress || 'unknown';
    
    try {
      await rateLimiter.consume(clientIP);
      if (typeof next === 'function') {
        next();
      }
      return true;
    } catch (rateLimiterRes) {
      const retryAfter = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
      res.writeHead(429, { 
        'Content-Type': 'application/json',
        'Retry-After': retryAfter
      });
      res.end(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter
      }));
      return false;
    }
  }

  // Send contact email handler
  async sendContactEmail(req, res) {
    try {
      // Parse request body
      const body = await this.parseBody(req);
      
      // Validate data
      const errors = this.validateContactData(body);
      if (Object.keys(errors).length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          errors: errors
        }));
        return;
      }
      
      const { name, email, phone, courseInterest, message, subscribe } = body;
      
      // 1. Send notification to ADMIN
      await this.sendAdminNotification(name, email, phone, courseInterest, message, subscribe, req);
      
      // 2. Send confirmation to USER if subscribed
      if (subscribe) {
        await this.sendUserConfirmation(email, name);
      }

      // Success response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully! We will get back to you within 24 hours.' 
      }));
      
    } catch (error) {
      console.error('Error processing contact form:', error);
      
      // Don't send error if headers already sent
      if (res.headersSent) return;
      
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error.message === 'Invalid JSON' ? 'Invalid request data' : 'Failed to send message. Please try again later.'
      }));
    }
  }

  // Send admin notification email
  async sendAdminNotification(name, email, phone, courseInterest, message, subscribe, req) {
    const clientIP = req.socket.remoteAddress || req.connection.remoteAddress || 'unknown';
    
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: this.ADMIN_EMAIL,
      replyTo: email,
      subject: `📧 New Contact Form Submission: ${name}`,
      html: this.getAdminEmailTemplate(name, email, phone, courseInterest, message, subscribe, clientIP),
      text: this.getAdminEmailText(name, email, phone, courseInterest, message, subscribe, clientIP)
    };
    
    await this.transporter.sendMail(adminMailOptions);
    console.log(`Admin notification sent to ${this.ADMIN_EMAIL}`);
  }

  // Send user confirmation email
  async sendUserConfirmation(userEmail, userName) {
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Thank you for contacting Coursin!',
      html: this.getUserConfirmationTemplate(userName),
      text: this.getUserConfirmationText(userName)
    };
    
    await this.transporter.sendMail(userMailOptions);
    console.log(`Confirmation email sent to ${userEmail}`);
  }

  // Get admin email HTML template
  getAdminEmailTemplate(name, email, phone, courseInterest, message, subscribe, clientIP) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #000; color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .label { font-weight: bold; color: #000; margin-bottom: 5px; display: block; }
    .value { padding: 10px; background: #f9f9f9; border-radius: 4px; border-left: 4px solid #000; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 2px solid #000; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-left: 8px; }
    .subscribed { background: #4CAF50; color: white; }
    .not-subscribed { background: #f44336; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p>Coursin Education Platform</p>
    </div>
    
    <div class="content">
      <div class="field">
        <span class="label">From:</span>
        <div class="value">${name} &lt;${email}&gt;</div>
      </div>
      
      <div class="field">
        <span class="label">Phone:</span>
        <div class="value">${phone || 'Not provided'}</div>
      </div>
      
      <div class="field">
        <span class="label">Course Interest:</span>
        <div class="value">${this.formatCourseInterest(courseInterest) || 'Not specified'}</div>
      </div>
      
      <div class="field">
        <span class="label">Message:</span>
        <div class="value" style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${message}</div>
      </div>
      
      <div class="field">
        <span class="label">Newsletter Subscription:</span>
        <div class="value">
          ${subscribe ? 
            '<span class="badge subscribed">✓ Subscribed</span>' : 
            '<span class="badge not-subscribed">✗ Not subscribed</span>'
          }
        </div>
      </div>
      
      <div class="field">
        <span class="label">Submitted:</span>
        <div class="value">${new Date().toLocaleString()}</div>
      </div>
      
      <div class="field" style="border-bottom: none;">
        <span class="label">IP Address:</span>
        <div class="value">${clientIP}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>This email was automatically generated from your website contact form.</p>
      <p>© ${new Date().getFullYear()} Coursin. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Get admin email plain text
  getAdminEmailText(name, email, phone, courseInterest, message, subscribe, clientIP) {
    return `
NEW CONTACT FORM SUBMISSION - Coursin Education Platform
================================================================

From: ${name} <${email}>
Phone: ${phone || 'Not provided'}
Course Interest: ${this.formatCourseInterest(courseInterest) || 'Not specified'}
Newsletter Subscription: ${subscribe ? 'Yes' : 'No'}
Submitted: ${new Date().toLocaleString()}
IP Address: ${clientIP}

Message:
${message}

================================================================
This email was automatically generated from your website contact form.
    `;
  }

  // Get user confirmation HTML template
  getUserConfirmationTemplate(userName) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #000; color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background: #000; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 2px solid #000; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You, ${userName}!</h1>
      <p>Coursin Education Platform</p>
    </div>
    
    <div class="content">
      <p>Dear ${userName},</p>
      
      <p>Thank you for contacting <strong>Coursin Education Platform</strong>. We have received your message and our team will review it shortly.</p>
      
      <p><strong>Here's what happens next:</strong></p>
      <ul>
        <li>Our team will review your inquiry within 24 hours</li>
        <li>We'll contact you using the email/phone you provided</li>
        <li>If you have questions about specific courses, we'll provide detailed information</li>
      </ul>
      
      <p><strong>Since you've subscribed to our newsletter, you'll receive:</strong></p>
      <ul>
        <li>Updates on new courses and special offers</li>
        <li>Educational content and resources</li>
        <li>Invitations to webinars and events</li>
      </ul>
      
      <p>In the meantime, you can explore our courses at <a href="${this.FRONTEND_URL}">our website</a>.</p>
      
      <p>Best regards,<br><strong>The Coursin Team</strong></p>
      
      <a href="${this.FRONTEND_URL}/courses" class="button">Explore Our Courses</a>
    </div>
    
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>© ${new Date().getFullYear()} Coursin. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Get user confirmation plain text
  getUserConfirmationText(userName) {
    return `
THANK YOU FOR CONTACTING COURSIN!
================================================================

Dear ${userName},

Thank you for contacting Coursin Education Platform. We have received your message and our team will review it shortly.

Here's what happens next:
• Our team will review your inquiry within 24 hours
• We'll contact you using the email/phone you provided
• If you have questions about specific courses, we'll provide detailed information

Since you've subscribed to our newsletter, you'll receive:
• Updates on new courses and special offers
• Educational content and resources
• Invitations to webinars and events

In the meantime, you can explore our courses at: ${this.FRONTEND_URL}

Best regards,
The Coursin Team

================================================================
This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} Coursin. All rights reserved.
    `;
  }

  // Format course interest for display
  formatCourseInterest(interest) {
    const interests = {
      'web-development': 'Web Development',
      'data-science': 'Data Science',
      'design': 'UI/UX Design',
      'mobile-dev': 'Mobile Development',
      'ai-ml': 'AI & Machine Learning',
      'business': 'Business & Marketing',
      'other': 'Other'
    };
    return interests[interest] || interest;
  }

  // Get rate limit status
  async getRateLimitStatus(req, res) {
    try {
      const clientIP = req.socket.remoteAddress || req.connection.remoteAddress || 'unknown';
      const rateLimiterRes = await rateLimiter.get(clientIP);
      
      let response;
      if (rateLimiterRes) {
        const remainingPoints = rateLimiterRes.remainingPoints;
        const msBeforeNext = rateLimiterRes.msBeforeNext;
        const secondsBeforeNext = Math.ceil(msBeforeNext / 1000);
        
        response = {
          success: true,
          data: {
            remaining: remainingPoints,
            limit: 2,
            resetAfter: secondsBeforeNext,
            isLimited: remainingPoints === 0,
            window: '20 minutes'
          }
        };
      } else {
        response = {
          success: true,
          data: {
            remaining: 2,
            limit: 2,
            resetAfter: 0,
            isLimited: false,
            window: '20 minutes'
          }
        };
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
      
    } catch (error) {
      console.error('Error getting rate limit status:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to get rate limit status'
      }));
    }
  }
}

module.exports = new ContactController();