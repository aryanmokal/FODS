import { apiClient, isMockMode } from './apiClient';
import { mockStorage } from '../mock/mockStorage';
import { Post, Story, User, PaginatedResponse } from '../../types';

export const feedApi = {
  async getFeed(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    if (isMockMode()) {
      return mockStorage.getFeed(page, limit);
    }
    return apiClient.get<PaginatedResponse<Post>>('/feed', { params: { page, limit } });
  },

  async getRecommendedPosts(page = 1, limit = 12): Promise<Post[]> {
    if (isMockMode()) {
      return mockStorage.getExplorePosts();
    }
    return apiClient.get<Post[]>('/feed/recommendations', { params: { page, limit } });
  },

  async getExplorePosts(query?: string, tag?: string): Promise<Post[]> {
    if (isMockMode()) {
      return mockStorage.getExplorePosts(query, tag);
    }
    return apiClient.get<Post[]>('/explore', { params: { q: query, tag } });
  },

  async getStories(): Promise<Story[]> {
    if (isMockMode()) {
      return mockStorage.getStories();
    }
    return apiClient.get<Story[]>('/stories');
  },

  async getSuggestedUsers(): Promise<User[]> {
    if (isMockMode()) {
      return mockStorage.getSuggestedUsers();
    }
    return apiClient.get<User[]>('/users/suggestions');
  },
};
