import React from 'react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#0b0f17] text-gray-300 py-32 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="border-b border-white/10 pb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D9A441] to-yellow-200 mb-2">
                        Terms & Conditions
                    </h1>
                    <p className="text-sm text-gray-500">Last Updated: December 2025</p>
                </div>

                <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-400">
                    <p>
                        Welcome to <strong className="text-white">HillWay Tour & Travels</strong>. By booking any tour or using our services, you agree to the following Terms & Conditions. Please read them carefully before making any booking or payment.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Company Information</h2>
                        <p>
                            HillWay Tour & Travels<br />
                            Kheminichak, Patna — 800026<br />
                            Email: <a href="mailto:contact@hillway.in" className="text-[#D9A441] hover:underline">contact@hillway.in</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Booking Policy</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>A booking is confirmed only after the required advance payment is received.</li>
                            <li>We accept:
                                <ul className="list-circle pl-5 mt-1 text-gray-500">
                                    <li>Full advance payment, or</li>
                                    <li>Partial advance payment of 30–40% of the total package cost.</li>
                                </ul>
                            </li>
                            <li>Remaining payment (if any) must be cleared before or at the start of the tour, as instructed by HillWay Tour & Travels.</li>
                            <li>HillWay reserves the right to cancel bookings where payments are not completed on time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Payment Methods</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We accept online payments via UPI / Bank Transfer / Wallets (as applicable).</li>
                            <li>All payments must be recorded with proof of transfer.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Pricing & Inclusions</h2>
                        <p className="mb-2">Package prices may vary based on hotel availability, peak season, vehicle availability, and permit conditions.</p>
                        <p>Unless mentioned otherwise, prices generally include:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Standard hotel accommodation</li>
                            <li>Transportation as per itinerary</li>
                            <li>Required local permits</li>
                            <li>Food as per itinerary</li>
                        </ul>
                        <p className="mt-2 text-yellow-500/80 text-xs">
                            * Any personal expenses, extra sightseeing, room heaters, adventure activities, or additional stays are not included.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Cancellation & Refund Policy</h2>

                        <h3 className="text-lg font-semibold text-white mt-4 mb-2">5.1 Cancellation by Customer</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Cancellation at least 2 days before the tour date:</strong> Eligible for refund after 10% deduction (processing & reservation fee).</li>
                            <li><strong>Cancellation on the tour date:</strong> No refund is applicable.</li>
                            <li><strong>No-show / late arrival:</strong> Considered as tour cancellation with no refund.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mt-4 mb-2">5.2 Cancellation Due to Weather / Landslides / Strikes / Natural Causes</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>If tours are canceled by authorities or travel becomes impossible, HillWay Tour & Travels will process a <strong>10% refund</strong>.</li>
                            <li>If the tour is delayed due to weather, landslides, strikes, or similar issues:
                                <ul className="list-circle pl-5 mt-1 text-gray-500">
                                    <li>We cannot provide extra hotel nights or additional services.</li>
                                    <li>No refund will be issued for delays.</li>
                                    <li>Any additional expenses must be paid by the customer.</li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white mt-4 mb-2">5.3 Cancellation by HillWay</h3>
                        <p>In case we cancel a tour due to operational reasons or safety concerns, customers will receive:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Full refund OR</li>
                            <li>Reschedule option (as per customer preference).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Hotel Policy</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We provide standard category hotels unless otherwise mentioned.</li>
                            <li>Hotel rooms are subject to availability; similar-category alternatives may be provided.</li>
                            <li>Check-in and check-out timings are determined by the hotel and may vary.</li>
                            <li>Room heaters, laundry, extra meals, or additional services are chargeable by the hotel.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Transportation Policy</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Transport type depends on package (Shared, SIC, or Private).</li>
                            <li>Vehicle type may include Sumo / Bolero / Maxx or similar models.</li>
                            <li>Drivers follow the fixed routes decided by local authorities; detours or extra sightseeing may not be possible.</li>
                            <li>In hilly regions, driving after sunset may be restricted for safety reasons.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Permits & Travel Documents</h2>
                        <p>HillWay Tour & Travels assists with all required permits for destinations like Sikkim, Zuluk, etc.</p>
                        <p className="mt-2">Guests must provide:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Valid Government ID</li>
                            <li>Passport-size photos</li>
                            <li>Any documents required by local authorities</li>
                        </ul>
                        <p className="mt-2 italic text-gray-500">Permit approval is subject to government rules. Refunds are not applicable if a permit is denied for reasons beyond our control.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Customer Responsibilities</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide accurate details while booking.</li>
                            <li>Follow instructions from the driver, guide, and local authorities.</li>
                            <li>Respect local culture, rules, and safety conditions.</li>
                            <li>Carry personal medicines, warm clothing, and essentials based on the region.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Liability Disclaimer</h2>
                        <p>HillWay Tour & Travels is not liable for:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Natural events such as landslides, earthquakes, heavy snowfall, roadblocks, or bad weather.</li>
                            <li>Delays, route changes, or closures imposed by local administration.</li>
                            <li>Loss, damage, or theft of personal belongings.</li>
                            <li>Any injury, accident, or medical emergency during the trip.</li>
                        </ul>
                        <p className="mt-2">HillWay will, however, offer full assistance in arranging support or alternate options where possible (additional charges may apply).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Travel Insurance</h2>
                        <p>We do not provide travel or medical insurance currently. Customers are encouraged to arrange their own insurance to cover emergencies, cancellations, or health-related issues.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">12. Amendments to Itinerary</h2>
                        <p>Due to weather, safety, permit restrictions, or administrative orders, itineraries may change without prior notice. No refunds are applicable for unused services caused by such changes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">13. Governing Law</h2>
                        <p>These Terms & Conditions are governed by the Laws of India. Any disputes shall fall under the jurisdiction of courts in Patna, Bihar.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">14. Acceptance of Terms</h2>
                        <p>By booking a tour with HillWay Tour & Travels, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.</p>
                    </section>

                </div>

                <div className="pt-10 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-600">© 2025 HillWay Tour & Travels. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}