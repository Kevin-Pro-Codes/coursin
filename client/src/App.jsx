import { useState } from 'react';
import './App.css';
import Navbar from './layout/Navbar.jsx';
import CourseSection from './section/CourseSection.jsx';
import Footer from './layout/Footer.jsx';
import ContactForm from './form/ContactForm.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    // After successful registration, close register modal and open login modal
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen min-w-screen bg-white text-black">
      {/* Navbar Component */}
      <Navbar 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
        onRegisterClick={() => setShowRegisterModal(true)}
      />
      
      {/* Hero Section */}
      <section id="home" className="py-16 px-6 border-b-2 border-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-black">
            Master Your Future
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-10">
            Join thousands of students learning cutting-edge skills with our industry-leading courses. 
            From beginner to advanced, we have the perfect learning path for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 border-2 border-black hover:bg-black hover:text-white"
            >
              Get Started Free
            </button>
            <button
              onClick={() => {
                // Scroll to courses section
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 border-2 border-black hover:bg-gray-100"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      {/* Course Section Component */}
      <CourseSection />

      {/* Features Section */}
      <section id="features" className="py-16 px-6 border-b-2 border-black">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">
            Why Choose CourseMaster?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black">
              <div className="h-16 w-16 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Interactive Learning</h3>
              <p className="text-gray-800">
                Our platform offers hands-on coding exercises, interactive quizzes, and real-world projects that help you apply what you learn immediately.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Live coding environment</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Interactive assignments with instant feedback</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Community coding challenges</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black">
              <div className="h-16 w-16 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 a1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Industry Expert Instructors</h3>
              <p className="text-gray-800">
                Learn from professionals working at top tech companies who bring real-world experience and insights directly to your learning journey.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Instructors from Google, Microsoft, and Amazon</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Regular live Q&A sessions</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Career guidance and mentorship programs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black">
              <div className="h-16 w-16 bg-black rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 a3.066 3.066 0 01-2.812 2.812 a3.066 3.066 0 00-1.745.723 a3.066 3.066 0 01-3.976 0 a3.066 3.066 0 00-1.745-.723 a3.066 3.066 0 01-2.812-2.812 a3.066 3.066 0 00-.723-1.745 a3.066 3.066 0 010-3.976 a3.066 3.066 0 00.723-1.745 a3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Certification & Career Support</h3>
              <p className="text-gray-800">
                Earn recognized certifications and get career support including resume reviews, interview prep, and job placement assistance.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Industry-recognized certificates</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Resume and LinkedIn profile optimization</span>
                </li>
                <li className="flex items-center text-black">
                  <div className="h-2 w-2 bg-black rounded-full mr-3"></div>
                  <span>Direct connections to hiring partners</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 px-6 bg-gray-50 border-b-2 border-black">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">
                Get In Touch With Us
              </h2>
              <p className="text-gray-800 text-lg max-w-2xl mx-auto">
                Have questions about our courses? Need help choosing the right learning path? 
                Contact our team and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg h-full border-2 border-black">
                  <h3 className="text-2xl font-bold mb-6 text-black">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 a2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black">Our Location</h4>
                        <p className="text-gray-700">123 Learning Street<br />Tech City, TC 10101</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black">Email Address</h4>
                        <p className="text-gray-700">support@coursemaster.com<br />admissions@coursemaster.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black">Phone Number</h4>
                        <p className="text-gray-700">+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t-2 border-black">
                      <h4 className="font-bold text-lg mb-4 text-black">Office Hours</h4>
                      <p className="text-gray-700">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Component */}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white border-b-2 border-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-2">30+</div>
              <div className="text-gray-800">Courses</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">250K+</div>
              <div className="text-gray-800">Students Enrolled</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">50+</div>
              <div className="text-gray-800">Expert Instructors</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">4.8</div>
              <div className="text-gray-800">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <Register 
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={handleSwitchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default App;