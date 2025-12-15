'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaImage, FaUpload } from 'react-icons/fa';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    author: 'HillWay Team',
    excerpt: '',
    category: 'Travel Tips',
    coverImage: '',
    tags: [],
    content: ''
  });
  const [tagInput, setTagInput] = useState('');
  
  // -- UPLOAD STATE --
  const [coverFile, setCoverFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const categories = ['Travel Tips', 'Destination Guides', 'Trekking', 'Local Culture', 'Adventure Tips'];

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // -- UPLOAD HANDLER --
  const handleUploadCover = async () => {
    if (!coverFile) {
      alert('Please choose an image file first');
      return;
    }

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append('file', coverFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // FormData automatically sets multipart/form-data headers
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error('Upload failed:', data);
        alert(data.error || 'Image upload failed');
        return;
      }

      // Success - use the returned URL
      setCurrentBlog(prev => ({
        ...prev,
        coverImage: data.url
      }));

      setCoverFile(null); // Clear file input
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!currentBlog.title || !currentBlog.content || !currentBlog.excerpt) {
      alert('Please fill in title, excerpt, and content');
      return;
    }

    try {
      const slug = currentBlog.slug || currentBlog.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = { ...currentBlog, slug };

      const res = await fetch('/api/blogs', {
        method: currentBlog._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert(currentBlog._id ? 'Blog updated!' : 'Blog published!');
        setIsEditing(false);
        resetForm();
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to save blog');
      }
    } catch (err) {
      alert('Error saving blog');
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id, slug) => {
    if (!confirm('Delete this blog post?')) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}&slug=${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Blog deleted!');
        fetchBlogs();
      }
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog({ ...blog });
    setCoverFile(null); // Reset file input when editing new post
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentBlog({
      title: '',
      date: new Date().toISOString().split('T')[0],
      author: 'HillWay Team',
      excerpt: '',
      category: 'Travel Tips',
      coverImage: '',
      tags: [],
      content: ''
    });
    setTagInput('');
    setCoverFile(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !currentBlog.tags.includes(tagInput.trim())) {
      setCurrentBlog({ ...currentBlog, tags: [...currentBlog.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setCurrentBlog({ ...currentBlog, tags: currentBlog.tags.filter(t => t !== tag) });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Blog Manager</h1>
        <button
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
        >
          <FaPlus /> New Blog Post
        </button>
      </div>

      {/* EDITOR MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1e293b] border-b border-gray-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white">
                {currentBlog._id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-lg font-bold focus:border-cyan-500 outline-none"
                  placeholder="Amazing Himalayan Trek Guide"
                  value={currentBlog.title}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Excerpt (SEO Description) *</label>
                <textarea
                  rows={3}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                  placeholder="A brief description for SEO and preview cards..."
                  value={currentBlog.excerpt}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                />
              </div>

              {/* Meta Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={currentBlog.date}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={currentBlog.author}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                  <select
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={currentBlog.category}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* --- COVER IMAGE SECTION --- */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                  <FaImage /> Cover Image
                </label>

                {/* URL Input */}
                <input
                  type="url"
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none mb-3 text-sm"
                  placeholder="Paste image URL here..."
                  value={currentBlog.coverImage}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, coverImage: e.target.value })}
                />
                
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span className="w-full h-[1px] bg-gray-700"></span>
                  <span>OR</span>
                  <span className="w-full h-[1px] bg-gray-700"></span>
                </div>

                {/* File Upload */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCoverFile(file);
                    }}
                    className="text-xs text-gray-300 file:mr-3 file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:bg-cyan-900/30 file:text-cyan-400 file:text-xs file:font-bold file:border-cyan-500/30 hover:file:bg-cyan-800/30 cursor-pointer w-full sm:w-auto"
                  />
                  <button
                    type="button"
                    onClick={handleUploadCover}
                    disabled={uploadingCover || !coverFile}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition whitespace-nowrap ${
                      uploadingCover || !coverFile
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {uploadingCover ? (
                      <span className="animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <FaUpload /> Upload Image
                      </>
                    )}
                  </button>
                </div>

                {/* Preview */}
                {currentBlog.coverImage && (
                  <div className="mt-4 relative group">
                    <img
                      src={currentBlog.coverImage}
                      alt="Cover Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-600 shadow-lg"
                    />
                    <div className="absolute top-2 right-2">
                       <button 
                         onClick={() => setCurrentBlog({...currentBlog, coverImage: ''})}
                         className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm transition"
                         title="Remove Image"
                       >
                         <FaTimes size={12} />
                       </button>
                    </div>
                  </div>
                )}
              </div>
              {/* --- END COVER IMAGE SECTION --- */}

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    placeholder="Add tag (e.g. hiking, mountains)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    onClick={addTag}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm border border-cyan-500/30 flex items-center gap-2"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Content (Markdown supported) *</label>
                <textarea
                  rows={16}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none leading-relaxed"
                  placeholder={`Write your blog content here...\n\n# Heading 1\n## Heading 2\n\nYour paragraph text...\n\n- List item 1\n- List item 2\n\n![Image Alt](https://image-url.com)`}
                  value={currentBlog.content}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2 text-right">Supports Markdown formatting</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                  onClick={handleSaveBlog}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <FaSave /> {currentBlog._id ? 'Update Blog Post' : 'Publish Blog Post'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOG LIST */}
      <div className="grid gap-4">
        {blogs.length === 0 && (
          <div className="bg-[#1e293b] p-12 rounded-2xl border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No blog posts yet. Create your first one!</p>
          </div>
        )}

        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-cyan-500/30 transition shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Cover Image */}
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full md:w-48 h-32 object-cover rounded-xl bg-black/20"
                />
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-500/30 uppercase font-bold tracking-wider">
                        {blog.category}
                      </span>
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <span>by {blog.author}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <a
                    href={`https://blogs.hillway.in/${blog.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                  >
                    <FaEye /> Preview
                  </a>
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id, blog.slug)}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
