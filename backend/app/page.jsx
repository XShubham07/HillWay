'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserShield, FaSpinner } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [view, setView] = useState('login'); // login | forgot | verify | reset
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
        // Force a full reload to ensure the cookie is recognized immediately
        window.location.href = "/admin";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Ensure backend is running.");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!creds.email) return setError("Please enter your email");
    setLoading(true); setError("");
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email })
      });
      const data = await res.json();
      if (data.success) {
        setView('verify');
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) { setError("Network Error"); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return setError("Enter valid 6-digit OTP");
    setLoading(true); setError("");
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setView('reset');
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) { setError("Network Error"); }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return setError("Password must be at least 6 chars");
    setLoading(true); setError("");
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email, password: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password Reset Successfully! Please login.");
        setView('login');
        setNewPassword("");
        setOtp("");
        // Keep email to help user login easily
      } else {
        setError(data.error || "Reset Failed");
      }
    } catch (err) { setError("Network Error"); }
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

        {view === 'login' && (
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

            <div className="flex justify-end">
              <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                Forgot Password?
              </button>
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
        )}

        {view === 'forgot' && (
          <div className="space-y-5">
            <p className="text-center text-sm text-gray-300">Enter your registered email to receive an OTP.</p>
            <input
              type="email"
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition placeholder-gray-600"
              placeholder="Enter Email"
              value={creds.email}
              onChange={e => setCreds({ ...creds, email: e.target.value })}
            />
            {error && <div className="text-red-400 text-sm text-center font-bold">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setView('login')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm">Back</button>
              <button onClick={handleForgotPassword} disabled={loading} className="flex-[2] py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-sm text-white flex justify-center items-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : "Send OTP"}
              </button>
            </div>
          </div>
        )}

        {view === 'verify' && (
          <div className="space-y-5">
            <p className="text-center text-sm text-gray-300">Enter the 6-digit OTP sent to <span className="text-cyan-400">{creds.email}</span></p>
            <input
              type="text"
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-center text-2xl font-bold tracking-widest text-white focus:border-cyan-500 outline-none transition"
              placeholder="XXXXXX"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            {error && <div className="text-red-400 text-sm text-center font-bold">{error}</div>}
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white flex justify-center items-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : "Verify OTP"}
            </button>
          </div>
        )}

        {view === 'reset' && (
          <div className="space-y-5">
            <p className="text-center text-sm text-gray-300">Set a new password for your account.</p>
            <input
              type="password"
              className="w-full bg-black/20 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition placeholder-gray-600"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            {error && <div className="text-red-400 text-sm text-center font-bold">{error}</div>}
            <button onClick={handleResetPassword} disabled={loading} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white flex justify-center items-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}