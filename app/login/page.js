'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '@/store/slices/authSlice';
import { Activity, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, hydrated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const res = await dispatch(loginUser({ email, password }));
    if (!res.error) {
      router.replace('/dashboard');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@doctortracker.com');
    setPassword('admin123456');
    dispatch(clearAuthError());
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Doctor Tracker</h1>
            <p className="text-xs text-indigo-300">Healthcare Admin Portal</p>
          </div>
        </div>

        <div className="z-10 max-w-lg space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-400/20">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            Administrative Access Only
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Streamlined Management for Doctors & Patients
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            A high-performance portal designed for clinical staff and administrators. 
            Real-time querying, multi-field search, patient caseload tracking, and deep data analytics powered by Redux Toolkit.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-indigo-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Role-Based Protection</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-teal-400">&lt; 50ms</p>
              <p className="text-xs text-slate-400 mt-1">Indexed Query Latency</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 z-10">
          &copy; {new Date().getFullYear()} Doctor Tracker Inc. Built for clinical excellence.
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl shadow-black/40">
          <div>
            <div className="flex lg:hidden items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Doctor Tracker</h2>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h3>
            <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the administrative dashboard</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@doctortracker.com"
                  required
                  className="w-full rounded-lg bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-normal py-2 px-3 text-xs border border-slate-700 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Fill Demo Admin Credentials</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Default: <code className="text-slate-400">admin@doctortracker.com</code> / <code className="text-slate-400">admin123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
