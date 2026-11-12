'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '@/store/slices/analyticsSlice';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import {
  Users,
  UserCheck,
  Activity,
  HeartPulse,
  TrendingUp,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const kpis = data?.kpi || {
    totalDoctors: 0,
    totalPatients: 0,
    activePatients: 0,
    avgPatientsPerDoctor: 0,
  };

  return (
    <AppLayout title="Executive Analytics Dashboard">
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-lg">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-400/20 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" />
              Live Healthcare Analytics Engine (Redux Toolkit)
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Clinical Operations Overview</h2>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl">
              Real-time monitoring of physician caseloads, admission trajectories, and medical diagnostic distributions.
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAnalytics())}
            className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-all backdrop-blur-sm"
          >
            <Activity className="h-4 w-4 text-teal-300" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Doctors"
            value={kpis.totalDoctors}
            subtitle="Active medical staff"
            icon={UserCheck}
            color="indigo"
          />
          <StatCard
            title="Total Patients"
            value={kpis.totalPatients}
            subtitle="Registered patient records"
            icon={Users}
            color="teal"
          />
          <StatCard
            title="Active Under Care"
            value={kpis.activePatients}
            subtitle="Currently undergoing treatment"
            icon={HeartPulse}
            color="rose"
          />
          <StatCard
            title="Avg Caseload"
            value={kpis.avgPatientsPerDoctor}
            subtitle="Patients per physician"
            icon={TrendingUp}
            color="amber"
          />
        </div>

        {/* Main Charts Section */}
        {loading ? (
          <div className="h-80 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-xs text-slate-500 font-medium">Aggregating Clinical Analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chart Row 1: Patients Per Doctor & Patient Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart: Patients Per Doctor */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-indigo-600" />
                        <span>Patients Per Doctor</span>
                      </h3>
                      <p className="text-xs text-slate-500">Physician caseload distribution</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    {data?.patientsPerDoctor?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.patientsPerDoctor} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="count" name="Patients" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400">
                        No doctor caseload data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Area Chart: Date-based Patient Registration Trends */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-teal-600" />
                        <span>Patient Admission Trends</span>
                      </h3>
                      <p className="text-xs text-slate-500">Date-wise registrations over time</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    {data?.dateBasedStats?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.dateBasedStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                          <defs>
                            <linearGradient id="patientTrend" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            interval="preserveStartEnd"
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="patients"
                            name="Admissions"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#patientTrend)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400">
                        No admission history records
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Row 2: Condition Breakdown & Recent Patients */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie/Donut Chart: Condition Breakdown */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-amber-500" />
                    <span>Condition Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Prevalence across patient cases</p>

                  <div className="h-56 w-full">
                    {data?.conditionStats?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.conditionStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {data.conditionStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400">
                        No conditions recorded
                      </div>
                    )}
                  </div>

                  {/* Legend Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {data?.conditionStats?.map((c, i) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        {c.name}: {c.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Admissions List */}
              <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      <span>Recent Patient Admissions</span>
                    </h3>
                    <p className="text-xs text-slate-500">Latest patients added to the care system</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Condition</th>
                        <th className="pb-3">Assigned Doctor</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {data?.recentPatients?.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/60">
                          <td className="py-3">
                            <span className="font-semibold text-slate-900">{p.name}</span>
                            <span className="block text-[11px] text-slate-400">{p.gender}, {p.age} yrs</span>
                          </td>
                          <td className="py-3 font-medium text-slate-800">{p.condition}</td>
                          <td className="py-3 text-indigo-600 font-medium">
                            {p.doctorId?.name || 'Unassigned'}
                          </td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                              p.status === 'Under Observation' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {p.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
