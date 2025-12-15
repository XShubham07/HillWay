import Link from 'next/link'
import Navbar from '../components/Navbar'

// Define the shape of our blog post
interface Post {
  _id: string
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  category: string
  coverImage: string
  tags: string[]
}

// Fetch function to get blogs from your backend API
async function getPosts(): Promise<Post[]> {
  try {
    // This tells Next.js to re-fetch data every 600 seconds (10 mins)
    const res = await fetch('https://admin.hillway.in/api/blogs', { 
      next: { revalidate: 600 } 
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch posts')
    }

    const json = await res.json()
    return json.success ? json.data : []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-[#021a1f]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-32 px-6">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 font-montserrat">
            HillWay<span className="text-[#D9A441]">.in</span> Blog
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover travel stories, trekking guides, and expert tips for your next Himalayan adventure.
          </p>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-[#0e2932]/50 rounded-2xl border border-gray-700/50">
              <p>No blog posts found yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/${post.slug}`}
                className="block bg-[#0e2932]/70 p-8 rounded-2xl border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group relative overflow-hidden"
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-500 rounded-full" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors font-montserrat">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
