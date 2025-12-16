import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../utils/blogUtils';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-[#D9A441] hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] to-[#011814]">
      {/* Header */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="text-[#D9A441] hover:text-[#D9A441]/80 mb-8 inline-block">
            ← Back to Blog
          </Link>
          
          {post.coverImage && (
            <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent"></div>
            </div>
          )}

          <div className="mb-6">
            {post.category && (
              <span className="px-3 py-1 bg-[#D9A441]/10 border border-[#D9A441]/30 text-[#D9A441] text-sm font-bold uppercase tracking-wider rounded-full mr-3">
                {post.category}
              </span>
            )}
            <span className="text-white/40 text-sm">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
            {post.readingTime && <span className="text-white/40 text-sm ml-3">• {post.readingTime}</span>}
          </div>

          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
            {post.title}
          </h1>

          {post.author && (
            <div className="flex items-center gap-3 mb-8">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                {post.author.role && <p className="text-white/40 text-sm">{post.author.role}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}