import { apiClient, isMockMode } from './apiClient';
import { mockStorage } from '../mock/mockStorage';
import { Post, Comment, CreatePostDto, PaginatedResponse } from '../../types';

export const postApi = {
  async getPosts(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
    if (isMockMode()) {
      return mockStorage.getFeed(page, limit);
    }
    return apiClient.get<PaginatedResponse<Post>>('/posts', {
      params: { page, limit },
    });
  },

  async getPostById(id: string | number): Promise<Post> {
    if (isMockMode()) {
      return mockStorage.getPostById(id);
    }
    return apiClient.get<Post>(`/posts/${id}`);
  },

  async createPost(data: CreatePostDto): Promise<Post> {
    if (isMockMode()) {
      return mockStorage.createPost(data);
    }
    return apiClient.post<Post>('/posts', data);
  },

  async likePost(id: string | number): Promise<{ success: boolean; likesCount: number; isLiked: boolean }> {
    if (isMockMode()) {
      return mockStorage.toggleLike(id);
    }
    return apiClient.post<{ success: boolean; likesCount: number; isLiked: boolean }>(`/posts/${id}/like`);
  },

  async unlikePost(id: string | number): Promise<{ success: boolean; likesCount: number; isLiked: boolean }> {
    if (isMockMode()) {
      return mockStorage.toggleLike(id);
    }
    return apiClient.delete<{ success: boolean; likesCount: number; isLiked: boolean }>(`/posts/${id}/like`);
  },

  async savePost(id: string | number): Promise<{ success: boolean; isSaved: boolean }> {
    if (isMockMode()) {
      return mockStorage.toggleSave(id);
    }
    return apiClient.post<{ success: boolean; isSaved: boolean }>(`/posts/${id}/save`);
  },

  async unsavePost(id: string | number): Promise<{ success: boolean; isSaved: boolean }> {
    if (isMockMode()) {
      return mockStorage.toggleSave(id);
    }
    return apiClient.delete<{ success: boolean; isSaved: boolean }>(`/posts/${id}/save`);
  },

  async deletePost(id: string | number): Promise<{ success: boolean }> {
    if (isMockMode()) {
      return mockStorage.deletePost(id);
    }
    return apiClient.delete<{ success: boolean }>(`/posts/${id}`);
  },

  async getComments(postId: string | number): Promise<Comment[]> {
    if (isMockMode()) {
      return mockStorage.getComments(postId);
    }
    return apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  },

  async commentOnPost(postId: string | number, text: string): Promise<Comment> {
    if (isMockMode()) {
      return mockStorage.addComment(postId, text);
    }
    return apiClient.post<Comment>(`/posts/${postId}/comments`, { text });
  },

  async getSavedPosts(): Promise<Post[]> {
    if (isMockMode()) {
      return mockStorage.getSavedPosts();
    }
    return apiClient.get<Post[]>('/posts/saved');
  },
};
