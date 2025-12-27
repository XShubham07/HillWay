'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaImage, FaUpload, FaStar, FaImages, FaFileImage, FaArrowUp, FaArrowDown, FaList, FaCheckCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function blogManager() {
  const [blogs, setblogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentblog, setCurrentblog] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    author: 'HillWay Team',
    excerpt: '',
    category: 'Travel Tips',
    coverImage: '',
    tags: [],
    contentBoxes: [{
      id: Date.now(),
      heading: '',
      content: '',
      images: []
    }],
    featured: false,
    published: true,
    readingTime: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [uploadingImages, setUploadingImages] = useState({});

  const categories = [
    'Travel Tips',
    'Destination Guides', 
    'Trekking',
    'Local Culture',
    'Adventure Tips',
    'Mountain Safety',
    'Photography'
  ];

  // Fetch blogs
  const fetchblogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (data.success) {
        const filteredblogs = data.data.filter(blog => {
          const hasUnsplashCover = blog.coverImage?.includes('unsplash.com');
          return !hasUnsplashCover;
        });
        setblogs(filteredblogs);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  useEffect(() => {
    fetchblogs();
  }, []);

  // Content Box Management
  const addContentBox = () => {
    setCurrentblog({
      ...currentblog,
      contentBoxes: [...currentblog.contentBoxes, {
        id: Date.now(),
        heading: '',
        content: '',
        images: []
      }]
    });
  };

  const removeContentBox = (id) => {
    if (currentblog.contentBoxes.length === 1) return;
    setCurrentblog({
      ...currentblog,
      contentBoxes: currentblog.contentBoxes.filter(box => box.id !== id)
    });
  };

  const updateContentBox = (id, field, value) => {
    setCurrentblog({
      ...currentblog,
      contentBoxes: currentblog.contentBoxes.map(box =>
        box.id === id ? { ...box, [field]: value } : box
      )
    });
  };

  const moveContentBox = (index, direction) => {
    const newBoxes = [...currentblog.contentBoxes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBoxes.length) return;
    [newBoxes[index], newBoxes[targetIndex]] = [newBoxes[targetIndex], newBoxes[index]];
    setCurrentblog({ ...currentblog, contentBoxes: newBoxes });
  };

  // Image Upload for Content Box
  const handleBoxImageUpload = async (boxId, files) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(prev => ({ ...prev, [boxId]: true }));
      const uploaded = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success) {
          uploaded.push({ 
            id: Date.now() + Math.random(), 
            url: data.url, 
            alt: file.name.replace(/\.[^/.]+$/, '') 
          });
        }
      }

      setCurrentblog({
        ...currentblog,
        contentBoxes: currentblog.contentBoxes.map(box =>
          box.id === boxId
            ? { ...box, images: [...box.images, ...uploaded] }
            : box
        )
      });

      alert(`${uploaded.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading images');
    } finally {
      setUploadingImages(prev => ({ ...prev, [boxId]: false }));
    }
  };

  const removeBoxImage = (boxId, imageId) => {
    setCurrentblog({
      ...currentblog,
      contentBoxes: currentblog.contentBoxes.map(box =>
        box.id === boxId
          ? { ...box, images: box.images.filter(img => img.id !== imageId) }
          : box
      )
    });
  };

  const updateImageAlt = (boxId, imageId, newAlt) => {
    setCurrentblog({
      ...currentblog,
      contentBoxes: currentblog.contentBoxes.map(box =>
        box.id === boxId
          ? {
              ...box,
              images: box.images.map(img =>
                img.id === imageId ? { ...img, alt: newAlt } : img
              )
            }
          : box
      )
    });
  };

  // Cover Image Upload
  const handleCoverImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingImages(prev => ({ ...prev, cover: true }));
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentblog({ ...currentblog, coverImage: data.url });
        alert('Cover image uploaded successfully!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploadingImages(prev => ({ ...prev, cover: false }));
    }
  };

  const calculateReadingTime = (boxes) => {
    const wordsPerMinute = 200;
    const allContent = boxes.map(box => box.content).join(' ');
    const words = allContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // SEPARATE SAVE FUNCTIONS
  const handleSaveAsDraft = async () => {
    await saveblog(false); // published = false
  };

  const handlePublish = async () => {
    await saveblog(true); // published = true
  };

  const saveblog = async (publishStatus) => {
    if (!currentblog.title || !currentblog.excerpt || currentblog.contentBoxes.length === 0) {
      alert('Please fill in title, excerpt, and at least one content box');
      return;
    }

    // Check if at least one box has content
    const hasContent = currentblog.contentBoxes.some(box => box.heading || box.content || box.images.length > 0);
    if (!hasContent) {
      alert('Please add content to at least one section');
      return;
    }

    try {
      setSaving(true);
      const slug = currentblog.slug || currentblog.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const readingTime = currentblog.readingTime || calculateReadingTime(currentblog.contentBoxes);

      // Convert contentBoxes to traditional content format for backward compatibility
      const content = currentblog.contentBoxes.map((box, index) => {
        let boxContent = '';
        if (box.heading) {
          boxContent += `## ${box.heading}\n\n`;
        }
        if (box.images && box.images.length > 0) {
          box.images.forEach(img => {
            boxContent += `![${img.alt || 'Image'}](${img.url})\n\n`;
          });
        }
        if (box.content) {
          boxContent += box.content + '\n\n';
        }
        return boxContent;
      }).join('\n');

      const payload = { 
        ...currentblog,
        content, // for backward compatibility
        contentBoxes: currentblog.contentBoxes, // keep the structured data
        slug,
        readingTime,
        published: publishStatus // Use the passed status
      };

      console.log('Saving blog with payload:', payload);

      const res = await fetch('/api/blogs', {
        method: currentblog._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (data.success) {
        const statusText = publishStatus ? 'published' : 'saved as draft';
        alert(`blog post ${currentblog._id ? 'updated' : 'created'} and ${statusText} successfully!`);
        setIsEditing(false);
        setPreviewMode(false);
        resetForm();
        fetchblogs();
      } else {
        alert(data.error || 'Failed to save blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Error saving blog: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteblog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('blog deleted successfully!');
        fetchblogs();
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Failed to delete blog');
      console.error(err);
    }
  };

  const handleEditblog = (blog) => {
    // Convert old content format to contentBoxes if needed
    let contentBoxes = blog.contentBoxes;
    if (!contentBoxes || contentBoxes.length === 0) {
      contentBoxes = [{
        id: Date.now(),
        heading: '',
        content: blog.content || '',
        images: blog.contentImages?.map(img => ({
          id: Date.now() + Math.random(),
          url: typeof img === 'string' ? img : img.url,
          alt: typeof img === 'object' ? img.alt : ''
        })) || []
      }];
    }

    setCurrentblog({ 
      ...blog,
      contentBoxes
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentblog({
      title: '',
      date: new Date().toISOString().split('T')[0],
      author: 'HillWay Team',
      excerpt: '',
      category: 'Travel Tips',
      coverImage: '',
      tags: [],
      contentBoxes: [{
        id: Date.now(),
        heading: '',
        content: '',
        images: []
      }],
      featured: false,
      published: true,
      readingTime: ''
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !currentblog.tags.includes(tagInput.trim())) {
      setCurrentblog({ ...currentblog, tags: [...currentblog.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setCurrentblog({ ...currentblog, tags: currentblog.tags.filter(t => t !== tag) });
  };

  const filteredblogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    if (filter === 'published') return blog.published;
    if (filter === 'draft') return !blog.published;
    if (filter === 'featured') return blog.featured;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">blog Manager</h1>
          <p className="text-gray-400 mt-1">Create stunning blog posts with multiple content sections</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
        >
          <FaPlus /> New blog Post
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        {['all', 'published', 'draft', 'featured'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === tab
                ? 'bg-cyan-600 text-white'
                : 'bg-[#1e293b] text-gray-400 hover:bg-[#2a3a52]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* EDITOR MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1e293b] border-b border-gray-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white">
                {currentblog._id ? 'Edit blog Post' : 'Create New blog Post'}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <FaEye /> {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition">
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {!previewMode ? (
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Title *</label>
                    <input
                      type="text"
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-lg font-bold focus:border-cyan-500 outline-none"
                      placeholder="Amazing Himalayan Trek Guide"
                      value={currentblog.title}
                      onChange={(e) => setCurrentblog({ ...currentblog, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Excerpt *</label>
                    <textarea
                      rows={3}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                      placeholder="Brief description..."
                      value={currentblog.excerpt}
                      onChange={(e) => setCurrentblog({ ...currentblog, excerpt: e.target.value })}
                    />
                  </div>
                </div>

                {/* Meta Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Date</label>
                    <input type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={currentblog.date} onChange={(e) => setCurrentblog({ ...currentblog, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Author</label>
                    <input type="text" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={currentblog.author} onChange={(e) => setCurrentblog({ ...currentblog, author: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <select className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={currentblog.category} onChange={(e) => setCurrentblog({ ...currentblog, category: e.target.value })}>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Reading Time</label>
                    <input type="text" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="Auto-calculated" value={currentblog.readingTime} onChange={(e) => setCurrentblog({ ...currentblog, readingTime: e.target.value })} />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 bg-black/20 p-4 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentblog.featured} onChange={(e) => setCurrentblog({ ...currentblog, featured: e.target.checked })} className="w-5 h-5" />
                    <span className="text-white font-medium flex items-center gap-2"><FaStar className="text-yellow-400" /> Featured</span>
                  </label>
                </div>

                {/* Cover Image */}
                <div className="bg-black/20 p-4 rounded-xl">
                  <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2"><FaImage /> Cover Image</label>
                  <div className="flex flex-col gap-3">
                    <input type="url" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none text-sm" placeholder="Paste URL or upload below..." value={currentblog.coverImage} onChange={(e) => setCurrentblog({ ...currentblog, coverImage: e.target.value })} />
                    <div className="flex gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleCoverImageUpload(e.target.files[0])} 
                        className="text-xs text-gray-300 file:mr-3 file:px-4 file:py-2.5 file:rounded-lg file:border-0 file:bg-cyan-900/30 file:text-cyan-400 file:text-xs file:font-bold hover:file:bg-cyan-800/30 cursor-pointer flex-1" 
                      />
                      {uploadingImages.cover && <span className="text-cyan-400 text-xs animate-pulse flex items-center">Uploading...</span>}
                    </div>
                  </div>
                  {currentblog.coverImage && (
                    <div className="mt-4 relative group">
                      <img src={currentblog.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg border border-gray-600" />
                      <button onClick={() => setCurrentblog({...currentblog, coverImage: ''})} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full"><FaTimes size={12} /></button>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="Add tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <button onClick={addTag} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-bold">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentblog.tags.map(tag => (
                      <span key={tag} className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-full text-sm border border-cyan-500/30 flex items-center gap-2">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-400"><FaTimes size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Boxes */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FaList className="text-cyan-400" />
                      Content Sections
                    </h3>
                    <button
                      onClick={addContentBox}
                      className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                      <FaPlus /> Add Section
                    </button>
                  </div>

                  {currentblog.contentBoxes.map((box, index) => (
                    <div key={box.id} className="bg-black/30 border border-gray-600 rounded-xl p-6 space-y-4">
                      {/* Box Header */}
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <span className="px-3 py-1 bg-cyan-600 text-white rounded-full text-sm">
                            {index + 1}
                          </span>
                          Section {index + 1}
                        </h4>
                        <div className="flex gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveContentBox(index, 'up')}
                              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                              title="Move up"
                            >
                              <FaArrowUp />
                            </button>
                          )}
                          {index < currentblog.contentBoxes.length - 1 && (
                            <button
                              onClick={() => moveContentBox(index, 'down')}
                              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                              title="Move down"
                            >
                              <FaArrowDown />
                            </button>
                          )}
                          <button
                            onClick={() => removeContentBox(box.id)}
                            disabled={currentblog.contentBoxes.length === 1}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete section"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* Heading */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Section Heading (appears in TOC)</label>
                        <input
                          type="text"
                          value={box.heading}
                          onChange={(e) => updateContentBox(box.id, 'heading', e.target.value)}
                          placeholder="e.g., Best Time to Visit, Getting There, Things to Do"
                          className="w-full bg-black/40 border border-gray-600 rounded-lg p-3 text-white placeholder-white/40 focus:border-cyan-500 outline-none"
                        />
                      </div>

                      {/* Images */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Images (displayed above content)</label>
                        <div className="flex flex-wrap gap-3 mb-3">
                          {box.images.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-32 h-32 object-cover rounded-xl border-2 border-white/20"
                              />
                              <input
                                type="text"
                                value={image.alt}
                                onChange={(e) => updateImageAlt(box.id, image.id, e.target.value)}
                                placeholder="Alt text"
                                className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition"
                              />
                              <button
                                onClick={() => removeBoxImage(box.id, image.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                              >
                                <FaTrash size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg transition text-sm font-bold">
                          <FaImage /> Add Images
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleBoxImageUpload(box.id, e.target.files)}
                            className="hidden"
                          />
                        </label>
                        {uploadingImages[box.id] && <span className="ml-3 text-purple-400 text-xs animate-pulse">Uploading...</span>}
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Content (Markdown)</label>
                        <textarea
                          value={box.content}
                          onChange={(e) => updateContentBox(box.id, 'content', e.target.value)}
                          placeholder="Write content in markdown...\n\n### Subheading\n- Point 1\n- Point 2\n\n**Bold** and *italic*"
                          rows="10"
                          className="w-full bg-black/40 border border-gray-600 rounded-lg p-4 text-white placeholder-white/40 focus:border-cyan-500 outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEPARATE SAVE BUTTONS */}
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <button 
                    onClick={handleSaveAsDraft} 
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
                  >
                    <FaSave /> {saving ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button 
                    onClick={handlePublish} 
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
                  >
                    <FaCheckCircle /> {saving ? 'Publishing...' : 'Publish Now'}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition">Cancel</button>
                </div>
              </div>
            ) : (
              // Preview Mode (same as before)
              <div className="p-6">
                {/* Preview TOC */}
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="bg-black/20 p-6 rounded-xl border border-gray-600">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <FaList className="text-cyan-400" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {currentblog.contentBoxes.filter(box => box.heading).map((box, index) => (
                        <div key={box.id} className="text-white/70 hover:text-white py-2 px-3 hover:bg-white/10 rounded-lg transition text-sm">
                          {index + 1}. {box.heading}
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="max-w-4xl mx-auto space-y-12">
                  {currentblog.contentBoxes.map((box, index) => (
                    <article
                      key={box.id}
                      className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-300"
                    >
                      {/* Box Number Badge */}
                      <div className="absolute top-6 left-6 z-10">
                        <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </div>

                      {/* Images Gallery */}
                      {box.images.length > 0 && (
                        <div className="relative">
                          {box.images.length === 1 ? (
                            <img
                              src={box.images[0].url}
                              alt={box.images[0].alt}
                              className="w-full h-80 object-cover"
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-2 p-2">
                              {box.images.slice(0, 4).map((image, imgIndex) => (
                                <img
                                  key={image.id}
                                  src={image.url}
                                  alt={image.alt}
                                  className={`object-cover rounded-xl ${
                                    imgIndex === 0 && box.images.length > 2
                                      ? 'col-span-2 h-64'
                                      : 'h-48'
                                  }`}
                                />
                              ))}
                              {box.images.length > 4 && (
                                <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white rounded-full text-sm font-medium">
                                  +{box.images.length - 4} more
                                </div>
                              )}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e293b]/80"></div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8 md:p-12">
                        {box.heading && (
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 pb-3 border-b-2 border-cyan-600/30">
                            {box.heading}
                          </h2>
                        )}

                        {box.content && (
                          <div className="prose-custom text-white">
                            <ReactMarkdown
                              components={{
                                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-white mb-4 mt-8" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
                                p: ({node, ...props}) => <p className="text-white/80 text-lg leading-relaxed mb-6" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-3 mb-6" {...props} />,
                                li: ({node, ...props}) => (
                                  <li className="text-white/80 text-lg leading-relaxed ml-6 pl-2 relative before:content-['▸'] before:absolute before:left-[-20px] before:text-cyan-400" {...props} />
                                ),
                                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                                em: ({node, ...props}) => <em className="italic text-cyan-400" {...props} />,
                                code: ({node, inline, ...props}) => 
                                  inline 
                                    ? <code className="bg-cyan-600/20 px-2 py-1 rounded text-cyan-400 font-mono text-sm" {...props} />
                                    : <code className="block bg-black/40 border border-white/10 p-6 rounded-xl my-6 overflow-x-auto text-sm text-white/90 font-mono" {...props} />,
                                blockquote: ({node, ...props}) => (
                                  <blockquote className="border-l-4 border-cyan-600 bg-cyan-600/5 pl-6 pr-4 py-4 my-6 italic text-white/80 text-xl" {...props} />
                                ),
                              }}
                            >
                              {box.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-600/10 to-transparent rounded-tl-full"></div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* blog LIST (same as before) */}
      <div className="grid gap-4">
        {filteredblogs.length === 0 && (
          <div className="bg-[#1e293b] p-12 rounded-2xl border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No blog posts yet. Create your first one!</p>
          </div>
        )}

        {filteredblogs.map((blog) => (
          <div key={blog._id} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-cyan-500/30 transition shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full md:w-48 h-32 object-cover rounded-xl" />}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                      {blog.featured && <FaStar className="text-yellow-400" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${blog.published ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'}`}>{blog.published ? 'Published' : 'Draft'}</span>
                      <span className="bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-500/30 uppercase font-bold">{blog.category}</span>
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <span>by {blog.author}</span>
                      {blog.readingTime && <span>• {blog.readingTime}</span>}
                      {blog.contentBoxes && <span className="text-purple-400">• {blog.contentBoxes.length} sections</span>}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">{blog.tags.map(tag => <span key={tag} className="text-xs text-gray-500">#{tag}</span>)}</div>
                )}
                <div className="flex gap-3 mt-auto">
                  <a href={`https://hillway.in/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"><FaEye /> Preview</a>
                  <button onClick={() => handleEditblog(blog)} className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"><FaEdit /> Edit</button>
                  <button onClick={() => handleDeleteblog(blog._id)} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition"><FaTrash /> Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}