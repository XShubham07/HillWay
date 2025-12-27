

// Use relative path '/api' so it uses the Proxy defined in vite.config.js (pointing to port 3000)
const API_URL = 'https://admin.hillway.in/api';

export const getAllPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/blogs`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    // Fix: Return data.data because backend sends { success: true, data: [...] }
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPostBySlug = async (slug) => {
  try {
    // Fix: Backend expects query param ?slug=... not /slug
    const response = await fetch(`${API_URL}/blogs?slug=${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
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

export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (slug, postData) => {
  try {
    // Fix: Backend PUT expects /api/blogs (body contains _id)
    // We ignore the slug param in the URL since backend uses body ID
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    // Fix: Backend DELETE expects ?id=... query parameter
    const response = await fetch(`${API_URL}/blogs?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};