import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | HillWay Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'HillWay Team'],
      images: post.coverImage ? [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-[#D9A441] transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.category && (
              <span className="px-3 py-1 bg-[#D9A441]/10 border border-[#D9A441]/30 text-[#D9A441] text-sm font-bold uppercase tracking-wider rounded-full">
                {post.category}
              </span>
            )}
            <span className="text-white/40 text-sm">{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
            {post.readingTime && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-sm">{post.readingTime}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-white/70 mb-8">{post.excerpt}</p>
          )}

          {post.author && (
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span>By</span>
              <span className="font-medium text-white">{post.author}</span>
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div 
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 p-8 bg-gradient-to-br from-[#D9A441]/10 to-[#1F4F3C]/10 border border-[#D9A441]/20 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready for Your Own Adventure?</h3>
          <p className="text-white/70 mb-6">Explore our curated tours and start planning your Himalayan journey today.</p>
          <a
            href="https://hillway.in/tours"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#D9A441] to-[#FFD700] text-[#022c22] font-bold rounded-full hover:shadow-lg hover:shadow-[#D9A441]/30 transition-all"
          >
            Browse Tours
          </a>
        </div>
      </div>
    </article>
  )
}