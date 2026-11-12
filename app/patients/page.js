'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatients,
  deletePatient,
  setPatientFilters,
} from '@/store/slices/patientSlice';
import AppLayout from '@/components/AppLayout';
import Pagination from '@/components/Pagination';
import PatientModal from '@/components/PatientModal';
import { api } from '@/lib/api';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Users,
  RefreshCw,
  HeartPulse,
  UserCheck,
} from 'lucide-react';

export default function PatientsPage() {
  const dispatch = useDispatch();
  const { items: patients, pagination, filters, loading, error } = useSelector(
    (state) => state.patients
  );

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [conditionInput, setConditionInput] = useState(filters.condition || '');
  const [doctorIdInput, setDoctorIdInput] = useState(filters.doctorId || '');
  const [statusInput, setStatusInput] = useState(filters.status || '');
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');

  const [doctorsList, setDoctorsList] = useState([]);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);

  // Fetch doctors for doctor filter dropdown
  useEffect(() => {
    api.get('/doctors?limit=100')
      .then((res) => {
        if (res?.data) {
          setDoctorsList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadPatients = useCallback(
    (page = 1) => {
      dispatch(
        fetchPatients({
          page,
          limit: pagination.limit || 10,
          search: searchInput,
          condition: conditionInput,
          doctorId: doctorIdInput,
          status: statusInput,
          startDate,
          endDate,
        })
      );
    },
    [dispatch, pagination.limit, searchInput, conditionInput, doctorIdInput, statusInput, startDate, endDate]
  );

  useEffect(() => {
    loadPatients(1);
  }, [loadPatients]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setPatientFilters({
        search: searchInput,
        condition: conditionInput,
        doctorId: doctorIdInput,
        status: statusInput,
        startDate,
        endDate,
      })
    );
    loadPatients(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setConditionInput('');
    setDoctorIdInput('');
    setStatusInput('');
    setStartDate('');
    setEndDate('');
    dispatch(
      setPatientFilters({
        search: '',
        condition: '',
        doctorId: '',
        status: '',
        startDate: '',
        endDate: '',
      })
    );
    dispatch(fetchPatients({ page: 1, limit: 10 }));
  };

  const handlePageChange = (newPage) => {
    loadPatients(newPage);
  };

  const handleOpenAddModal = () => {
    setSelectedPatientForEdit(null);
    setIsPatientModalOpen(true);
  };

  const handleOpenEditModal = (patient) => {
    setSelectedPatientForEdit(patient);
    setIsPatientModalOpen(true);
  };

  const handleDeletePatient = async (id, name) => {
    if (confirm(`Are you sure you want to delete patient record "${name}"?`)) {
      await dispatch(deletePatient(id));
    }
  };

  return (
    <AppLayout title="Patient Management & Records">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Patient Registry</h2>
            <p className="text-xs text-slate-500">
              Complete directory of patients, clinical diagnoses, and attending physician assignments.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Patient</span>
          </button>
        </div>

        {/* Multi-Criteria Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Condition Filter */}
            <div className="relative">
              <HeartPulse className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Condition / Diagnosis"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Doctor Filter Dropdown */}
            <div className="relative">
              <select
                value={doctorIdInput}
                onChange={(e) => setDoctorIdInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">All Doctors</option>
                {doctorsList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="relative">
              <input
                type="date"
                title="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <input
                type="date"
                title="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Patients Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : patients?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Patient Details</th>
                    <th className="px-5 py-3.5">Diagnosis / Condition</th>
                    <th className="px-5 py-3.5">Assigned Doctor</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-bold border border-teal-100">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                            <span className="text-[11px] text-slate-400">
                              {p.gender} • {p.age} years old
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                          {p.condition}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {p.doctorId ? (
                          <div>
                            <p className="font-semibold text-indigo-600">{p.doctorId.name}</p>
                            <span className="text-[11px] text-slate-400">{p.doctorId.specialization}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          p.status === 'Under Observation' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          p.status === 'Recovered' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {p.status || 'Active'}
                        </span>
                      </td>

                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{p.phone}</span>
                        </div>
                        {p.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-xs">{p.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Patient Info"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(p._id, p.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Server-side Pagination */}
              <div className="border-t border-slate-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No patient records found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing or adjusting your search filters.
              </p>
            </div>
          )}
        </div>

        {/* Patient Create / Edit Modal */}
        <PatientModal
          isOpen={isPatientModalOpen}
          onClose={() => setIsPatientModalOpen(false)}
          patient={selectedPatientForEdit}
          onSaved={() => loadPatients(pagination.page)}
        />
      </div>
    </AppLayout>
  );
}
