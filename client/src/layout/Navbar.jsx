import { useState } from 'react';

function Navbar({ isLoggedIn, onLogoutClick, onLoginClick, onRegisterClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-black">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center font-bold text-lg text-white border-2 border-black">
            C
          </div>
          <span className="text-2xl font-bold text-black">
            Coursin
          </span>
        </div>
        
        {/* Hamburger Menu Button (Mobile) */}
        <button 
          className="md:hidden text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="hover:text-blue-600 transition-colors duration-300 font-medium text-black">Home</a>
          <a href="#courses" className="hover:text-blue-600 transition-colors duration-300 font-medium text-black">Courses</a>
          <a href="#features" className="hover:text-blue-600 transition-colors duration-300 font-medium text-black">Features</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors duration-300 font-medium text-black">Contact</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Student!</span>
              <button 
                onClick={onLogoutClick}
                className="px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium border-2 border-black"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onRegisterClick}
                className="px-6 py-2 rounded-lg border-2 border-black hover:bg-gray-100 transition-all duration-300 font-medium"
              >
                Sign Up
              </button>
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium shadow-md border-2 border-black"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-black px-6 py-4">
          <div className="flex flex-col space-y-4">
            <a href="#home" className="hover:text-blue-600 transition-colors duration-300 font-medium py-2 text-black" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#courses" className="hover:text-blue-600 transition-colors duration-300 font-medium py-2 text-black" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#features" className="hover:text-blue-600 transition-colors duration-300 font-medium py-2 text-black" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors duration-300 font-medium py-2 text-black" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            
            <div className="pt-4 border-t-2 border-black">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-gray-700">Welcome, Student!</span>
                  <button 
                    onClick={onLogoutClick}
                    className="px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium border-2 border-black"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => {
                      onRegisterClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 rounded-lg border-2 border-black hover:bg-gray-100 transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium border-2 border-black"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;