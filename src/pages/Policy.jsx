import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import {
  FaShieldAlt, FaUserSecret, FaDatabase, FaServer, FaCreditCard,
  FaCookieBite, FaLock, FaUserShield, FaSyncAlt, FaEnvelope, FaPhoneAlt, FaGlobe
} from "react-icons/fa";

// --- DATA: Content Preserved ---
const PRIVACY_DATA = [
  {
    id: 1,
    title: "Information We Collect",
    icon: <FaDatabase />,
    delay: 0.1,
    content: (
      <>
        <p>We may collect the following types of information:</p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
            <h4 className="text-emerald-400 font-bold mb-2">1. Personal Information</h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
              <li>Name & Phone Number</li>
              <li>Email address</li>
              <li>Travel preferences</li>
              <li>Booking and enquiry details</li>
            </ul>
          </div>
          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
            <h4 className="text-emerald-400 font-bold mb-2">2. Automated Information</h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
              <li>IP address</li>
              <li>Browser type & device info</li>
              <li>Pages visited & Time spent</li>
              <li>Google Analytics data</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 2,
    title: "How We Use Your Information",
    icon: <FaShieldAlt />,
    delay: 0.2,
    content: (
      <>
        <p>The information collected by HillWay.in is used to:</p>
        <ul className="list-disc list-inside space-y-2 mt-2 ml-2 text-gray-300">
          <li>Respond to enquiries and booking requests</li>
          <li>Provide tour quotations and confirmations</li>
          <li>Improve website performance and user experience</li>
          <li>Send booking updates, offers, or important travel information</li>
          <li>Analyze website traffic and trends</li>
        </ul>
        <p className="mt-4 text-[#D9A441] italic border-l-2 border-[#D9A441] pl-4">
          We do not sell or rent your personal data to third parties.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: "Third-Party Services",
    icon: <FaServer />,
    delay: 0.3,
    content: (
      <>
        <p>We may share limited information with trusted third-party service providers such as:</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2 mb-4">
          <li>Hotels & Accommodation partners</li>
          <li>Transport providers</li>
          <li>Payment gateways</li>
          <li>Analytics services (e.g., Google Analytics)</li>
        </ul>
        <p>These parties are required to protect your information and use it only for service-related purposes.</p>
      </>
    )
  },
  {
    id: 4,
    title: "Payment Information",
    icon: <FaCreditCard />,
    delay: 0.4,
    content: (
      <p>
        HillWay.in does not store your debit/credit card or banking details. All payments are processed securely through third-party payment gateways.
      </p>
    )
  },
  {
    id: 5,
    title: "Cookies Policy",
    icon: <FaCookieBite />,
    delay: 0.5,
    content: (
      <p>HillWay.in uses cookies to enhance user experience, understand website usage, and analyze traffic. You can disable cookies in your browser settings, though some features of the website may not function properly.</p>
    )
  },
  {
    id: 6,
    title: "Data Security",
    icon: <FaLock />,
    delay: 0.6,
    content: (
      <p>
        We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, misuse, or disclosure. However, no method of online transmission is 100% secure.
      </p>
    )
  },
  {
    id: 7,
    title: "Your Rights",
    icon: <FaUserShield />,
    delay: 0.7,
    content: (
      <>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
          <li>Request access to your personal data</li>
          <li>Request correction or deletion of your data</li>
          <li>Opt out of promotional communications</li>
        </ul>
      </>
    )
  },
  {
    id: 8,
    title: "Changes to Policy",
    icon: <FaSyncAlt />,
    delay: 0.8,
    content: (
      <p>
        HillWay.in reserves the right to update or modify this Privacy Policy at any time. Changes will be effective immediately upon posting on the website.
      </p>
    )
  }
];

// --- 1. REUSABLE SECTION COMPONENT (Optimized) ---
const PolicySection = memo(({ item }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={{ willChange: "opacity, transform" }}
    className={`
      mb-6 p-6 md:p-8 rounded-3xl border border-white/10 shadow-lg
      bg-[#063328] /* Mobile Solid */
      md:bg-white/5 md:backdrop-blur-md /* Desktop Glass */
      md:hover:bg-white/[0.08] md:hover:border-[#D9A441]/30 
      transition-all duration-300
    `}
  >
    <h3 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white mb-4">
      <span className="text-[#D9A441] text-2xl">{item.icon}</span>
      {item.title}
    </h3>
    <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-3 font-light">
      {item.content}
    </div>
  </motion.div>
));
PolicySection.displayName = "PolicySection";

// --- 2. MAIN COMPONENT ---
export default function PrivacyPolicy() {
  const [contactPhone, setContactPhone] = useState("+91 7004165004");

  // Scroll to top and fetch contact settings
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://admin.hillway.in/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.contactPhone) {
          setContactPhone(data.data.contactPhone);
        }
      })
      .catch((err) => console.error("Failed to load contact settings", err));
  }, []);

  const today = "December 17, 2025";

  return (
    <div className="min-h-screen bg-[#022c22] text-white pt-28 pb-20 relative overflow-hidden">
      <SEO title="Privacy Policy - HillWay" description="Read our privacy policy to understand how we handle your data." />

      {/* Background Ambience (Static on mobile) */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ transform: 'translate3d(0,0,0)' }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D9A441]/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/20 text-[#D9A441] text-xs font-bold tracking-widest uppercase mb-6">
            <FaUserSecret /> Data Protection
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-emerald-200/60 font-mono text-sm">
            Last Updated: <span className="text-emerald-100">{today}</span>
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12 text-center text-gray-300 leading-relaxed max-w-2xl mx-auto"
        >
          <p>
            At <span className="text-white font-bold">HillWay.in</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you visit or interact with our website.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-4">
          {PRIVACY_DATA.map((item) => (
            <PolicySection key={item.id} item={item} />
          ))}
        </div>

        {/* Contact Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-emerald-900 to-[#022c22] p-8 md:p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A441]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <FaEnvelope className="text-[#D9A441]" /> Contact Us
          </h3>
          <p className="text-gray-300 mb-8">If you have any questions about this Privacy Policy, please contact us:</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a href="mailto:contact@hillway.in" className="flex items-center gap-3 text-white hover:text-[#D9A441] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D9A441] group-hover:text-black transition-all">
                <FaEnvelope />
              </div>
              <span className="font-medium">contact@hillway.in</span>
            </a>

            <a href={`tel:${contactPhone}`} className="flex items-center gap-3 text-white hover:text-[#D9A441] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D9A441] group-hover:text-black transition-all">
                <FaPhoneAlt />
              </div>
              <span className="font-medium">{contactPhone}</span>
            </a>

            <a href="https://hillway.in" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white hover:text-[#D9A441] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D9A441] group-hover:text-black transition-all">
                <FaGlobe />
              </div>
              <span className="font-medium">https://hillway.in</span>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}