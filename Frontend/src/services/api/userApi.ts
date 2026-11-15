import { apiClient, isMockMode } from './apiClient';
import { mockStorage } from '../mock/mockStorage';
import { User, Post, UpdateProfileDto } from '../../types';

export const userApi = {
  async getUserByUsername(username: string): Promise<User> {
    if (isMockMode()) {
      return mockStorage.getUserByUsername(username);
    }
    return apiClient.get<User>(`/users/${username}`);
  },

  async getUserPosts(username: string): Promise<Post[]> {
    if (isMockMode()) {
      return mockStorage.getUserPosts(username);
    }
    return apiClient.get<Post[]>(`/users/${username}/posts`);
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    if (isMockMode()) {
      return mockStorage.updateProfile(data);
    }
    return apiClient.put<User>('/users/me', data);
  },

  async followUser(userId: string | number): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (isMockMode()) {
      return mockStorage.toggleFollow(userId);
    }
    return apiClient.post<{ isFollowing: boolean; followersCount: number }>(`/users/${userId}/follow`);
  },

  async unfollowUser(userId: string | number): Promise<{ isFollowing: boolean; followersCount: number }> {
    if (isMockMode()) {
      return mockStorage.toggleFollow(userId);
    }
    return apiClient.delete<{ isFollowing: boolean; followersCount: number }>(`/users/${userId}/follow`);
  },

  async searchUsers(query: string): Promise<User[]> {
    if (isMockMode()) {
      return mockStorage.searchUsers(query);
    }
    return apiClient.get<User[]>('/users/search', { params: { q: query } });
  },
};
