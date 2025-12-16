import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaImage, FaTimes } from 'react-icons/fa';
import { createPost, updatePost, getPostBySlug, uploadBlogImage } from '../utils/blogUtils';
import { toast } from 'react-toastify';

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'adventure',
    featured: false,
    published: false,
    readingTime: '',
    author: {
      name: '',
      role: 'Travel Expert',
      avatar: ''
    }
  });

  useEffect(() => {
    // Check for admin session
    const userStr = localStorage.getItem('hillway_user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== 'admin' && userData.role !== 'agent') {
      toast.error('Unauthorized access');
      navigate('/login');
      return;
    }

    setUser(userData);
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        name: userData.name || 'HillWay Team'
      }
    }));

    // If editing, load post data
    if (id) {
      loadPost(id);
    }
  }, [navigate, id]);

  const loadPost = async (postId) => {
    try {
      const post = await getPostBySlug(postId);
      if (post) {
        setFormData(post);
      }
    } catch (error) {
      toast.error('Failed to load post');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        [name]: value
      }
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !id ? generateSlug(title) : prev.slug // Only auto-generate for new posts
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const result = await uploadBlogImage(file, user.token);
    setUploading(false);

    if (result.success) {
      setFormData(prev => ({ ...prev, coverImage: result.data.url }));
      toast.success('Image uploaded successfully');
    } else {
      toast.error(result.message || 'Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = id 
      ? await updatePost(id, formData, user.token)
      : await createPost(formData, user.token);

    setLoading(false);

    if (result.success) {
      toast.success(`Post ${id ? 'updated' : 'created'} successfully`);
      navigate('/blog-manager');
    } else {
      toast.error(result.message || `Failed to ${id ? 'update' : 'create'} post`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/blog-manager')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-montserrat font-bold text-white">
              {id ? 'Edit' : 'Create'} Blog Post
            </h1>
            <p className="text-white/60 mt-1">Share your travel stories and insights</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <label className="block text-white font-semibold mb-3">Cover Image</label>
            {formData.coverImage ? (
              <div className="relative">
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#D9A441]/50 transition">
                <FaImage className="text-white/40 text-4xl mb-3" />
                <span className="text-white/60">Click to upload cover image</span>
                <span className="text-white/40 text-sm mt-1">Max size: 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && <p className="text-white/60 mt-2">Uploading...</p>}
          </div>

          {/* Title & Slug */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <label className="block text-white font-semibold mb-3">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D9A441]"
                placeholder="Enter post title"
              />
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <label className="block text-white font-semibold mb-3">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D9A441]"
                placeholder="post-url-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <label className="block text-white font-semibold mb-3">Excerpt *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D9A441]"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <label className="block text-white font-semibold mb-3">Content (Markdown) *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#D9A441]"
              placeholder="Write your post content in Markdown format..."
            />
          </div>

          {/* Category & Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <label className="block text-white font-semibold mb-3">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D9A441]"
              >
                <option value="adventure">Adventure</option>
                <option value="trekking">Trekking</option>
                <option value="culture">Culture</option>
                <option value="tips">Tips</option>
                <option value="guides">Guides</option>
              </select>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <label className="block text-white font-semibold mb-3">Reading Time</label>
              <input
                type="text"
                name="readingTime"
                value={formData.readingTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D9A441]"
                placeholder="e.g., 5 min read"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-white">Featured Post</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-white">Publish Immediately</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#D9A441] hover:bg-[#D9A441]/90 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blog-manager')}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}