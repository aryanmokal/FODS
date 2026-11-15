import {
  User,
  Post,
  Comment,
  Story,
  NotificationItem,
  CreatePostDto,
  UpdateProfileDto,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  PaginatedResponse,
} from '../../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_COMMENTS,
  MOCK_STORIES,
  MOCK_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'instads_current_user',
  USERS: 'instads_users',
  POSTS: 'instads_posts',
  COMMENTS: 'instads_comments',
  STORIES: 'instads_stories',
  NOTIFICATIONS: 'instads_notifications',
  TOKEN: 'instads_token',
};

// Helper for simulated network latency
export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

class MockStorage {
  private currentUser: User;
  private users: User[];
  private posts: Post[];
  private comments: Comment[];
  private stories: Story[];
  private notifications: NotificationItem[];

  constructor() {
    this.currentUser = this.load(STORAGE_KEYS.CURRENT_USER, CURRENT_USER);
    this.users = this.load(STORAGE_KEYS.USERS, MOCK_USERS);
    this.posts = this.load(STORAGE_KEYS.POSTS, MOCK_POSTS);
    this.comments = this.load(STORAGE_KEYS.COMMENTS, MOCK_COMMENTS);
    this.stories = this.load(STORAGE_KEYS.STORIES, MOCK_STORIES);
    this.notifications = this.load(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  }

  private load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private save(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // AUTH
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(350);
    const user = this.users.find(
      (u) =>
        u.username.toLowerCase() === credentials.usernameOrEmail.toLowerCase()
    ) || this.currentUser;

    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    this.currentUser = user;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    return { token, user: this.currentUser };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(400);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: credentials.username.toLowerCase().replace(/\s+/g, '_'),
      displayName: credentials.displayName || credentials.username,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      bio: 'New explorer on InstaDS 🌟',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isVerified: false,
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.save(STORAGE_KEYS.USERS, this.users);
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

    return { token, user: newUser };
  }

  async getCurrentUser(): Promise<User> {
    await delay(150);
    return { ...this.currentUser };
  }

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // POSTS & FEED
  async getFeed(page = 1, pageSize = 10): Promise<PaginatedResponse<Post>> {
    await delay(250);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = this.posts.slice(startIndex, endIndex);

    return {
      items: items.map((p) => ({ ...p })),
      total: this.posts.length,
      page,
      pageSize,
      hasMore: endIndex < this.posts.length,
    };
  }

  async getPostById(id: string | number): Promise<Post> {
    await delay(150);
    const post = this.posts.find((p) => String(p.id) === String(id));
    if (!post) throw new Error('Post not found');
    return { ...post };
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    await delay(350);
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: {
        id: this.currentUser.id,
        username: this.currentUser.username,
        displayName: this.currentUser.displayName,
        avatarUrl: this.currentUser.avatarUrl,
        isVerified: this.currentUser.isVerified,
      },
      imageUrl: dto.imageUrl,
      caption: dto.caption,
      location: dto.location,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isSaved: false,
      tags: dto.tags || [],
    };

    this.posts.unshift(newPost);
    this.currentUser.postsCount += 1;

    this.save(STORAGE_KEYS.POSTS, this.posts);
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    return { ...newPost };
  }

  async toggleLike(id: string | number): Promise<{ success: boolean; likesCount: number; isLiked: boolean }> {
    await delay(120);
    const post = this.posts.find((p) => String(p.id) === String(id));
    if (!post) throw new Error('Post not found');

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    this.save(STORAGE_KEYS.POSTS, this.posts);

    return {
      success: true,
      likesCount: post.likesCount,
      isLiked: post.isLiked,
    };
  }

  async toggleSave(id: string | number): Promise<{ success: boolean; isSaved: boolean }> {
    await delay(120);
    const post = this.posts.find((p) => String(p.id) === String(id));
    if (!post) throw new Error('Post not found');

    post.isSaved = !post.isSaved;
    this.save(STORAGE_KEYS.POSTS, this.posts);

    return {
      success: true,
      isSaved: post.isSaved,
    };
  }

  async deletePost(id: string | number): Promise<{ success: boolean }> {
    await delay(200);
    this.posts = this.posts.filter((p) => String(p.id) !== String(id));
    this.comments = this.comments.filter((c) => String(c.postId) !== String(id));
    this.currentUser.postsCount = Math.max(0, this.currentUser.postsCount - 1);

    this.save(STORAGE_KEYS.POSTS, this.posts);
    this.save(STORAGE_KEYS.COMMENTS, this.comments);
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    return { success: true };
  }

  // COMMENTS
  async getComments(postId: string | number): Promise<Comment[]> {
    await delay(150);
    return this.comments.filter((c) => String(c.postId) === String(postId));
  }

  async addComment(postId: string | number, text: string): Promise<Comment> {
    await delay(200);
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      author: {
        id: this.currentUser.id,
        username: this.currentUser.username,
        displayName: this.currentUser.displayName,
        avatarUrl: this.currentUser.avatarUrl,
        isVerified: this.currentUser.isVerified,
      },
      text,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };

    this.comments.push(newComment);

    const post = this.posts.find((p) => String(p.id) === String(postId));
    if (post) {
      post.commentsCount += 1;
      this.save(STORAGE_KEYS.POSTS, this.posts);
    }
    this.save(STORAGE_KEYS.COMMENTS, this.comments);

    return { ...newComment };
  }

  // USER & PROFILE
  async getUserByUsername(username: string): Promise<User> {
    await delay(180);
    if (username.toLowerCase() === this.currentUser.username.toLowerCase()) {
      return { ...this.currentUser };
    }
    const user = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (!user) {
      // Return a synthesized user profile if not strictly in mock list
      return {
        id: `usr_${username}`,
        username,
        displayName: username.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
        bio: 'InstaDS Creator & Community Member',
        followersCount: 154,
        followingCount: 92,
        postsCount: this.posts.filter((p) => p.author.username === username).length,
        isFollowing: false,
      };
    }
    return { ...user };
  }

  async getUserPosts(username: string): Promise<Post[]> {
    await delay(180);
    return this.posts.filter(
      (p) => p.author.username.toLowerCase() === username.toLowerCase()
    );
  }

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    await delay(300);
    this.currentUser = {
      ...this.currentUser,
      ...dto,
    };
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    // Update in users array
    const userIndex = this.users.findIndex((u) => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.currentUser };
      this.save(STORAGE_KEYS.USERS, this.users);
    }

    return { ...this.currentUser };
  }

  async toggleFollow(userId: string | number): Promise<{ isFollowing: boolean; followersCount: number }> {
    await delay(150);
    const user = this.users.find((u) => String(u.id) === String(userId));
    if (!user) throw new Error('User not found');

    user.isFollowing = !user.isFollowing;
    user.followersCount += user.isFollowing ? 1 : -1;
    this.currentUser.followingCount += user.isFollowing ? 1 : -1;

    this.save(STORAGE_KEYS.USERS, this.users);
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    return {
      isFollowing: user.isFollowing,
      followersCount: user.followersCount,
    };
  }

  async searchUsers(query: string): Promise<User[]> {
    await delay(150);
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q))
    );
  }

  // EXPLORE
  async getExplorePosts(query?: string, tag?: string): Promise<Post[]> {
    await delay(200);
    let results = [...this.posts];

    if (tag) {
      const t = tag.toLowerCase().replace('#', '');
      results = results.filter((p) =>
        p.tags?.some((item) => item.toLowerCase() === t) ||
        p.caption.toLowerCase().includes(`#${t}`)
      );
    } else if (query) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.caption.toLowerCase().includes(q) ||
          p.author.username.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }

  async getSavedPosts(): Promise<Post[]> {
    await delay(150);
    return this.posts.filter((p) => p.isSaved);
  }

  async getStories(): Promise<Story[]> {
    await delay(100);
    return [...this.stories];
  }

  async getSuggestedUsers(): Promise<User[]> {
    await delay(120);
    return this.users.filter((u) => u.id !== this.currentUser.id && !u.isFollowing);
  }

  // NOTIFICATIONS
  async getNotifications(): Promise<NotificationItem[]> {
    await delay(150);
    return [...this.notifications];
  }

  async markNotificationAsRead(id: string | number): Promise<void> {
    const notif = this.notifications.find((n) => String(n.id) === String(id));
    if (notif) {
      notif.read = true;
      this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.read = true));
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // RESET ALL DATA
  resetData(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    this.currentUser = CURRENT_USER;
    this.users = [...MOCK_USERS];
    this.posts = [...MOCK_POSTS];
    this.comments = [...MOCK_COMMENTS];
    this.stories = [...MOCK_STORIES];
    this.notifications = [...MOCK_NOTIFICATIONS];
  }
}

export const mockStorage = new MockStorage();
