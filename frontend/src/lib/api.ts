import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const createPost = async (postData: { title: string; content: string; department: string; type: string; tags?: string }) => {
  const response = await api.post("/posts/", postData);
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get("/posts/");
  return response.data;
};

// Comments
export const getComments = async (postId: number) => {
  const response = await api.get(`/posts/${postId}/comments/`);
  return response.data;
};

export const createComment = async (postId: number, content: string, parentId?: number) => {
  // Mock author_id for now as we don't have full auth context in frontend
  const authorId = 1;
  const response = await api.post(`/posts/${postId}/comments/`, {
    content
  }, {
  });
  return response.data;
};

export const deleteComment = async (postId: number, commentId: number) => {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
};

// Reactions
export const toggleReaction = async (targetType: 'post' | 'comment', targetId: number, emoji: string) => {
  // Mock user_id
  const userId = 1;
  const response = await api.post("/reactions/", {
    user_id: userId,
    emoji,
    target_type: targetType,
    target_id: targetId
  });
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    return null; // Not logged in
  }
};

// Notifications
export const getNotifications = async (skip = 0, limit = 20) => {
  const response = await api.get(`/notifications/?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const markNotificationRead = async (notificationId: number) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put(`/notifications/read-all`);
  return response.data;
};

export default api;
