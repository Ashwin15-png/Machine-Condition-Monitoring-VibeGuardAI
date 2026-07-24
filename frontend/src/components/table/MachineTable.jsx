import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit2,
  Trash2,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import EmptyState from '../ui/EmptyState';
import TableSkeleton from '../ui/Skeleton';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatTemperature, formatVibration } from '../../utils/formatters';

export const MachineTable = ({
  machines = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter & Search logic
  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || m.status.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [machines, searchTerm, statusFilter]);

  // Sort logic
  const sortedMachines = useMemo(() => {
    return [...filteredMachines].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMachines, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedMachines.length / pageSize) || 1;
  const paginatedMachines = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMachines.slice(start, start + pageSize);
  }, [sortedMachines, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget && onDelete) {
      onDelete(deleteTarget);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Status Filter, Page Size */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111827]/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-full sm:w-72">
            <Input
              icon={Search}
              placeholder="Filter by machine ID, name, location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-8 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="HEALTHY">Healthy</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
              <option value="OFFLINE">Offline</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium self-end sm:self-center">
          Showing <span className="text-slate-100 font-bold">{sortedMachines.length}</span> of{' '}
          <span className="text-slate-100 font-bold">{machines.length}</span> assets
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111827]/90 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Table Header */}
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Machine ID</span>
                    {sortField === 'id' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Asset Name</span>
                    {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3.5 px-4">Location</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('temperature')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Temp</span>
                    {sortField === 'temperature' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('vibration')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Vibration RMS</span>
                    {sortField === 'vibration' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('healthScore')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Health Index</span>
                    {sortField === 'healthScore' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6">
                    <TableSkeleton rows={4} />
                  </td>
                </tr>
              ) : paginatedMachines.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      title="No Matching Industrial Machines"
                      description="No machine assets match the applied search filter or status selection."
                    />
                  </td>
                </tr>
              ) : (
                paginatedMachines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 group-hover:text-blue-400">
                      {m.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">{m.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{m.location}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {formatTemperature(m.temperature)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {formatVibration(m.vibration)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          m.healthScore >= 90
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : m.healthScore >= 70
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {m.healthScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onView && onView(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="View Telemetry Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          title="Edit Asset Configuration"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Decommission Machine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer Controls */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <span className="font-bold text-slate-200">{currentPage}</span> of{' '}
              <span className="font-bold text-slate-200">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Decommission Industrial Asset?"
        message={`Are you sure you want to remove ${deleteTarget?.name} (${deleteTarget?.id}) from active condition monitoring?`}
        confirmText="Remove Asset"
      />
    </div>
  );
};

export default MachineTable;
