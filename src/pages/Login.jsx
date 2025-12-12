import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUserTie, FaSpinner } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("agent"); // Default to Agent for frontend
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Point to your BACKEND URL. If running locally, likely localhost:3000
      // Ensure your backend has CORS enabled or proxy set up in vite.config.js
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...creds, type: role })
      });

      const data = await res.json();
      
      if (data.success) {
        // Store session
        localStorage.setItem('hillway_user', JSON.stringify({ ...data.user, role: data.role }));
        
        if (role === 'admin') {
            // Redirect to backend admin panel
            window.location.href = "/admin"; 
        } else {
            // Redirect to Agent Dashboard (Frontend Route)
            navigate('/agent-dashboard');
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-gray-100">
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500" />

        <h2 className="text-3xl font-bold text-white text-center mb-2">HillWay Portal</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Authorized Access Only</p>
        
        {/* Role Switcher */}
        <div className="flex bg-black/30 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setRole('agent')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition ${role === 'agent' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <FaUserTie /> Agent Login
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition ${role === 'admin' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <FaUserShield /> Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold tracking-wide">Email / Username</label>
            <input 
              type="text" 
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition placeholder-gray-600"
              placeholder={role === 'admin' ? "admin" : "agent@email.com"}
              value={creds.email}
              onChange={e => setCreds({...creds, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold tracking-wide">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition placeholder-gray-600"
              placeholder="••••••••"
              value={creds.password}
              onChange={e => setCreds({...creds, password: e.target.value})}
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center font-bold bg-red-900/20 p-2 rounded-lg border border-red-500/20">{error}</p>}

          <button 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition mt-4 flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500'} disabled:opacity-70`}
          >
            {loading ? <><FaSpinner className="animate-spin"/> Verifying...</> : "Login"}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-4">
            <a href="/" className="text-sm text-gray-500 hover:text-white transition">← Return to Website</a>
        </div>
      </div>
    </div>
  );
}