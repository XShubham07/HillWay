import Link from 'next/link'
import Navbar from '../../components/Navbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'

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
  content: string
}

// Fetch a single post by slug
async function getPost(slug: string): Promise<Post | null> {
  try {
    // Fetch all posts to find the right one (since our API doesn't support slug lookup directly yet)
    // Or ideally, update backend API to support /api/blogs?slug=xyz
    const res = await fetch('https://admin.hillway.in/api/blogs', { 
      next: { revalidate: 600 } 
    })
    
    if (!res.ok) return null

    const json = await res.json()
    if (!json.success || !Array.isArray(json.data)) return null

    const post = json.data.find((p: Post) => p.slug === slug)
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const res = await fetch('https://admin.hillway.in/api/blogs')
    const json = await res.json()
    
    if (!json.success || !Array.isArray(json.data)) return []

    return json.data.map((post: Post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    return []
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#021a1f]">
      <Navbar />
      
      <article className="max-w-3xl mx-auto py-32 px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-montserrat leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span>By <span className="text-white font-medium">{post.author}</span></span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12 relative aspect-video rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-montserrat prose-headings:text-white prose-p:text-gray-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-[#0e2932] prose-pre:border prose-pre:border-gray-700/50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
