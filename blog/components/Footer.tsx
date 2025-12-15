import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#022c22]/60 backdrop-blur-xl border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-montserrat font-bold text-white mb-4">
              HillWay <span className="text-[#D9A441]">Blog</span>
            </h3>
            <p className="text-white/60 text-sm">
              Sharing authentic stories and travel guides from the heart of the Himalayas.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/60 hover:text-[#D9A441] transition-colors text-sm">Home</Link></li>
              <li><a href="https://hillway.in" className="text-white/60 hover:text-[#D9A441] transition-colors text-sm">Main Website</a></li>
              <li><a href="https://hillway.in/tours" className="text-white/60 hover:text-[#D9A441] transition-colors text-sm">Browse Tours</a></li>
              <li><a href="https://hillway.in/contact" className="text-white/60 hover:text-[#D9A441] transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><span className="text-white/60 text-sm">Travel Guides</span></li>
              <li><span className="text-white/60 text-sm">Trekking Tips</span></li>
              <li><span className="text-white/60 text-sm">Destination Stories</span></li>
              <li><span className="text-white/60 text-sm">Local Culture</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} HillWay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}