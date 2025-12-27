import React, { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import {
  FaFileContract, FaMoneyBillWave, FaCreditCard, FaTag, FaUndo,
  FaHotel, FaBus, FaIdCard, FaUserCheck, FaExclamationTriangle,
  FaShieldAlt, FaFileAlt, FaGavel
} from 'react-icons/fa';

// --- DATA: Content preserved exactly as requested ---
const TERMS_DATA = [
  {
    id: 1,
    title: "Company Information",
    icon: <FaFileContract />,
    colorClass: "bg-[#D9A441]/10 text-[#D9A441]",
    content: (
      <div className="space-y-1">
        <p className="font-semibold text-white">HillWay.in</p>
        <p>Bhagwat Nagar, Patna, Bihar — 800026</p>
        <p>Email: <a href="mailto:contact@hillway.in" className="text-[#D9A441] hover:underline font-medium">contact@hillway.in</a></p>
      </div>
    )
  },
  {
    id: 2,
    title: "Booking Policy",
    icon: <FaMoneyBillWave />,
    colorClass: "bg-emerald-500/10 text-emerald-400",
    content: (
      <ul className="space-y-4">
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>A booking is confirmed only after the required advance payment is received.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><div><span>We accept:</span><ul className="ml-6 mt-2 space-y-2"><li className="flex items-start gap-2"><span className="text-emerald-400 mt-1 text-[6px] shrink-0">●</span><span>Full advance payment, or</span></li><li className="flex items-start gap-2"><span className="text-emerald-400 mt-1 text-[6px] shrink-0">●</span><span>Partial advance payment of 30–40% of the total package cost.</span></li></ul></div></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Remaining payment must be cleared before or at the start of the tour, as instructed by HillWay.in.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>HillWay reserves the right to cancel bookings where payments are not completed on time.</span></li>
      </ul>
    )
  },
  {
    id: 3,
    title: "Payment Methods",
    icon: <FaCreditCard />,
    colorClass: "bg-blue-500/10 text-blue-400",
    content: (
      <ul className="space-y-4">
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>We accept online payments via UPI / Bank Transfer / Wallets (as applicable).</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>All payments must be recorded with proof of transfer.</span></li>
      </ul>
    )
  },
  {
    id: 4,
    title: "Pricing & Inclusions",
    icon: <FaTag />,
    colorClass: "bg-purple-500/10 text-purple-400",
    content: (
      <div className="space-y-4">
        <p>Package prices may vary based on hotel availability, peak season, vehicle availability, and permit conditions.</p>
        <p>Unless mentioned otherwise, prices generally include:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Standard hotel accommodation</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Transportation as per itinerary</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Required local permits</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Food as per itinerary</span></li>
        </ul>
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <p className="text-yellow-300/90 text-sm italic flex items-start gap-2">
            <FaExclamationTriangle className="text-yellow-400 mt-0.5 shrink-0" />
            <span>Any personal expenses, extra sightseeing, room heaters, adventure activities, or additional stays are not included.</span>
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Cancellation & Refund Policy",
    icon: <FaUndo />,
    colorClass: "bg-red-500/10 text-red-400",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">5.1 Cancellation by Customer</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span><strong className="text-white">Cancellation at least 2 days before the tour date:</strong> Eligible for refund after 10% deduction (processing & reservation fee).</span></li>
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span><strong className="text-white">Cancellation on the tour date:</strong> No refund is applicable.</span></li>
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span><strong className="text-white">No-show / late arrival:</strong> Considered as tour cancellation with no refund.</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">5.2 Cancellation Due to Weather / Landslides / Strikes / Natural Causes</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>If tours are canceled by authorities or travel becomes impossible, HillWay.in will process a <strong className="text-white">10% refund</strong>.</span></li>
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><div><span>If the tour is delayed due to weather, landslides, strikes, or similar issues:</span><ul className="ml-6 mt-2 space-y-2"><li className="flex items-start gap-2"><span className="text-emerald-400 mt-1 text-[6px] shrink-0">●</span><span>We cannot provide extra hotel nights or additional services.</span></li><li className="flex items-start gap-2"><span className="text-emerald-400 mt-1 text-[6px] shrink-0">●</span><span>No refund will be issued for delays.</span></li><li className="flex items-start gap-2"><span className="text-emerald-400 mt-1 text-[6px] shrink-0">●</span><span>Any additional expenses must be paid by the customer.</span></li></ul></div></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">5.3 Cancellation by HillWay</h3>
          <p className="mb-3">In case we cancel a tour due to operational reasons or safety concerns, customers will receive:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Full refund OR</span></li>
            <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Reschedule option (as per customer preference).</span></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Hotel Policy",
    icon: <FaHotel />,
    colorClass: "bg-pink-500/10 text-pink-400",
    content: (
      <ul className="space-y-4">
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>We provide standard category hotels unless otherwise mentioned.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Hotel rooms are subject to availability; similar-category alternatives may be provided.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Check-in and check-out timings are determined by the hotel and may vary.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Room heaters, laundry, extra meals, or additional services are chargeable by the hotel.</span></li>
      </ul>
    )
  },
  {
    id: 7,
    title: "Transportation Policy",
    icon: <FaBus />,
    colorClass: "bg-orange-500/10 text-orange-400",
    content: (
      <ul className="space-y-4">
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Transport type depends on package (Shared, SIC, or Private).</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Vehicle type may include Sumo / Bolero / Maxx or similar models.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Drivers follow the fixed routes decided by local authorities; detours or extra sightseeing may not be possible.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>In hilly regions, driving after sunset may be restricted for safety reasons.</span></li>
      </ul>
    )
  },
  {
    id: 8,
    title: "Permits & Travel Documents",
    icon: <FaIdCard />,
    colorClass: "bg-cyan-500/10 text-cyan-400",
    content: (
      <div className="space-y-4">
        <p>HillWay.in assists with all required permits for destinations like Sikkim, Zuluk, etc.</p>
        <p>Guests must provide:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Valid Government ID</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Passport-size photos</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Any documents required by local authorities</span></li>
        </ul>
        <p className="italic text-emerald-100/50 text-sm">Permit approval is subject to government rules. Refunds are not applicable if a permit is denied for reasons beyond our control.</p>
      </div>
    )
  },
  {
    id: 9,
    title: "Customer Responsibilities",
    icon: <FaUserCheck />,
    colorClass: "bg-green-500/10 text-green-400",
    content: (
      <ul className="space-y-4">
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Provide accurate details while booking.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Follow instructions from the driver, guide, and local authorities.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Respect local culture, rules, and safety conditions.</span></li>
        <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Carry personal medicines, warm clothing, and essentials based on the region.</span></li>
      </ul>
    )
  },
  {
    id: 10,
    title: "Liability Disclaimer",
    icon: <FaExclamationTriangle />,
    colorClass: "bg-yellow-500/10 text-yellow-400",
    content: (
      <div className="space-y-4">
        <p>HillWay.in is not liable for:</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Natural events such as landslides, earthquakes, heavy snowfall, roadblocks, or bad weather.</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Delays, route changes, or closures imposed by local administration.</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Loss, damage, or theft of personal belongings.</span></li>
          <li className="flex items-start gap-3"><span className="text-[#D9A441] mt-1 text-xs shrink-0">●</span><span>Any injury, accident, or medical emergency during the trip.</span></li>
        </ul>
        <p className="mt-4">HillWay will, however, offer full assistance in arranging support or alternate options where possible (additional charges may apply).</p>
      </div>
    )
  },
  {
    id: 11,
    title: "Travel Insurance",
    icon: <FaShieldAlt />,
    colorClass: "bg-indigo-500/10 text-indigo-400",
    content: <p>We do not provide travel or medical insurance currently. Customers are encouraged to arrange their own insurance to cover emergencies, cancellations, or health-related issues.</p>
  },
  {
    id: 12,
    title: "Amendments to Itinerary",
    icon: <FaFileAlt />,
    colorClass: "bg-teal-500/10 text-teal-400",
    content: <p>Due to weather, safety, permit restrictions, or administrative orders, itineraries may change without prior notice. No refunds are applicable for unused services caused by such changes.</p>
  },
  {
    id: 13,
    title: "Governing Law",
    icon: <FaGavel />,
    colorClass: "bg-gray-500/10 text-gray-400",
    content: <p>These Terms & Conditions are governed by the Laws of India. Any disputes shall fall under the jurisdiction of courts in Patna, Bihar.</p>
  },
  {
    id: 14,
    title: "Acceptance of Terms",
    icon: <FaFileContract />,
    colorClass: "bg-[#D9A441]/10 text-[#D9A441]",
    content: <p>By booking a tour with HillWay.in, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.</p>
  }
];

// --- 1. MEMOIZED BACKGROUND (Optimized) ---
const Background = memo(() => (
  <div
    className="fixed top-0 left-0 w-full h-full z-[-1] bg-[#022c22] pointer-events-none"
    style={{ transform: 'translate3d(0,0,0)' }}
  >
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {/* Reduced blur on mobile for performance, kept high for desktop */}
    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-[#D9A441] opacity-10 blur-[60px] md:blur-[100px] rounded-full mix-blend-screen"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#022c22]/60 to-[#022c22]"></div>
  </div>
));
Background.displayName = "Background";

// --- 2. REUSABLE ANIMATED CARD COMPONENT ---
const TermCard = memo(({ item, index }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} // REDUCED MOTION DISTANCE FOR SMOOTHER LOAD
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }} // TRIGGER EARLIER
      transition={{ duration: 0.4, ease: "easeOut" }} // FASTER DURATION
      style={{ willChange: "opacity, transform" }} // HARDWARE ACCELERATION HINT
      className={`
        /* Base Styles */
        rounded-3xl p-6 md:p-10 border border-white/10
        
        /* Mobile Optimization: Solid color, NO BLUR to prevent lag */
        bg-[#063328] 
        
        /* Desktop: Glassmorphism */
        md:bg-black/20 md:backdrop-blur-md 
        
        /* Hover Effect (Desktop only) */
        md:hover:border-[#D9A441]/30 transition-colors duration-300
      `}
    >
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.colorClass}`}>
          {item.icon}
        </div>
        <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white">{item.id}. {item.title}</h2>
      </div>
      <div className="text-emerald-50/70 font-inter font-light leading-relaxed text-sm md:text-base">
        {item.content}
      </div>
    </motion.section>
  );
});
TermCard.displayName = "TermCard";

// --- 3. MAIN COMPONENT ---
export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white bg-[#022c22] selection:bg-[#D9A441] selection:text-black">
      <SEO title="Terms & Conditions - HillWay" description="Read our terms and conditions for booking tours and travel services." />
      <Background />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} // LIGHTER ANIMATION
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#D9A441]/10 border border-[#D9A441]/20 mb-6 backdrop-blur-sm">
            <FaFileContract className="text-4xl text-[#D9A441]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-emerald-100/60 text-lg font-inter font-light">Last Updated: December 2025</p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 mb-10"
        >
          <p className="text-emerald-50/80 text-base md:text-lg leading-relaxed font-inter font-light">
            Welcome to <strong className="text-[#D9A441] font-semibold">HillWay.in</strong>. By booking any tour or using our services, you agree to the following Terms & Conditions. Please read them carefully before making any booking or payment.
          </p>
        </motion.div>

        {/* Content Sections - Rendered via Map */}
        <div className="space-y-6 md:space-y-8">
          {TERMS_DATA.map((item, index) => (
            <TermCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-10 border-t border-white/10 text-center">
          <p className="text-emerald-100/40 text-sm font-inter font-light">© 2025 HillWay.in. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}