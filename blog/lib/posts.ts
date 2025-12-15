import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  coverImage?: string
  category?: string
  tags?: string[]
  author?: string
  readingTime?: string
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        content,
        readingTime: stats.text,
        ...(data as Omit<Post, 'slug' | 'content' | 'readingTime'>),
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
    
    let fileContents: string
    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8')
    } else if (fs.existsSync(mdxPath)) {
      fileContents = fs.readFileSync(mdxPath, 'utf8')
    } else {
      return null
    }

    const { data, content } = matter(fileContents)
    const stats = readingTime(content)

    return {
      slug,
      content,
      readingTime: stats.text,
      ...(data as Omit<Post, 'slug' | 'content' | 'readingTime'>),
    }
  } catch {
    return null
  }
}