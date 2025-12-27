import { useState, useEffect } from 'react';
import BlogsCard from '../components/blogs/BlogsCard';
import { getAllPosts } from '../utils/blogsUtils';
import SEO from '../components/SEO';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const featuredPost = posts.find(post => post.featured);
  const categories = ['all', ...new Set(posts.map(post => post.category).filter(Boolean))];

  if (loading) {
    return (
      // Removed gradient class to allow default CSS background
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    // Removed gradient class to allow default CSS background
    <div className="min-h-screen">
      <SEO
        title="Travel Blogs - HillWay"
        description="Read our latest travel stories, tips, and guides for Sikkim and Darjeeling."
      />
      {/* Header */}
      <div className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-white mb-4">
            Travel Blogs
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover stories, tips, and insights from the heart of the mountains
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <BlogsCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-[#D9A441] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogsCard key={post.slug} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 