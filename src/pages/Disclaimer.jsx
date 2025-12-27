import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import {
  FaExclamationTriangle, FaShieldAlt, FaInfoCircle,
  FaRoute, FaMoneyBillWave, FaHotel, FaMountain,
  FaImages, FaGavel, FaSyncAlt, FaEnvelope, FaPhoneAlt, FaGlobe
} from "react-icons/fa";

// --- DATA: Content Preserved ---
const DISCLAIMER_DATA = [
  {
    id: 1,
    title: "Tour & Travel Disclaimer",
    icon: <FaRoute />,
    content: (
      <>
        <p>
          All tour packages, itineraries, hotel categories, transport arrangements, and sightseeing plans are subject to availability and may change due to weather conditions, road conditions, government regulations, permits, natural calamities, strikes, or any unforeseen circumstances beyond our control.
        </p>
        <p className="border-l-2 border-[#D9A441] pl-4 italic text-white/80 mt-2">
          HillWay.in reserves the right to modify, cancel, or reschedule any part of the tour without prior notice in the interest of guest safety and operational feasibility.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: "Pricing Disclaimer",
    icon: <FaMoneyBillWave />,
    content: (
      <>
        <p>
          All prices mentioned on HillWay.in are indicative and may change without prior notice due to seasonal demand, hotel availability, fuel price fluctuations, government taxes, or permit charges.
        </p>
        <p className="font-bold text-emerald-200">
          Final prices are confirmed only after booking confirmation.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: "Third-Party Services",
    icon: <FaHotel />,
    content: (
      <p>
        HillWay.in acts as a facilitator between customers and third-party service providers such as hotels, transport operators, guides, and activity providers. HillWay.in shall not be responsible for any deficiency, delay, loss, injury, accident, or damage caused by these third-party services.
      </p>
    )
  },
  {
    id: 4,
    title: "Adventure & Risk Disclaimer",
    icon: <FaMountain />,
    content: (
      <>
        <p>
          Certain destinations and activities (including high-altitude travel, trekking, snow zones, and adventure activities) involve inherent risks. Travelers are advised to assess their physical fitness and consult medical professionals if required.
        </p>
        <p>
          HillWay.in shall not be held liable for any injury, illness, accident, loss, or damage arising from participation in such activities.
        </p>
      </>
    )
  },
  {
    id: 5,
    title: "Website Content Disclaimer",
    icon: <FaImages />,
    content: (
      <p>
        Images used on HillWay.in are for representation purposes only and may differ from actual locations, hotels, or services. Descriptions and information are approximate and should not be treated as absolute guarantees.
      </p>
    )
  },
  {
    id: 6,
    title: "Limitation of Liability",
    icon: <FaGavel />,
    content: (
      <p>
        Under no circumstances shall HillWay.in be liable for any direct, indirect, incidental, consequential, or special damages arising out of the use of this website or the services offered.
      </p>
    )
  },
  {
    id: 7,
    title: "Changes to Disclaimer",
    icon: <FaSyncAlt />,
    content: (
      <p>
        HillWay.in reserves the right to update or modify this disclaimer at any time without prior notice. Continued use of the website implies acceptance of the revised disclaimer.
      </p>
    )
  }
];

// --- 1. REUSABLE SECTION COMPONENT (Optimized) ---
const DisclaimerSection = memo(({ item }) => (
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
DisclaimerSection.displayName = "DisclaimerSection";

// --- 2. MAIN COMPONENT ---
export default function Disclaimer() {
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
      <SEO title="Disclaimer - HillWay" description="Read our disclaimer regarding tour packages and services." />

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
            <FaExclamationTriangle /> Legal Notice
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Disclaimer
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
            The information provided on <span className="text-white font-bold">HillWay.in</span> (https://hillway.in) is for general informational and booking purposes only. While we strive to keep all information accurate, complete, and up to date, HillWay.in makes no warranties or representations of any kind regarding the completeness, reliability, or availability of the services displayed.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-4">
          {DISCLAIMER_DATA.map((item) => (
            <DisclaimerSection key={item.id} item={item} />
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
            <FaInfoCircle className="text-[#D9A441]" /> Contact Us
          </h3>
          <p className="text-gray-300 mb-8">For any questions regarding this disclaimer, please contact us:</p>

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