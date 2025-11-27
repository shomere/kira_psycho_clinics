// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available - FIX: use 'token' instead of 'authToken'
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired, clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle empty responses
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Therapist endpoints
  async getTherapists(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/therapists?${queryParams}`);
  }

  async getTherapist(id) {
    return this.request(`/therapists/${id}`);
  }

  // Appointment endpoints - FIXED: include user ID
  async bookAppointment(appointmentData) {
    return this.request('/appointments/book', { // FIX: endpoint matches backend
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getUserAppointments(userId) { // FIX: require user ID parameter
    if (!userId) {
      throw new Error('User ID is required to fetch appointments');
    }
    return this.request(`/appointments/user/${userId}`);
  }

  async getTherapistAppointments(therapistId) {
    return this.request(`/appointments/therapist/${therapistId}`);
  }

  async cancelAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Availability endpoints
  async getTherapistAvailability(therapistId) {
    return this.request(`/availability/${therapistId}`);
  }

  async addAvailabilitySlot(slotData) {
    return this.request('/availability/slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  // Specializations
  async getSpecializations() {
    return this.request('/specializations');
  }
}

export default new ApiService();