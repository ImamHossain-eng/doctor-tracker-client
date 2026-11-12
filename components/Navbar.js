'use client';

import React from 'react';
import { Menu, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Navbar({ title, setIsSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <Shield className="h-3.5 w-3.5 text-indigo-600" />
          <span>Role: <span className="font-semibold uppercase text-indigo-600">{user?.role || 'Admin'}</span></span>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-700">
            {user?.name || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
}
