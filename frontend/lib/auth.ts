import { mockCustomer, type Customer } from './mock-data';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'kandypack_auth_user';

  static login(username: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    // Mock authentication - accept any username/password for demo
    if (username && password) {
      const user: AuthUser = {
        id: mockCustomer.id,
        name: mockCustomer.name,
        email: mockCustomer.email,
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  static register(name: string, email: string, username: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    // Mock registration - accept any valid data for demo
    if (name && email && username && password) {
      const user: AuthUser = {
        id: 1,
        name,
        email,
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, error: 'All fields are required' };
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getCurrentUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}