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
      console.warn("Session expired or invalid token. Redirecting to login...");
      // Clear invalid token
      localStorage.removeItem("token");

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        // Use full reload to clear all application state
        window.location.href = '/login?reason=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

export const createPost = async (postData: { title: string; content: string; department: string; type: string; tags?: string }) => {
  const response = await api.post("/posts/", postData);
  return response.data;
};


export const getPosts = async (department?: string) => {
  const url = department && department !== 'ALL' ? `/posts/?department=${department}` : "/posts/";
  const response = await api.get(url);
  return response.data;
};

export const getCampusNews = async () => {
  try {
    const response = await api.get("/news/");
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch news, using fallback.");
    return [];
  }
};

// Comments
export const getComments = async (postId: number) => {
  const response = await api.get(`/posts/${postId}/comments/`);
  return response.data;
};

export const createComment = async (postId: number, content: string, parentId?: number) => {
  const response = await api.post(`/posts/${postId}/comments/`, {
    content
  });
  return response.data;
};

export const deleteComment = async (postId: number, commentId: number) => {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
};

// Reactions
export const toggleReaction = async (targetType: 'post' | 'comment', targetId: number, emoji: string) => {
  const response = await api.post("/reactions/", {
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

// Profile Update
export interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  bio?: string;
  department?: string;
  profile_photo_url?: string;
}

export const updateProfile = async (data: ProfileUpdateData) => {
  const response = await api.put("/users/me", data);
  return response.data;
};

export default api;
