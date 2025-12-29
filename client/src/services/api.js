const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Helper method to make API requests
  async request(endpoint, method = 'GET', data = null) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include', // Important for CORS with credentials
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    try {
      const response = await this.request('/auth/register', 'POST', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      if (response.success && response.token) {
        this.setToken(response.token);
        this.setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', 'POST', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.success && response.token) {
        this.setToken(response.token);
        this.setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async getProfile() {
    return await this.request('/auth/profile', 'GET');
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // User management
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    this.removeToken();
  }
}

// Create singleton instance
const api = new ApiService();
export default api;