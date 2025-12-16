import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaArrowLeft } from 'react-icons/fa';
import { getAllPostsAdmin, deletePost } from '../utils/blogUtils';
import { toast } from 'react-toastify';

export default function BlogManager() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

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
    fetchPosts(userData.token);
  }, [navigate]);

  const fetchPosts = async (token) => {
    setLoading(true);
    const data = await getAllPostsAdmin(token);
    setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const result = await deletePost(id, user.token);
    if (result.success) {
      toast.success('Post deleted successfully');
      fetchPosts(user.token);
    } else {
      toast.error(result.message || 'Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    if (filter === 'featured') return post.featured;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/agent-dashboard')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition"
            >
              <FaArrowLeft className="text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-montserrat font-bold text-white">Blog Manager</h1>
              <p className="text-white/60 mt-1">Manage your travel blog posts</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/blog-editor')}
            className="flex items-center gap-2 px-6 py-3 bg-[#D9A441] hover:bg-[#D9A441]/90 text-white font-semibold rounded-lg transition"
          >
            <FaPlus /> Create New Post
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {['all', 'published', 'draft', 'featured'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-[#D9A441] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No posts found</p>
            <button
              onClick={() => navigate('/blog-editor')}
              className="px-6 py-3 bg-[#D9A441] hover:bg-[#D9A441]/90 text-white font-semibold rounded-lg transition"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-[#D9A441]/30 transition group"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {post.featured && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-[#D9A441] text-white text-xs font-bold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="px-2 py-1 bg-white/10 text-white/60 text-xs font-bold rounded">
                        {post.category}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      post.published 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition"
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => navigate(`/blog-editor/${post._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#D9A441]/20 hover:bg-[#D9A441]/30 text-[#D9A441] rounded-lg transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}