'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { api } from '@/lib/api';
import { Plus, Trash2, Mail, Phone, Building2, User, HeartPulse, Calendar } from 'lucide-react';

export default function DoctorDetailModal({ isOpen, onClose, doctorId, onRefreshParent }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    phone: '',
    status: 'Active',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDoctorDetails = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await api.get(`/doctors/${doctorId}`);
      if (res?.data) {
        setDoctor(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load doctor details.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchDoctorDetails();
      setShowAddPatient(false);
      setError('');
    }
  }, [isOpen, doctorId, fetchDoctorDetails]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      await api.post(`/doctors/${doctorId}/patients`, {
        ...patientForm,
        age: Number(patientForm.age),
      });
      setPatientForm({
        name: '',
        age: '',
        gender: 'Male',
        condition: '',
        phone: '',
        status: 'Active',
      });
      setShowAddPatient(false);
      await fetchDoctorDetails();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      setError(err.message || 'Failed to add patient under this doctor.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!confirm('Are you sure you want to remove this patient from the doctor?')) return;
    try {
      await api.delete(`/doctors/${doctorId}/patients/${patientId}`);
      await fetchDoctorDetails();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      alert(err.message || 'Failed to remove patient.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doctor ? `Doctor Profile — ${doctor.name}` : 'Doctor Details'}
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : doctor ? (
        <div className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* Doctor Info Card */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-800">{doctor.name}</h4>
                <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs px-2.5 py-0.5 mt-1">
                  {doctor.specialization}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Joined: {new Date(doctor.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{doctor.email}</span>
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-indigo-600" />
                  <span>Assigned Patients</span>
                  <span className="ml-1 rounded-full bg-slate-200 text-slate-700 text-xs px-2 py-0.5">
                    {doctor.patients?.length || 0}
                  </span>
                </h5>
                <p className="text-xs text-slate-500">Patients currently under this doctor's care</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPatient(!showAddPatient)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showAddPatient ? 'Cancel' : 'Add Patient'}</span>
              </button>
            </div>

            {/* Quick Add Patient Form under this Doctor */}
            {showAddPatient && (
              <form onSubmit={handleAddPatient} className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
                <p className="text-xs font-bold text-indigo-900">Add New Patient Under {doctor.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Patient Name"
                      value={patientForm.name}
                      onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Condition / Diagnosis</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hypertension"
                      value={patientForm.condition}
                      onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="Age"
                      value={patientForm.age}
                      onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={patientForm.gender}
                      onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="Phone"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Adding...' : 'Save Patient Under Doctor'}
                  </button>
                </div>
              </form>
            )}

            {/* Patients List Table */}
            {doctor.patients && doctor.patients.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-3.5 py-2.5">Patient</th>
                      <th className="px-3.5 py-2.5">Condition</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5">Phone</th>
                      <th className="px-3.5 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {doctor.patients.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/80">
                        <td className="px-3.5 py-2.5">
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.age} yrs • {p.gender}</p>
                        </td>
                        <td className="px-3.5 py-2.5 font-medium">{p.condition}</td>
                        <td className="px-3.5 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                            p.status === 'Under Observation' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-500">{p.phone}</td>
                        <td className="px-3.5 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeletePatient(p._id)}
                            title="Remove patient from doctor"
                            className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No patients assigned to this doctor yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Click "Add Patient" above to assign one.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
