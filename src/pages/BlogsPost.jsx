import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { getPostBySlug } from '../utils/blogsUtils';
import { FaArrowLeft, FaClock, FaCalendar, FaList, FaShareAlt, FaTwitter, FaFacebook, FaLinkedin, FaTimes, FaMountain } from 'react-icons/fa';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState('');
  const [showToc, setShowToc] = useState(false);
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);
  const tagsRef = useRef(null);
  const [tocHeight, setTocHeight] = useState('auto');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostBySlug(slug);

        if (postData) {
          if (postData.coverImage?.includes('unsplash.com')) {
            postData.coverImage = '';
          }
        }

        setPost(postData);

        setTimeout(() => {
          if (postData.contentBoxes && postData.contentBoxes.length > 0) {
            const tocData = postData.contentBoxes
              .filter(box => box.heading)
              .map((box, index) => ({
                id: `box-${index}`,
                text: box.heading,
                level: 2
              }));
            setHeadings(tocData);
            if (tocData.length > 0) {
              setActiveHeading(tocData[0].id);
            }
          }
        }, 200);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Calculate max height for TOC based on tags position
  useEffect(() => {
    if (!tagsRef.current) return;

    const updateTocHeight = () => {
      const tagsTop = tagsRef.current.getBoundingClientRect().top + window.scrollY;
      const windowHeight = window.innerHeight;
      const tocTop = 96; // top-24 = 96px

      // Calculate available space from TOC top to tags section
      const maxHeight = Math.max(300, windowHeight - tocTop - 100);
      setTocHeight(`${maxHeight}px`);
    };

    updateTocHeight();
    window.addEventListener('resize', updateTocHeight);
    window.addEventListener('scroll', updateTocHeight);

    return () => {
      window.removeEventListener('resize', updateTocHeight);
      window.removeEventListener('scroll', updateTocHeight);
    };
  }, [post]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const boxElements = headings
        .map(h => document.getElementById(h.id))
        .filter(Boolean);

      if (boxElements.length === 0) return;

      let currentActiveId = headings[0].id;
      for (let i = boxElements.length - 1; i >= 0; i--) {
        const element = boxElements[i];
        if (element.offsetTop <= scrollPosition) {
          currentActiveId = headings[i].id;
          break;
        }
      }
      setActiveHeading(currentActiveId);
    };

    handleScroll();
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 100;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    setShowToc(false);
    setActiveHeading(id);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? post.title : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#D9A441] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-quicksand">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SEO title="Post Not Found - HillWay" />
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-quicksand">Post Not Found</h1>
          <Link to="/blog" className="text-[#D9A441] hover:underline inline-flex items-center gap-2 font-quicksand">
            <FaArrowLeft /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingProgress = headings.length > 0
    ? ((headings.findIndex(h => h.id === activeHeading) + 1) / headings.length) * 100
    : 0;

  const travelBackgrounds = [
    'radial-gradient(circle at 20% 50%, rgba(217, 164, 65, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
    'radial-gradient(circle at 70% 30%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(217, 164, 65, 0.1) 0%, transparent 50%)',
    'radial-gradient(circle at 40% 60%, rgba(158, 158, 158, 0.1) 0%, transparent 50%), radial-gradient(circle at 90% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
    'radial-gradient(circle at 60% 40%, rgba(103, 58, 183, 0.1) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(217, 164, 65, 0.1) 0%, transparent 50%)',
  ];

  return (
    <div className="min-h-screen font-quicksand">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        keywords={post.tags?.join(", ")}
      />
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {post.coverImage ? (
          <>
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#022c22]/60 to-[#022c22]"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9A441]/20 via-[#022c22] to-[#011814]"></div>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-16 w-full">
            <Link to="/blog" className="text-[#D9A441] hover:text-[#D9A441]/80 mb-4 md:mb-6 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full transition text-sm md:text-base font-quicksand">
              <FaArrowLeft /> Back
            </Link>

            {post.category && (
              <span className="inline-block px-3 md:px-4 py-1 md:py-2 bg-[#D9A441] text-black text-xs md:text-sm font-bold uppercase tracking-wider rounded-full mb-3 md:mb-4 font-quicksand">
                {post.category}
              </span>
            )}

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-quicksand font-bold text-white mb-4 md:mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white/80 text-sm md:text-base font-quicksand">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D9A441] flex items-center justify-center text-black font-bold text-lg md:text-xl">
                  {typeof post.author === 'string' ? post.author.charAt(0) : post.author?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm md:text-base">
                    {typeof post.author === 'string' ? post.author : post.author?.name || 'Anonymous'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs md:text-base">
                <FaCalendar className="text-[#D9A441]" />
                <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
              </div>

              {post.readingTime && (
                <div className="flex items-center gap-2 text-xs md:text-base">
                  <FaClock className="text-[#D9A441]" />
                  <span>{post.readingTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with TOC Layout */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {post.excerpt && (
          <div className="text-base md:text-xl text-white/70 italic mb-8 md:mb-12 pb-6 md:pb-8 border-b border-white/10 font-quicksand">
            {post.excerpt}
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* LEFT SIDEBAR - STICKY TOC (stays until tags) */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div
                className="sticky top-24 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border-2 border-[#D9A441]/30 rounded-3xl p-6 shadow-2xl"
                style={{ maxHeight: tocHeight }}
              >
                {/* Mountain Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700] via-[#D9A441] to-[#B8860B] rounded-full flex items-center justify-center shadow-xl border-4 border-white/20">
                    <FaMountain className="text-xl text-white" />
                  </div>
                </div>

                {/* Golden Gradient Heading */}
                <h3 className="text-center text-xl font-bold mb-5 bg-gradient-to-r from-[#FFD700] via-[#D9A441] to-[#FFD700] bg-clip-text text-transparent font-quicksand uppercase tracking-wider">
                  Journey Guide
                </h3>

                {/* TOC Navigation */}
                <nav className="space-y-2">
                  {headings.map((heading, index) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full rounded-xl transition-all duration-300 text-left overflow-hidden ${activeHeading === heading.id
                          ? 'bg-gradient-to-r from-[#D9A441] to-[#B8860B] text-black font-bold shadow-lg'
                          : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeHeading === heading.id
                            ? 'bg-black/20 text-white'
                            : 'bg-[#D9A441]/20 text-[#D9A441]'
                          }`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-quicksand leading-tight break-words">{heading.text}</span>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Reading Progress */}
                <div className="mt-5 pt-5 border-t border-[#D9A441]/30">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFD700] via-[#D9A441] to-[#FFD700] transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-3 text-center font-medium font-quicksand">
                    Section {headings.findIndex(h => h.id === activeHeading) + 1} of {headings.length}
                  </p>
                </div>
              </div>
            </aside>
          )}

          {/* MAIN CONTENT - Right Side */}
          <div className="min-w-0">
            {/* Content Boxes */}
            {post.contentBoxes && post.contentBoxes.length > 0 ? (
              <div className="space-y-12" ref={contentRef}>
                {post.contentBoxes.map((box, index) => (
                  <article
                    key={index}
                    id={`box-${index}`}
                    className="relative backdrop-blur-2xl border-2 border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl scroll-mt-24 transform hover:scale-[1.01] transition-all duration-300"
                    style={{
                      background: `${travelBackgrounds[index % travelBackgrounds.length]}, linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))`
                    }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <path d="M 100,20 L 140,80 L 180,80 L 150,110 L 170,170 L 100,130 L 30,170 L 50,110 L 20,80 L 60,80 Z" fill="currentColor" className="text-[#D9A441]" />
                        <circle cx="40" cy="40" r="5" fill="currentColor" className="text-white" />
                        <circle cx="160" cy="160" r="8" fill="currentColor" className="text-white" />
                      </svg>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5 pointer-events-none">
                      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,60 L200,10 L400,40 L600,5 L800,35 L1000,15 L1200,50 L1200,120 L0,120 Z" fill="currentColor" className="text-[#D9A441]" />
                      </svg>
                    </div>



                    {/* Images Gallery */}
                    {box.images && box.images.length > 0 && (
                      <div className="relative">
                        {box.images.length === 1 ? (
                          <img
                            src={box.images[0].url}
                            alt={box.images[0].alt || `Box ${index + 1}`}
                            className="w-full h-80 object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <div className="grid grid-cols-2 gap-2 p-2">
                            {box.images.slice(0, 4).map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image.url}
                                alt={image.alt || `Box ${index + 1} Image ${imgIndex + 1}`}
                                className={`object-cover rounded-3xl ${imgIndex === 0 && box.images.length > 2
                                    ? 'col-span-2 h-64'
                                    : 'h-48'
                                  }`}
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            ))}
                            {box.images.length > 4 && (
                              <div className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-[#D9A441] to-[#B8860B] text-white rounded-full text-sm font-bold shadow-lg font-quicksand">
                                +{box.images.length - 4} more
                              </div>
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#022c22]/80"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8 md:p-12 relative">
                      {box.heading && (
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 pb-3 border-b-2 border-[#D9A441]/30 bg-gradient-to-r from-[#FFD700] via-[#D9A441] to-[#FFD700] bg-clip-text text-transparent font-quicksand break-words">
                          {box.heading}
                        </h2>
                      )}

                      {box.content && (
                        <div className="prose-custom break-words">
                          <ReactMarkdown
                            components={{
                              h3: ({ node, ...props }) => <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D9A441] bg-clip-text text-transparent mb-4 mt-8 font-quicksand break-words" {...props} />,
                              h4: ({ node, ...props }) => <h4 className="text-xl font-bold bg-gradient-to-r from-[#D9A441] to-[#B8860B] bg-clip-text text-transparent mb-3 mt-6 font-quicksand break-words" {...props} />,
                              p: ({ node, ...props }) => <p className="text-white/80 text-lg leading-relaxed mb-6 font-quicksand break-words" {...props} />,
                              ul: ({ node, ...props }) => <ul className="space-y-3 mb-6" {...props} />,
                              ol: ({ node, ...props }) => <ol className="space-y-3 mb-6 list-decimal pl-6" {...props} />,
                              li: ({ node, ...props }) => (
                                <li className="text-white/80 text-lg leading-relaxed ml-6 pl-2 relative before:content-['▸'] before:absolute before:left-[-20px] before:text-[#D9A441] font-quicksand break-words" {...props} />
                              ),
                              strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                              em: ({ node, ...props }) => <em className="italic text-[#D9A441]" {...props} />,
                              a: ({ node, ...props }) => <a className="text-[#D9A441] hover:text-[#FFD700] underline decoration-2 underline-offset-4 transition break-all" {...props} />,
                              code: ({ node, inline, ...props }) =>
                                inline
                                  ? <code className="bg-[#D9A441]/20 px-2 py-1 rounded-lg text-[#FFD700] font-mono text-sm break-all" {...props} />
                                  : <code className="block bg-black/40 border border-[#D9A441]/30 p-6 rounded-2xl my-6 overflow-x-auto text-sm text-white/90 font-mono leading-relaxed" {...props} />,
                              blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-[#D9A441] bg-[#D9A441]/5 pl-6 pr-4 py-4 my-6 italic text-white/80 text-xl rounded-r-2xl font-quicksand break-words" {...props} />
                              ),
                              hr: ({ node, ...props }) => <hr className="border-[#D9A441]/30 my-8" {...props} />,
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-6">
                                  <table className="min-w-full border-collapse border-2 border-[#D9A441]/30 rounded-xl" {...props} />
                                </div>
                              ),
                              thead: ({ node, ...props }) => <thead className="bg-gradient-to-r from-[#D9A441]/20 to-[#B8860B]/20" {...props} />,
                              th: ({ node, ...props }) => <th className="border border-[#D9A441]/30 px-4 py-3 text-[#FFD700] font-bold text-left font-quicksand" {...props} />,
                              td: ({ node, ...props }) => <td className="border border-white/20 px-4 py-3 text-white/80 font-quicksand" {...props} />,
                            }}
                          >
                            {box.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#D9A441]/20 via-[#FFD700]/10 to-transparent rounded-tl-full pointer-events-none"></div>
                  </article>
                ))}
              </div>
            ) : (
              <article ref={contentRef} className="blog-content prose-custom">
                <ReactMarkdown>{post.content || ''}</ReactMarkdown>
              </article>
            )}

            {/* Tags - Reference point where TOC stops being sticky */}
            {post.tags && post.tags.length > 0 && (
              <div ref={tagsRef} className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[#D9A441]/30">
                <h3 className="text-white font-bold mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg font-quicksand">
                  <span className="w-2 h-2 bg-[#D9A441] rounded-full"></span>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 md:px-4 py-1 md:py-2 bg-white/5 border border-[#D9A441]/30 text-[#D9A441] rounded-full hover:bg-[#D9A441]/20 hover:border-[#D9A441]/50 hover:text-[#FFD700] transition cursor-pointer text-xs md:text-base font-quicksand font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border-2 border-[#D9A441]/30 rounded-3xl">
              <h3 className="bg-gradient-to-r from-[#FFD700] to-[#D9A441] bg-clip-text text-transparent font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base font-quicksand">
                <FaShareAlt className="text-[#D9A441]" />
                Share this journey
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white rounded-2xl transition text-sm md:text-base font-quicksand font-bold">
                  <FaTwitter /> Twitter
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-[#4267B2] hover:bg-[#4267B2]/80 text-white rounded-2xl transition text-sm md:text-base font-quicksand font-bold">
                  <FaFacebook /> Facebook
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-[#0077B5] hover:bg-[#0077B5]/80 text-white rounded-2xl transition text-sm md:text-base font-quicksand font-bold">
                  <FaLinkedin /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC Button */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowToc(!showToc)}
          className="lg:hidden fixed bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FFD700] via-[#D9A441] to-[#B8860B] text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 border-2 border-white/20"
          aria-label="Table of contents"
        >
          <FaList size={18} className="md:hidden" />
          <FaList size={20} className="hidden md:block" />
        </button>
      )}

      {/* Mobile TOC Modal */}
      {showToc && (
        <div className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end animate-fade-in" onClick={() => setShowToc(false)}>
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f1823] w-full max-h-[80vh] overflow-y-auto rounded-t-3xl p-5 md:p-6 shadow-2xl animate-slide-up border-t-4 border-[#D9A441]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="bg-gradient-to-r from-[#FFD700] to-[#D9A441] bg-clip-text text-transparent font-bold flex items-center gap-2 text-base md:text-lg font-quicksand">
                <FaList className="text-[#D9A441]" />
                Journey Guide
              </h3>
              <button onClick={() => setShowToc(false)} className="text-white/60 hover:text-white p-2 transition">
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="space-y-2">
              {headings.map((heading, index) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full rounded-2xl transition-all duration-300 text-sm md:text-base font-quicksand overflow-hidden ${activeHeading === heading.id
                      ? 'bg-gradient-to-r from-[#D9A441] to-[#B8860B] text-black font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3 p-3 text-left">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeHeading === heading.id
                        ? 'bg-black/20 text-white'
                        : 'bg-[#D9A441]/20 text-[#D9A441]'
                      }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 break-words leading-tight">{heading.text}</span>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#D9A441]/30">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD700] via-[#D9A441] to-[#FFD700] transition-all duration-500"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2 text-center font-quicksand">
                Section {headings.findIndex(h => h.id === activeHeading) + 1} of {headings.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .font-quicksand {
          font-family: 'Quicksand', sans-serif;
        }
      `}</style>
    </div>
  );
}
