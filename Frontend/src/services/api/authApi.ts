import { apiClient, isMockMode } from './apiClient';
import { mockStorage } from '../mock/mockStorage';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../../types';

export const authApi = {
  async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    if (isMockMode()) {
      return mockStorage.login(credentials);
    }
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (isMockMode()) {
      return mockStorage.register(credentials);
    }
    return apiClient.post<AuthResponse>('/auth/register', credentials);
  },

  async getCurrentUser(): Promise<User> {
    if (isMockMode()) {
      return mockStorage.getCurrentUser();
    }
    return apiClient.get<User>('/auth/me');
  },

  async logoutUser(): Promise<void> {
    if (isMockMode()) {
      return mockStorage.logout();
    }
    return apiClient.post<void>('/auth/logout');
  },
};
