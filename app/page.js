'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const router = useRouter();
  const { token, hydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated) {
      if (token) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [token, hydrated, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Doctor Tracker...</p>
      </div>
    </div>
  );
}
