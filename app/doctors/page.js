'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctors,
  deleteDoctor,
  setDoctorFilters,
} from '@/store/slices/doctorSlice';
import AppLayout from '@/components/AppLayout';
import Pagination from '@/components/Pagination';
import DoctorModal from '@/components/DoctorModal';
import DoctorDetailModal from '@/components/DoctorDetailModal';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  Calendar,
  UserCheck,
  RefreshCw,
  Users,
} from 'lucide-react';

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const { items: doctors, pagination, filters, loading, error } = useSelector(
    (state) => state.doctors
  );

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [specializationInput, setSpecializationInput] = useState(filters.specialization || '');
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');

  // Modals state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDoctorIdForDetail, setSelectedDoctorIdForDetail] = useState(null);

  const loadDoctors = useCallback(
    (page = 1) => {
      dispatch(
        fetchDoctors({
          page,
          limit: pagination.limit || 10,
          search: searchInput,
          specialization: specializationInput,
          startDate,
          endDate,
        })
      );
    },
    [dispatch, pagination.limit, searchInput, specializationInput, startDate, endDate]
  );

  useEffect(() => {
    loadDoctors(1);
  }, [loadDoctors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setDoctorFilters({
        search: searchInput,
        specialization: specializationInput,
        startDate,
        endDate,
      })
    );
    loadDoctors(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSpecializationInput('');
    setStartDate('');
    setEndDate('');
    dispatch(
      setDoctorFilters({
        search: '',
        specialization: '',
        startDate: '',
        endDate: '',
      })
    );
    dispatch(fetchDoctors({ page: 1, limit: 10 }));
  };

  const handlePageChange = (newPage) => {
    loadDoctors(newPage);
  };

  const handleOpenAddModal = () => {
    setSelectedDoctorForEdit(null);
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditModal = (doc) => {
    setSelectedDoctorForEdit(doc);
    setIsDoctorModalOpen(true);
  };

  const handleOpenDetailModal = (docId) => {
    setSelectedDoctorIdForDetail(docId);
    setIsDetailModalOpen(true);
  };

  const handleDeleteDoctor = async (id, name) => {
    if (confirm(`Are you sure you want to remove Dr. ${name}? This will also remove associated patient assignments.`)) {
      await dispatch(deleteDoctor(id));
    }
  };

  return (
    <AppLayout title="Doctor Directory & Management">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Physicians</h2>
            <p className="text-xs text-slate-500">
              Manage doctor credentials, specializations, and assigned patient caseloads.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Doctor</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, hospital, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by specialization..."
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Start Date */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="date"
                title="Filter Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="date"
                title="Filter End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Doctors Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : doctors?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Doctor</th>
                    <th className="px-5 py-3.5">Specialization</th>
                    <th className="px-5 py-3.5">Hospital</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Patients</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {doctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                            {doc.name.replace('Dr. ', '').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                            <span className="text-[11px] text-slate-400">
                              Added {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 text-[11px] border border-indigo-100">
                          {doc.specialization}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{doc.hospital}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{doc.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{doc.email}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleOpenDetailModal(doc._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 font-semibold text-slate-700 transition-colors"
                          title="View assigned patients"
                        >
                          <Users className="h-3.5 w-3.5 text-indigo-600" />
                          <span>{doc.patientCount || 0} Patients</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenDetailModal(doc._id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Profile & Patients"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(doc)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Doctor Info"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Doctor"
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
              <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No doctors found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try modifying your search or filter criteria, or add a new doctor.
              </p>
            </div>
          )}
        </div>

        {/* Doctor Create / Edit Modal */}
        <DoctorModal
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
          doctor={selectedDoctorForEdit}
          onSaved={() => loadDoctors(pagination.page)}
        />

        {/* Doctor Details Modal (with assigned patients list and add/delete actions) */}
        <DoctorDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          doctorId={selectedDoctorIdForDetail}
          onRefreshParent={() => loadDoctors(pagination.page)}
        />
      </div>
    </AppLayout>
  );
}
