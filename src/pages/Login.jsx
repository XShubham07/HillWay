import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUserTie, FaSpinner, FaArrowRight, FaLock, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("agent"); // Default role
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- NEW: Function to switch tabs and CLEAR data ---
  const switchTab = (newRole) => {
    if (role === newRole) return; // Don't do anything if clicking same tab
    setRole(newRole);
    setCreds({ email: "", password: "" }); // <--- WIPES THE DATA
    setError(""); // Clears any old error messages
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('https://admin.hillway.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...creds, type: role })
      });

      const data = await res.json();

      if (data.success) {
        if (role === 'agent') {
          localStorage.setItem('hillway_user', JSON.stringify({ ...data.user, role: data.role }));
          navigate('/agent-dashboard');
        } else {
          // Redirect Admin to separate secure domain
          window.location.href = "https://admin.hillway.in";
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Check internet.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-12 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">
            HillWay
          </h1>
          <p className="text-gray-400 text-sm font-medium">Secure Portal Access</p>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Top Line Color Indicator */}
          <div className={`h-1.5 w-full transition-colors duration-500 bg-gradient-to-r ${role === 'admin' ? 'from-cyan-400 via-blue-500 to-cyan-400' : 'from-purple-400 via-pink-500 to-purple-400'}`} />

          <div className="p-6 md:p-8">
            
            {/* --- TABS / PILLS --- */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-2xl mb-8 relative">
               {/* This handles the tab switching and data clearing */}
              <button
                type="button"
                onClick={() => switchTab('agent')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  role === 'agent' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20 scale-[1.02]' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FaUserTie /> Agent
              </button>
              
              <button
                type="button"
                onClick={() => switchTab('admin')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  role === 'admin' 
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20 scale-[1.02]' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FaUserShield /> Admin
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email / Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-[#0f172a] border-2 border-transparent focus:border-white/10 focus:bg-[#0f172a] hover:bg-white/5 text-white rounded-2xl pl-12 pr-5 py-4 outline-none transition-all placeholder-gray-600 font-medium"
                      placeholder={role === 'admin' ? "admin" : "agent@hillway.in"}
                      value={creds.email}
                      onChange={e => setCreds({ ...creds, email: e.target.value })}
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FaEnvelope />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full bg-[#0f172a] border-2 border-transparent focus:border-white/10 focus:bg-[#0f172a] hover:bg-white/5 text-white rounded-2xl pl-12 pr-5 py-4 outline-none transition-all placeholder-gray-600 font-medium"
                      placeholder="••••••••"
                      value={creds.password}
                      onChange={e => setCreds({ ...creds, password: e.target.value })}
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <FaLock />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 animate-pulse">
                  <div className="text-red-400 mt-0.5"><FaLock /></div>
                  <p className="text-red-400 text-sm font-medium leading-tight">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg ${
                  role === 'admin' 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/20'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Login <FaArrowRight className="text-sm opacity-80" />
                  </>
                )}
              </button>
            </form>

            {/* Hint Text */}
            {role === 'admin' && (
              <p className="mt-6 text-center text-xs text-gray-500 animate-fade-in">
                Admin Panel is hosted securely at <span className="text-cyan-400">admin.hillway.in</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            ← Return to Website
          </a>
        </div>

      </div>
    </div>
  );
}