const API_BASE_URL = 'http://localhost:5000/api/elite';

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth-token', token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem('auth-token');
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  static async verifyOTP(email: string, otp: string) {
    const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error('OTP verification failed');
    }

    return response.json();
  }

  static async getAllProducts() {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/all`, {
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async getProduct(id: string) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async addProduct(productData: any) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData),
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async updateProduct(id: string, productData: any) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/update/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData),
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async deleteProduct(id: string) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/delete/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async bulkUploadProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/bulk/add`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async getUploadBatches() {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/bulk/batches`, {
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  static async rollbackUpload(uploadId: string) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };

    const response = await fetch(`${API_BASE_URL}/product/bulk/rollback/${uploadId}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication required');
    }

    return response.json();
  }
}