import { IoLogoInstagram, IoLogoYoutube, IoLogoFacebook } from "react-icons/io5";
import { 
  FaInfoCircle, FaPhone, FaRoute, FaBlog, FaMapMarkerAlt, 
  FaShieldAlt, FaFileContract, FaEnvelope, FaHeart
} from "react-icons/fa";

export default function Footer() {
  const footerLinks = [
    { name: "About Us", path: "/about", icon: FaInfoCircle },
    { name: "Contact", path: "/contact", icon: FaPhone },
    { name: "Tours", path: "/tours", icon: FaRoute },
    { name: "Destinations", path: "/destinations", icon: FaMapMarkerAlt },
    { name: "Blog", path: "/blog", icon: FaBlog },
    { name: "Privacy Policy", path: "/privacy-policy", icon: FaShieldAlt },
    { name: "Terms & Conditions", path: "/terms", icon: FaFileContract },
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      url: "https://instagram.com", 
      icon: IoLogoInstagram, 
      color: "from-purple-600 via-pink-600 to-orange-500"
    },
    { 
      name: "YouTube", 
      url: "https://youtube.com", 
      icon: IoLogoYoutube, 
      color: "from-red-600 to-red-500"
    },
    { 
      name: "Facebook", 
      url: "https://facebook.com", 
      icon: IoLogoFacebook, 
      color: "from-blue-600 to-blue-500"
    },
  ];

  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1117] to-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      {/* Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              HillWay
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Your Way To The Mountains
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover the Himalayas with expertly curated tours and unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {footerLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <Icon className="text-amber-400 text-xs group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
              Connect With Us
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-cyan-400" />
                <span>Dehradun, Uttarakhand</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope className="text-cyan-400" />
                <span>info@hillway.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhone className="text-cyan-400" />
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-11 h-11 rounded-xl bg-gradient-to-br ${social.color} p-[2px] hover:scale-110 transition-all duration-300`}
                    title={social.name}
                  >
                    <div className="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-all">
                      <Icon className="text-white text-lg" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 <span className="text-amber-400 font-semibold">HillWay</span> — All Rights Reserved
          </p>

          <p className="text-gray-600 text-xs flex items-center gap-2">
            Crafted with <FaHeart className="text-red-500 text-xs" /> by 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
              XShubham✨
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
