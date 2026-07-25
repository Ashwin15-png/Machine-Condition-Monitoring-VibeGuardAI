import { useState, useEffect } from 'react';
import api from './api';
import socket from './socket';

export const useRealtimeDashboard = (initialMachineId = 'ALL') => {
  const [machineId, setMachineId] = useState(initialMachineId);
  const [data, setData] = useState({
    stats: {
      totalMachines: 0,
      healthyMachines: 0,
      warningMachines: 0,
      criticalMachines: 0,
      avgTemperature: 0,
      avgVibration: 0,
      readingsToday: 0,
      alertCount: 0,
      runningMachines: 0,
      overallOEE: 0,
    },
    healthPieData: [],
    history: [],
    fleet: [],
    alerts: [],
    loading: true,
    connected: false,
  });

  useEffect(() => {
    let isMounted = true;
    setData((prev) => ({ ...prev, loading: true }));

    // Fetch initial REST snapshot
    const fetchSnapshot = async () => {
      try {
        const [dashRes, alertRes] = await Promise.all([
          api.get(`/dashboard?machineId=${machineId}`),
          api.get(`/alerts?machineId=${machineId}`),
        ]);

        if (isMounted && dashRes.data.success) {
          setData((prev) => ({
            ...prev,
            stats: dashRes.data.stats || prev.stats,
            healthPieData: dashRes.data.healthPieData || prev.healthPieData,
            history: dashRes.data.history || [],
            fleet: dashRes.data.fleet || [],
            alerts: alertRes.data.success ? alertRes.data.data : prev.alerts,
            loading: false,
          }));
        }
      } catch (err) {
        console.warn('Backend REST endpoint fallback/connecting...', err);
        if (isMounted) setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSnapshot();

    // Socket.IO event handlers
    const onConnect = () => {
      if (isMounted) {
        setData((prev) => ({ ...prev, connected: true }));
        socket.emit('subscribe:telemetry', machineId);
      }
    };

    const onDisconnect = () => {
      if (isMounted) setData((prev) => ({ ...prev, connected: false }));
    };

    const onDashboardUpdate = (newStats) => {
      if (!isMounted) return;
      setData((prev) => ({
        ...prev,
        stats: newStats,
        healthPieData: [
          { name: 'Healthy', value: newStats.healthyMachines, color: '#22C55E' },
          { name: 'Warning', value: newStats.warningMachines, color: '#F59E0B' },
          { name: 'Critical', value: newStats.criticalMachines, color: '#EF4444' },
        ],
      }));
    };

    const onTelemetryUpdate = ({ sample, history }) => {
      if (!isMounted) return;
      setData((prev) => ({
        ...prev,
        history: history || [...prev.history, sample].slice(-100),
      }));
    };

    const onMachineUpdate = (fleetData) => {
      if (!isMounted) return;
      setData((prev) => ({
        ...prev,
        fleet: fleetData,
      }));
    };

    const onAlertNew = (newAlert) => {
      if (!isMounted) return;
      setData((prev) => {
        // Prevent duplicate alerts by ID
        const exists = prev.alerts.some((a) => a.id === newAlert.id || a.alertId === newAlert.alertId);
        if (exists) return prev;
        const normalized = {
          id: newAlert.alertId || newAlert.id,
          machineId: newAlert.machineId,
          machineName: newAlert.machineName,
          severity: newAlert.severity,
          message: newAlert.description || newAlert.message,
          timestamp: newAlert.timestamp,
          status: newAlert.status || 'Active',
          acknowledgedBy: newAlert.acknowledgedBy || null,
        };
        return {
          ...prev,
          alerts: [normalized, ...prev.alerts].slice(0, 50),
        };
      });
    };

    // Attach Socket Listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('dashboard:update', onDashboardUpdate);
    socket.on('telemetry:update', onTelemetryUpdate);
    socket.on('machine:update', onMachineUpdate);
    socket.on('alert:new', onAlertNew);

    if (socket.connected) {
      setData((prev) => ({ ...prev, connected: true }));
      socket.emit('subscribe:telemetry', machineId);
    }

    return () => {
      isMounted = false;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('dashboard:update', onDashboardUpdate);
      socket.off('telemetry:update', onTelemetryUpdate);
      socket.off('machine:update', onMachineUpdate);
      socket.off('alert:new', onAlertNew);
    };
  }, [machineId]);

  return { ...data, machineId, setMachineId };
};
