// Blog post utilities
import blogPosts from '../data/blogPosts.json';

// Get all blog posts
export const getAllPosts = async () => {
  // Sort by date, newest first
  return blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get a single post by slug
export const getPostBySlug = async (slug) => {
  const post = blogPosts.find(post => post.slug === slug);
  return post || null;
};

// Get posts by category
export const getPostsByCategory = async (category) => {
  return blogPosts.filter(post => post.category === category);
};

// Get featured posts
export const getFeaturedPosts = async () => {
  return blogPosts.filter(post => post.featured);
};