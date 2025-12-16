// Blog API utilities
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://admin.hillway.in/api' 
  : 'http://localhost:3000/api';

// Get all published blog posts (public)
export const getAllPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts`);
    const data = await response.json();
    if (data.success) {
      return data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Get a single post by slug (public)
export const getPostBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

// Get posts by category (public)
export const getPostsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts?category=${category}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
};

// Get featured posts (public)
export const getFeaturedPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts?featured=true`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

// Admin APIs - Require authentication token

// Get all posts including drafts (admin)
export const getAllPostsAdmin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/blog/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return [];
  }
};

// Create new blog post (admin)
export const createPost = async (postData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/blog/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: error.message };
  }
};

// Update blog post (admin)
export const updatePost = async (id, postData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, message: error.message };
  }
};

// Delete blog post (admin)
export const deletePost = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/blog/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, message: error.message };
  }
};

// Upload image for blog post (admin)
export const uploadBlogImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/admin/blog/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, message: error.message };
  }
};