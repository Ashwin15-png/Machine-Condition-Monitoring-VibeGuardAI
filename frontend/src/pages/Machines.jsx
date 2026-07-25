import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Grid, List, Search } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import StatusCard from '../components/cards/StatusCard';
import MachineTable from '../components/table/MachineTable';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EditMachineModal from '../components/modals/EditMachineModal';
import { machineService } from '../services/machineService';
import socket from '../services/socket';

export const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMachineForm, setNewMachineForm] = useState({
    name: '',
    id: '',
    location: '',
    sensorId: '',
  });

  useEffect(() => {
    let isMounted = true;
    machineService.getAll().then((data) => {
      if (isMounted && data) setMachines(data);
    }).catch(console.error);

    const onMachineUpdate = (fleetData) => {
      if (isMounted) setMachines(fleetData);
    };

    socket.on('machine:update', onMachineUpdate);
    return () => {
      isMounted = false;
      socket.off('machine:update', onMachineUpdate);
    };
  }, []);

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMachine = async (target) => {
    try {
      await machineService.delete(target.id);
      setMachines((prev) => prev.filter((m) => m.id !== target.id));
    } catch (err) {
      console.error('Failed to delete machine:', err);
    }
  };

  const handleRegisterMachine = async (e) => {
    e.preventDefault();
    try {
      const created = await machineService.create(newMachineForm);
      setMachines((prev) => [...prev, created]);
      setIsAddModalOpen(false);
      setNewMachineForm({ name: '', id: '', location: '', sensorId: '' });
    } catch (err) {
      console.error('Failed to register machine:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[var(--info)]" />
            <span>Industrial Asset Registry</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage factory machinery, assigned vibration sensors, and maintenance schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border)] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[var(--info)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-[var(--info)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Register New Machine
          </Button>
        </div>
      </div>

      {/* Grid View Mode Controls */}
      {viewMode === 'grid' && (
        <div className="w-full max-w-md">
          <Input
            icon={Search}
            placeholder="Search machines by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((m) => (
            <StatusCard
              key={m.id}
              machine={m}
              onViewDetails={(machine) => setSelectedMachine(machine)}
              onEdit={(machine) => setEditingMachine(machine)}
            />
          ))}
        </div>
      ) : (
        <MachineTable
          machines={machines}
          onView={(m) => setSelectedMachine(m)}
          onEdit={(m) => setEditingMachine(m)}
          onDelete={handleDeleteMachine}
        />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMachine)}
        onClose={() => setSelectedMachine(null)}
        title={selectedMachine ? `${selectedMachine.name} (${selectedMachine.id})` : ''}
        subtitle="Machine Asset Specs & Condition Profile"
      >
        {selectedMachine && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Current Health State:</span>
              <Badge status={selectedMachine.status} dot />
            </div>
            <div className="space-y-2 text-[var(--text-secondary)]">
              <p><strong className="text-[var(--text-muted)]">Location:</strong> {selectedMachine.location}</p>
              <p><strong className="text-[var(--text-muted)]">Type:</strong> {selectedMachine.type}</p>
              <p><strong className="text-[var(--text-muted)]">Sensor ID:</strong> {selectedMachine.sensorId}</p>
              <p><strong className="text-[var(--text-muted)]">Operator:</strong> {selectedMachine.operator}</p>
              <p><strong className="text-[var(--text-muted)]">Last Service Date:</strong> {selectedMachine.lastMaintenance}</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedMachine(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Industrial Machine Asset"
        subtitle="Connect hardware IoT sensor telemetry feed to platform"
      >
        <form onSubmit={handleRegisterMachine} className="space-y-4 text-xs">
          <Input
            label="Machine Name"
            placeholder="e.g. Servo Driven Stamping Press 02"
            value={newMachineForm.name}
            onChange={(e) => setNewMachineForm({ ...newMachineForm, name: e.target.value })}
            required
          />
          <Input
            label="Asset ID"
            placeholder="e.g. MCH-109"
            value={newMachineForm.id}
            onChange={(e) => setNewMachineForm({ ...newMachineForm, id: e.target.value })}
            required
          />
          <Input
            label="Plant Location"
            placeholder="e.g. Plant B - Cell 04"
            value={newMachineForm.location}
            onChange={(e) => setNewMachineForm({ ...newMachineForm, location: e.target.value })}
            required
          />
          <Input
            label="Sensor Serial Number"
            placeholder="e.g. SN-SENS-9901"
            value={newMachineForm.sensorId}
            onChange={(e) => setNewMachineForm({ ...newMachineForm, sensorId: e.target.value })}
            required
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Register Asset
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Machine Modal */}
      <EditMachineModal
        isOpen={Boolean(editingMachine)}
        onClose={() => setEditingMachine(null)}
        machine={editingMachine}
        onMachineUpdated={(updated) => {
          setMachines((prev) => prev.map((m) => (m.id === updated.id || m.machineId === updated.machineId ? updated : m)));
          setEditingMachine(null);
        }}
      />
    </div>
  );
};

export default Machines;

