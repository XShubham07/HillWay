import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#022c22]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-montserrat font-extrabold text-white tracking-tight">
          HillWay <span className="text-[#D9A441]">Blog</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium text-sm">
            Home
          </Link>
          <a href="https://hillway.in" className="px-4 py-2 bg-gradient-to-r from-[#D9A441] to-[#FFD700] text-[#022c22] font-bold rounded-full text-sm hover:shadow-lg hover:shadow-[#D9A441]/30 transition-all">
            Book Tours
          </a>
        </div>
      </div>
    </nav>
  )
}