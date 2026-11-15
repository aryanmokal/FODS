export interface User {
  id: string | number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export interface PostAuthor {
  id: string | number;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export interface Post {
  id: string | number;
  author: PostAuthor;
  imageUrl: string;
  caption: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  tags?: string[];
}

export interface Comment {
  id: string | number;
  postId: string | number;
  author: PostAuthor;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Story {
  id: string | number;
  user: PostAuthor;
  mediaUrl: string;
  seen: boolean;
  createdAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

export interface NotificationItem {
  id: string | number;
  type: NotificationType;
  actor: PostAuthor;
  post?: {
    id: string | number;
    imageUrl: string;
  };
  commentText?: string;
  read: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreatePostDto {
  imageUrl: string;
  caption: string;
  location?: string;
  tags?: string[];
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  website?: string;
  avatarUrl?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}
