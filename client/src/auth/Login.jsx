import { useState } from 'react';
import api from '../services/api';

function Login({ onClose, onSwitchToRegister, onLoginSuccess }) {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (loginErrors[name]) {
      setLoginErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear server error
    if (serverError) {
      setServerError('');
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!loginForm.password) {
      errors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLoginErrors({});
    setServerError('');
    
    // Validate form
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    // Start loading
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const credentials = {
        email: loginForm.email.trim(),
        password: loginForm.password
      };
      
      console.log('Attempting login with:', { ...credentials, password: '***' });
      
      // Call API login
      const response = await api.login(credentials);
      
      console.log('Login response:', response);
      
      if (response.success) {
        // Show success message
        console.log('Login successful! User:', response.user);
        
        // Reset form
        setLoginForm({
          email: '',
          password: ''
        });
        
        setLoginErrors({});
        
        // Call success callback
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }
        
        // Close modal
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 100);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      let errorMessage = error.message || 'Login failed. Please try again.';
      
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('CONNECTION_REFUSED')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend is running on http://localhost:5000';
      } else if (error.message.includes('Invalid') || 
                 error.message.includes('invalid') ||
                 error.message.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Invalid login data. Please check your inputs.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Invalid email or password.';
      }
      
      setServerError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password reset feature would be implemented here. For now, please contact support.');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-black my-8 scale-75">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-black">Welcome Back</h3>
          <button 
            onClick={onClose}
            className="text-black hover:text-gray-700 text-2xl transition-colors disabled:opacity-50"
            disabled={isLoading}
            type="button"
          >
            &times;
          </button>
        </div>
        
        <p className="text-gray-700 mb-6">
          Sign in to continue your learning journey with CourseMaster.
        </p>
        
        {/* Server Error Display */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 rounded-lg animate-fadeIn">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-600 font-medium">Login Error</p>
                <p className="text-red-600 text-sm mt-1">{serverError}</p>
                {serverError.includes('Cannot connect to the server') && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold">To fix this:</p>
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li>Open a new terminal</li>
                      <li>Navigate to your server folder: <code className="bg-gray-100 px-1 rounded">cd server</code></li>
                      <li>Start the backend: <code className="bg-gray-100 px-1 rounded">npm run dev</code></li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleLoginSubmit} noValidate>
          <div className="space-y-6">
            <div>
              <label className="block text-black mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input 
                type="email"
                name="email"
                className={`w-full p-3 bg-white border-2 ${loginErrors.email ? 'border-red-600' : 'border-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                placeholder="student@example.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                disabled={isLoading}
                autoComplete="email"
              />
              {loginErrors.email && (
                <p className="text-red-600 text-sm mt-1 animate-fadeIn">{loginErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-black mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full p-3 pr-12 bg-white border-2 ${loginErrors.password ? 'border-red-600' : 'border-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-black hover:text-gray-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="text-red-600 text-sm mt-1 animate-fadeIn">{loginErrors.password}</p>
              )}
              <p className="text-gray-600 text-xs mt-1">
                Must be at least 6 characters long
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  className="h-5 w-5 text-black rounded focus:ring-black border-2 border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                <span className={`ml-2 text-sm text-gray-700 ${isLoading ? 'opacity-70' : ''}`}>
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className={`text-sm text-black hover:underline font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white transition-all duration-300 font-medium border-2 border-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
            
            <div className="text-center">
              <p className="text-gray-700">
                Don't have an account?{" "}
                <button 
                  type="button"
                  onClick={onSwitchToRegister}
                  disabled={isLoading}
                  className={`text-black hover:underline font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Create account
                </button>
              </p>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-700">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                disabled={isLoading}
                className={`flex items-center justify-center px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Google sign in would be implemented here');
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                type="button"
                disabled={isLoading}
                className={`flex items-center justify-center px-4 py-3 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Facebook sign in would be implemented here');
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t-2 border-black">
          <h4 className="font-bold text-black mb-3">Benefits of being logged in:</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-black mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Access your enrolled courses
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-black mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Track your learning progress
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-black mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save courses to your wishlist
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-black mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Get personalized recommendations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;