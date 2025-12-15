import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Post } from '@/lib/posts'

interface BlogCardProps {
  post: Post
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/${post.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#D9A441]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D9A441]/10">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full overflow-hidden">
              <Image
                src={post.coverImage || '/placeholder.jpg'}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#022c22]/50 to-transparent"></div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#D9A441]/10 border border-[#D9A441]/30 text-[#D9A441] text-xs font-bold uppercase tracking-wider rounded-full">
                  Featured
                </span>
                <span className="text-white/40 text-sm">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-4 group-hover:text-[#D9A441] transition-colors">
                {post.title}
              </h2>
              <p className="text-white/60 mb-6 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-4">
                <span className="text-[#D9A441] font-medium text-sm">Read More →</span>
                {post.readingTime && <span className="text-white/40 text-sm">{post.readingTime}</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/${post.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#D9A441]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#D9A441]/10 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className="px-2 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider rounded">
                {post.category}
              </span>
            )}
            <span className="text-white/40 text-xs">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9A441] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#D9A441] font-medium text-sm">Read More →</span>
            {post.readingTime && <span className="text-white/40 text-xs">{post.readingTime}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}