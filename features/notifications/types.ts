export interface NotificationData {
  title: string;
  message: string;
  ad_id?: number;
  type: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  created_at_diff: string;
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: Notification[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  data: {
    unread_count: number;
  };
}
