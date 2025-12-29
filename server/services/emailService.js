const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter with your Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS  // Your Gmail app password
      }
    });
  }

  async sendContactEmail(formData) {
    try {
      // Email to admin (you)
      const adminMail = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Send to yourself
        subject: `New Contact Form Submission: ${formData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
              <p><strong>Course Interest:</strong> ${formData.courseInterest || 'Not specified'}</p>
              <p><strong>Subscribe to newsletter:</strong> ${formData.subscribe ? 'Yes' : 'No'}</p>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${formData.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p>This message was sent from your website contact form.</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      };

      // Send email to admin
      await this.transporter.sendMail(adminMail);
      console.log('Admin notification email sent');

      // Auto-reply to user
      const userMail = {
        from: process.env.GMAIL_USER,
        to: formData.email,
        subject: 'Thank you for contacting CourseMaster!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Thank You for Contacting CourseMaster!</h2>
            
            <p>Dear ${formData.name},</p>
            
            <p>We have received your message and will get back to you within 24 hours. Here's a summary of your inquiry:</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <p>${formData.message}</p>
            </div>
            
            <p><strong>Our team will review your inquiry regarding:</strong> ${formData.courseInterest || 'General inquiry'}</p>
            
            ${formData.subscribe ? `
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p>🎉 <strong>Thank you for subscribing to our newsletter!</strong></p>
              <p>You'll receive updates about new courses, special offers, and learning resources.</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <h3 style="color: #555;">What's Next?</h3>
              <ul>
                <li>Our team will review your inquiry</li>
                <li>We'll contact you within 24 hours</li>
                <li>Explore our courses while you wait: <a href="[Your Website URL]/courses">Browse Courses</a></li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 5px; font-size: 12px; color: #666;">
              <p><strong>CourseMaster Support Team</strong></p>
              <p>Email: ${process.env.GMAIL_USER}</p>
              <p>This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        `
      };

      // Send auto-reply to user
      await this.transporter.sendMail(userMail);
      console.log('Auto-reply email sent to user');

      return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();