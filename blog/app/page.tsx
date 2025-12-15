import { getAllPosts } from '@/lib/posts'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-[#D9A441] via-[#FFD700] to-[#D9A441] text-transparent bg-clip-text drop-shadow-[0_0_40px_rgba(217,164,65,0.3)]">
              HillWay Stories
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Discover the Himalayas through our eyes. Travel guides, trekking tips, and untold stories from the mountains.
          </p>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-[#D9A441] to-[#FFD700] rounded-full"></span>
              Featured Story
            </h2>
            <BlogCard post={posts[0]} featured />
          </div>
        )}

        {/* All Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-[#D9A441] to-[#FFD700] rounded-full"></span>
            Latest Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No blog posts yet. Check back soon for amazing stories!</p>
            <Link href="https://hillway.in" className="inline-block px-6 py-3 bg-gradient-to-r from-[#D9A441] to-[#FFD700] text-[#022c22] font-bold rounded-full hover:shadow-lg hover:shadow-[#D9A441]/30 transition-all">
              Explore Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}