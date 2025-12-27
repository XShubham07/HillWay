import { useState } from 'react';
import { FaPlus, FaTrash, FaImage, FaArrowUp, FaArrowDown, FaSave, FaEye, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

export default function BlogManager() {
  const [loading, setLoading] = useState(false);
  const [mainTitle, setMainTitle] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [category, setCategory] = useState("adventure");

  const [boxes, setBoxes] = useState([
    { id: Date.now(), title: '', content: '', images: [] }
  ]);
  const [previewMode, setPreviewMode] = useState(false);

  // --- ACTIONS ---
  const addBox = () => setBoxes([...boxes, { id: Date.now(), title: '', content: '', images: [] }]);

  const removeBox = (id) => {
    if (boxes.length === 1) return;
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const updateBox = (id, field, value) => {
    setBoxes(boxes.map(box => box.id === id ? { ...box, [field]: value } : box));
  };

  const moveBox = (index, direction) => {
    const newBoxes = [...boxes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= boxes.length) return;
    [newBoxes[index], newBoxes[targetIndex]] = [newBoxes[targetIndex], newBoxes[index]];
    setBoxes(newBoxes);
  };

  // Simplified Image Input (URL only for now to ensure backend compatibility)
  const handleImageChange = (boxId, val) => {
    setBoxes(boxes.map(box => box.id === boxId ? { ...box, images: [{ url: val }] } : box));
  };

  // --- SAVE TO BACKEND ---
  const saveBlogPost = async () => {
    if (!mainTitle) return alert("Please enter a Main Blog Title");

    setLoading(true);

    // Map the internal 'boxes' state to the API Schema expected by BlogsPost.jsx
    // Structure: contentBoxes: [{ heading: "...", content: "...", image: "..." }]
    const payload = {
      title: mainTitle,
      category: category,
      coverImage: mainImage,
      contentBoxes: boxes.map(box => ({
        heading: box.title,
        content: box.content,
        image: box.images[0]?.url || ""
      }))
    };

    try {
      // POST to your live backend
      const res = await fetch('https://admin.hillway.in/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert('Blog Published Successfully to Live Site!');
        // Optional: Reset form
        setMainTitle("");
        setBoxes([{ id: Date.now(), title: '', content: '', images: [] }]);
      } else {
        alert('Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Connection Error. Ensure Backend is running and CORS is enabled.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] py-20 px-4 font-sans">
      <SEO title="Blog Manager - HillWay" description="Manage blog posts." />
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Manager</h1>
            <p className="text-gray-400 text-sm">Create content for admin.hillway.in</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2 border border-white/20"
            >
              <FaEye /> {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={saveBlogPost}
              disabled={loading}
              className="px-6 py-2.5 bg-[#D9A441] hover:bg-[#fbbf24] text-black font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {loading ? 'Publishing...' : 'Publish Live'}
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="space-y-8">
            {/* Main Meta Data */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold">Main Title</label>
                <input
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#D9A441] outline-none mt-1"
                  value={mainTitle} onChange={e => setMainTitle(e.target.value)} placeholder="e.g. Top 10 Places in Sikkim"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase font-bold">Category</label>
                  <select
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#D9A441] outline-none mt-1"
                    value={category} onChange={e => setCategory(e.target.value)}
                  >
                    <option value="adventure">Adventure</option>
                    <option value="culture">Culture</option>
                    <option value="food">Food</option>
                    <option value="tips">Travel Tips</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase font-bold">Cover Image URL</label>
                  <input
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#D9A441] outline-none mt-1"
                    value={mainImage} onChange={e => setMainImage(e.target.value)} placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Content Boxes */}
            <div className="space-y-6">
              {boxes.map((box, index) => (
                <div key={box.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative group">
                  <div className="absolute -left-3 top-6 bg-[#D9A441] text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </div>

                  {/* Controls */}
                  <div className="flex justify-end gap-2 mb-4">
                    <button onClick={() => moveBox(index, 'up')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaArrowUp /></button>
                    <button onClick={() => moveBox(index, 'down')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaArrowDown /></button>
                    <button onClick={() => removeBox(box.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded"><FaTrash /></button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={box.title}
                      onChange={(e) => updateBox(box.id, 'title', e.target.value)}
                      placeholder="Section Heading (e.g. The Journey Begins)"
                      className="w-full bg-transparent border-b border-white/10 py-2 text-xl font-bold text-white placeholder-gray-600 focus:border-[#D9A441] outline-none"
                    />

                    <textarea
                      value={box.content}
                      onChange={(e) => updateBox(box.id, 'content', e.target.value)}
                      placeholder="Write content in Markdown..."
                      rows="6"
                      className="w-full bg-black/20 rounded-xl p-4 text-gray-300 text-sm font-mono border border-white/5 focus:border-[#D9A441]/50 outline-none"
                    />

                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl">
                      <FaImage className="text-gray-500" />
                      <input
                        type="text"
                        placeholder="Paste Image URL for this section..."
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
                        value={box.images[0]?.url || ''}
                        onChange={e => handleImageChange(box.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addBox}
              className="w-full py-4 bg-[#D9A441]/10 hover:bg-[#D9A441]/20 border border-[#D9A441]/30 text-[#D9A441] rounded-2xl transition flex items-center justify-center gap-2 font-bold"
            >
              <FaPlus /> Add New Section
            </button>
          </div>
        ) : (
          /* PREVIEW MODE */
          <div className="bg-white text-black p-8 rounded-2xl min-h-[500px]">
            <h1 className="text-4xl font-bold mb-4">{mainTitle || "Untitled Post"}</h1>
            {mainImage && <img src={mainImage} className="w-full h-64 object-cover rounded-xl mb-8" />}

            {boxes.map((box, i) => (
              <div key={i} className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{box.title}</h2>
                {box.images[0]?.url && <img src={box.images[0].url} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <div className="prose">
                  <ReactMarkdown>{box.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}