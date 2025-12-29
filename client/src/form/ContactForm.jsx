import { useState, useEffect } from 'react';

function ContactForm() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
    message: '',
    subscribe: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimit, setRateLimit] = useState({
    count: 0,
    resetTime: null,
    isLimited: false,
    remainingTime: 0
  });

  // Check rate limit on component mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  // Countdown timer for rate limit
  useEffect(() => {
    let interval;
    if (rateLimit.isLimited && rateLimit.remainingTime > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((rateLimit.resetTime - now) / 1000));
        
        if (remaining <= 0) {
          checkRateLimit();
        } else {
          setRateLimit(prev => ({
            ...prev,
            remainingTime: remaining
          }));
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rateLimit.isLimited, rateLimit.resetTime]);

  const checkRateLimit = () => {
    const storedData = localStorage.getItem('contactFormRateLimit');
    if (storedData) {
      const { count, timestamp } = JSON.parse(storedData);
      const now = Date.now();
      const twentyMinutes = 20 * 60 * 1000;
      
      if (now - timestamp < twentyMinutes) {
        if (count >= 2) {
          const resetTime = timestamp + twentyMinutes;
          const remainingTime = Math.max(0, Math.floor((resetTime - now) / 1000));
          
          setRateLimit({
            count,
            resetTime,
            isLimited: true,
            remainingTime
          });
          return false;
        } else {
          setRateLimit({
            count,
            resetTime: timestamp + twentyMinutes,
            isLimited: false,
            remainingTime: 0
          });
          return true;
        }
      } else {
        // Time window has passed, reset counter
        localStorage.removeItem('contactFormRateLimit');
        setRateLimit({
          count: 0,
          resetTime: null,
          isLimited: false,
          remainingTime: 0
        });
        return true;
      }
    }
    return true;
  };

  const updateRateLimit = () => {
    const storedData = localStorage.getItem('contactFormRateLimit');
    const now = Date.now();
    const twentyMinutes = 20 * 60 * 1000;
    
    if (storedData) {
      const { count, timestamp } = JSON.parse(storedData);
      
      if (now - timestamp < twentyMinutes) {
        const newCount = count + 1;
        localStorage.setItem('contactFormRateLimit', JSON.stringify({
          count: newCount,
          timestamp
        }));
        
        if (newCount >= 2) {
          const resetTime = timestamp + twentyMinutes;
          const remainingTime = Math.max(0, Math.floor((resetTime - now) / 1000));
          
          setRateLimit({
            count: newCount,
            resetTime,
            isLimited: true,
            remainingTime
          });
        }
      } else {
        // Reset after 20 minutes
        localStorage.setItem('contactFormRateLimit', JSON.stringify({
          count: 1,
          timestamp: now
        }));
      }
    } else {
      // First submission in this period
      localStorage.setItem('contactFormRateLimit', JSON.stringify({
        count: 1,
        timestamp: now
      }));
    }
  };

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

 const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  // Check rate limit (frontend check)
  const storedData = localStorage.getItem('contactFormRateLimit');
  if (storedData) {
    const { count, timestamp } = JSON.parse(storedData);
    const now = Date.now();
    const twentyMinutes = 20 * 60 * 1000;
    
    if (now - timestamp < twentyMinutes && count >= 2) {
      const resetTime = timestamp + twentyMinutes;
      const remainingTime = Math.max(0, Math.floor((resetTime - now) / 1000));
      
      setRateLimit({
        count,
        resetTime,
        isLimited: true,
        remainingTime
      });
      return;
    }
  }
  
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for CORS with credentials
      body: JSON.stringify(contactForm)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Update frontend rate limit tracker
      updateRateLimit();
      
      // Show success message
      setFormSubmitted(true);
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        courseInterest: '',
        message: '',
        subscribe: false
      });
      
      setFormErrors({});
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } else if (response.status === 429) {
      // Rate limit exceeded from server
      alert(data.message || 'Rate limit exceeded. Please try again later.');
      
      // Update local rate limit state
      const now = Date.now();
      const twentyMinutes = 20 * 60 * 1000;
      const resetTime = now + (data.retryAfter * 1000);
      
      setRateLimit({
        count: 2,
        resetTime,
        isLimited: true,
        remainingTime: data.retryAfter
      });
      
      // Store in localStorage
      localStorage.setItem('contactFormRateLimit', JSON.stringify({
        count: 2,
        timestamp: now - (twentyMinutes - (data.retryAfter * 1000))
      }));
    } else {
      // Handle validation errors
      if (data.errors) {
        const newErrors = {};
        data.errors.forEach(error => {
          newErrors[error.param] = error.msg;
        });
        setFormErrors(newErrors);
      } else {
        alert(data.error || 'Failed to send message');
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred while sending your message. Please check your connection.');
  } finally {
    setIsSubmitting(false);
  }
};

const checkServerRateLimit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/contact/rate-limit', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.isLimited) {
        setRateLimit({
          count: 2 - data.data.remaining,
          resetTime: Date.now() + (data.data.resetAfter * 1000),
          isLimited: true,
          remainingTime: data.data.resetAfter
        });
      }
    }
  } catch (error) {
    console.error('Error checking rate limit:', error);
  }
};

// Call this in useEffect
useEffect(() => {
  checkRateLimit();
  checkServerRateLimit();
}, []);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white p-8 rounded-2xl shadow-lg h-full border-2 border-black">
        {rateLimit.isLimited ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">Too Many Requests</h3>
            <p className="text-gray-800 text-lg mb-4">
              You have exceeded the limit of 2 messages per 20 minutes.
            </p>
            <p className="text-gray-800 text-lg mb-8">
              Please try again in {rateLimit.remainingTime} seconds.
            </p>
            <button 
              onClick={() => setRateLimit(prev => ({ ...prev, isLimited: false }))}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 font-medium border-2 border-black"
            >
              Back to Form
            </button>
          </div>
        ) : formSubmitted ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">Thank You!</h3>
            <p className="text-gray-800 text-lg mb-8">
              Your message has been sent successfully. Our team will get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setFormSubmitted(false)}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 font-medium border-2 border-black"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-6 text-black">Send us a Message</h3>
            
            <form onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-black mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className={`w-full p-3 bg-white border-2 ${formErrors.name ? 'border-red-600' : 'border-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-black mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className={`w-full p-3 bg-white border-2 ${formErrors.email ? 'border-red-600' : 'border-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-black mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    className="w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+1 (555) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-black mb-2">
                    Course Interest
                  </label>
                  <select 
                    name="courseInterest"
                    value={contactForm.courseInterest}
                    onChange={handleContactChange}
                    className="w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a course category</option>
                    <option value="web-development">Web Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="design">UI/UX Design</option>
                    <option value="mobile-dev">Mobile Development</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="business">Business & Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-black mb-2">
                  Your Message <span className="text-red-600">*</span>
                </label>
                <textarea 
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows="6"
                  className={`w-full p-3 bg-white border-2 ${formErrors.message ? 'border-red-600' : 'border-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                  placeholder="Tell us about your inquiry, questions about courses, or any other information..."
                  disabled={isSubmitting}
                />
                {formErrors.message && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.message}</p>
                )}
              </div>
              
              <div className="mb-8">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="subscribe"
                    checked={contactForm.subscribe}
                    onChange={handleContactChange}
                    className="h-5 w-5 text-black rounded focus:ring-black border-2 border-black"
                    disabled={isSubmitting}
                  />
                  <span className="ml-3 text-black">
                    Subscribe to our newsletter for updates on new courses and promotions
                  </span>
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} text-white rounded-lg transition-all duration-300 font-medium w-full sm:w-auto border-2 border-black flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
                
                <div className="text-right">
                  <p className="text-gray-700 text-sm">
                    Fields marked with <span className="text-red-600">*</span> are required
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Rate limit: 2 messages per 20 minutes
                  </p>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ContactForm;