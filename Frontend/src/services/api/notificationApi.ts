import { apiClient, isMockMode } from './apiClient';
import { mockStorage } from '../mock/mockStorage';
import { NotificationItem } from '../../types';

export const notificationApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (isMockMode()) {
      return mockStorage.getNotifications();
    }
    return apiClient.get<NotificationItem[]>('/notifications');
  },

  async markAsRead(id: string | number): Promise<void> {
    if (isMockMode()) {
      return mockStorage.markNotificationAsRead(id);
    }
    return apiClient.put<void>(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    if (isMockMode()) {
      return mockStorage.markAllNotificationsAsRead();
    }
    return apiClient.put<void>('/notifications/read-all');
  },
};
