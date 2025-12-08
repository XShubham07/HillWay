'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserShield, FaSpinner } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure your backend API route is correct
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Hardcoding type as 'admin' for this specific page
        body: JSON.stringify({ ...creds, type: 'admin' })
      });

      const data = await res.json();

      if (data.success) {
        // Store session data if needed
        localStorage.setItem('hillway_user', JSON.stringify({ ...data.user, role: 'admin' }));

        // Redirect to Admin Dashboard
        router.push("/admin");
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        <div className="flex justify-center mb-4 text-cyan-500">
          <FaUserShield size={40} />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-2">Admin Portal</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Authorized Access Only</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold tracking-wide">Username / Email</label>
            <input
              type="text"
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition placeholder-gray-600"
              placeholder="admin"
              value={creds.email}
              onChange={e => setCreds({ ...creds, email: e.target.value })}
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
              onChange={e => setCreds({ ...creds, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center font-bold bg-red-900/20 p-3 rounded-lg border border-red-500/20 animate-pulse">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition mt-4 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <><FaSpinner className="animate-spin" /> Verifying...</> : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}