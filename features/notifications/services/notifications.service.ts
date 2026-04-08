import api from '@/lib/api-client';
import { NotificationsResponse, UnreadCountResponse } from '../types';

export const notificationsService = {
  /**
   * Fetch all notifications with pagination
   */
  getNotifications: async (page: number = 1): Promise<NotificationsResponse> => {
    return api.get<NotificationsResponse>('/notifications', { query: { page } });
  },

  /**
   * Get unread notifications count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return api.get<UnreadCountResponse>('/notifications/unread');
  },

  /**
   * Delete a specific notification by ID
   */
  deleteNotification: async (id: string): Promise<{ status: boolean; message: string }> => {
    return api.delete<{ status: boolean; message: string }>(`/notifications/${id}`);
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async (): Promise<{ status: boolean; message: string }> => {
    return api.delete<{ status: boolean; message: string }>('/notifications/');
  },
};
