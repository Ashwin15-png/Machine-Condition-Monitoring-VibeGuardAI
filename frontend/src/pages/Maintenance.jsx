import React, { useEffect, useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, Calendar, CheckSquare } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import api from '../services/api';
import StateWrapper from '../components/ui/StateWrapper';

export const Maintenance = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/maintenance');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const markCompleted = async (id) => {
    try {
      await api.patch(`/maintenance/${id}/status`, { status: 'Completed' });
      fetchTasks();
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  };

  return (
    <StateWrapper loading={loading} empty={!loading && tasks.length === 0} onRetry={fetchTasks}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <Breadcrumb />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-orange-500" />
              <span>Asset Maintenance Operations</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Work order management, scheduled inspections, and historic maintenance tracking.
            </p>
          </div>
          
          <Button variant="primary" size="sm" icon={Plus}>
            New Work Order
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Work Orders & Schedule</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-card)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Machine</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Scheduled For</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[var(--text-primary)]">
                  {tasks.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-secondary)]">
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">{t.maintenanceId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--text-secondary)]">{t.machineId}</td>
                      <td className="py-3 px-4">
                         <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[var(--bg-secondary)] border gap-1 border-[var(--border)]">
                            {t.type}
                         </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                         {new Date(t.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                         {t.status === 'Completed' ? (
                           <Badge variant="success">Completed</Badge>
                         ) : t.status === 'In Progress' ? (
                           <Badge variant="warning">In Progress</Badge>
                         ) : (
                           <Badge variant="default">Scheduled</Badge>
                         )}
                      </td>
                      <td className="py-3 px-4 truncate max-w-[200px] text-[var(--text-muted)]">{t.notes || '—'}</td>
                      <td className="py-3 px-4 text-right">
                         {t.status !== 'Completed' && (
                            <Button variant="outline" size="xs" icon={CheckSquare} onClick={() => markCompleted(t._id)}>
                              Close
                            </Button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </StateWrapper>
  );
};

export default Maintenance;
