const API_BASE_URL = 'http://localhost:8002/api';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  user?: T;
  token?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(data: LoginData): Promise<ApiResponse> {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/logout', {
      method: 'POST',
    });
    
    this.removeToken();
    return response;
  }

  async getUser(): Promise<ApiResponse> {
    return this.request('/me', {
      method: 'GET',
    });
  }

  async getPosts(): Promise<ApiResponse> {
    return this.request('/posts', {
      method: 'GET',
    });
  }

  async createPost(content: string): Promise<ApiResponse> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const api = new ApiService();
export type { RegisterData, LoginData, ApiResponse };
