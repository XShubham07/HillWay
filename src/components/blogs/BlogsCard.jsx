import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaClock, FaCalendar, FaArrowRight } from 'react-icons/fa';

export default function BlogsCard({ post, featured = false }) {
  if (!post) return null;

  const cardClass = featured
    ? "group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-[#D9A441]/30 hover:border-[#D9A441] transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(217,164,65,0.3)] h-[500px]"
    : "group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/10 hover:border-[#D9A441]/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(217,164,65,0.2)] h-full flex flex-col";

  return (
    <Link to={`/blogs/${post.slug}`} className={cardClass}>
      {/* Image Section */}
      <div className={`relative overflow-hidden ${
        featured ? 'h-[300px]' : 'h-[220px]'
      }`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(217, 164, 65, 0.2) 0%, rgba(217, 164, 65, 0.05) 100%)';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D9A441]/20 to-[#D9A441]/5 flex items-center justify-center">
            <div className="text-[#D9A441] text-6xl opacity-20">📝</div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {post.category && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-[#D9A441] text-black text-xs font-bold uppercase tracking-wider rounded-full">
            {post.category}
          </span>
        )}
        
        {featured && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`font-bold text-white mb-3 group-hover:text-[#D9A441] transition-colors duration-300 line-clamp-2 ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 text-white/50 text-xs">
            <div className="flex items-center gap-1">
              <FaCalendar className="text-[#D9A441]" />
              <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
            </div>
            
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <FaClock className="text-[#D9A441]" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-[#D9A441] font-medium text-sm group-hover:gap-3 transition-all">
            Read More
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D9A441]/5 via-transparent to-transparent"></div>
      </div>
    </Link>
  );
}