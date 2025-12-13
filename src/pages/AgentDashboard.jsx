import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaMoneyBillWave, FaChartLine, FaSignOutAlt, FaClipboardList, FaCheck } from "react-icons/fa";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [data, setData] = useState({ coupons: [], bookings: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Agent Session
    const userStr = localStorage.getItem('hillway_user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'agent') {
      alert("Unauthorized access");
      navigate('/login');
      return;
    }

    setAgent(user);

    // 2. Fetch Dashboard Data from Backend
    // Using the 'Dashboard' (capital D) path as per your file structure, but ideally should be lowercase.
    fetch(`https://admin.hillway.in/api/agent/Dashboard?agentId=${user._id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('hillway_user');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-bold text-xl">
      Loading Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans p-6 pt-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-[#1e293b] p-6 rounded-2xl border border-white/10 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {agent?.name}</h1>
            <p className="text-gray-400 text-sm mt-1">Agent ID: {agent?._id?.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition font-semibold">
            <FaSignOutAlt /> Logout
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-10"><FaMoneyBillWave size={60} /></div>
            <p className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-2">Total Commission</p>
            <p className="text-4xl font-black text-white">₹{(data.stats?.totalCommission || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">5% on Confirmed Bookings</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2 text-cyan-400"><FaClipboardList /> <span className="font-bold text-sm uppercase">Total Bookings</span></div>
            <p className="text-3xl font-bold text-white">{data.stats?.totalBookings || 0}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2 text-green-400"><FaCheck /> <span className="font-bold text-sm uppercase">Confirmed</span></div>
            <p className="text-3xl font-bold text-white">{data.stats?.confirmedBookings || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* My Coupons */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FaTicketAlt className="text-yellow-500" /> Active Coupons</h2>
            <div className="space-y-3">
              {data.coupons.map(coupon => (
                <div key={coupon._id} className="bg-[#1e293b] p-5 rounded-xl border border-white/5 flex justify-between items-center hover:border-yellow-500/30 transition">
                  <div>
                    <div className="font-mono text-2xl font-bold text-yellow-400 tracking-wider">{coupon.code}</div>
                    <div className="text-xs text-gray-400 mt-1">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{coupon.discountValue}% OFF</div>
                    <div className="text-xs text-gray-500">{coupon.usedCount} / {coupon.usageLimit} Used</div>
                  </div>
                </div>
              ))}
              {data.coupons.length === 0 && <div className="p-8 bg-[#1e293b] rounded-xl text-center text-gray-500 border border-white/5 border-dashed">No active coupons assigned. Contact Admin.</div>}
            </div>
          </section>

          {/* Recent Bookings */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FaChartLine className="text-cyan-500" /> Recent Bookings</h2>
            <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-black/20 text-gray-200 uppercase font-bold">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Comm.</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{booking.name}</div>
                          <div className="text-[10px] opacity-70 truncate w-32">{booking.tourTitle}</div>
                        </td>
                        <td className="p-4 text-white">₹{booking.totalPrice.toLocaleString()}</td>
                        <td className="p-4 font-bold text-purple-400">
                          {booking.status === 'Confirmed' ? `₹${Math.round(booking.totalPrice * 0.05)}` : '-'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.bookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings found via your coupons.</div>}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}