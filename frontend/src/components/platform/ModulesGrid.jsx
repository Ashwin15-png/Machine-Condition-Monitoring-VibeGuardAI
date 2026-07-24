import React from 'react';
import { Activity, LayoutDashboard, Cpu, Bell, BarChart3, History, PieChart, Wrench, FileText, User, Settings } from 'lucide-react';
import PlatformFeatureCard from './PlatformFeatureCard';

export const ModulesGrid = () => {
  const coreFeatures = [
    { title: 'Real-Time Machine Monitoring', icon: Cpu, color: 'blue' },
    { title: 'Industrial IoT Telemetry', icon: Activity, color: 'emerald' },
    { title: 'Machine Health Score', icon: BarChart3, color: 'purple' },
    { title: 'Temperature Monitoring', icon: Activity, color: 'amber' },
    { title: 'Vibration Monitoring', icon: Activity, color: 'rose' },
    { title: 'Historical Data Analytics', icon: History, color: 'indigo' },
    { title: 'Failure Prediction RUL', icon: Cpu, color: 'amber' },
    { title: 'OEE Analytics', icon: PieChart, color: 'blue' },
    { title: 'Maintenance Scheduling', icon: Wrench, color: 'emerald' },
    { title: 'Alert Management', icon: Bell, color: 'rose' },
    { title: 'PDF / CSV Reports', icon: FileText, color: 'indigo' },
    { title: 'JWT Access Controls', icon: User, color: 'purple' },
  ];

  return (
    <section id="features" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Core Engine Modules</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
          Explore the wide array of analytical instruments built directly into the VibeGuard Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coreFeatures.map((feature, i) => (
          <PlatformFeatureCard key={i} title={feature.title} icon={feature.icon} color={feature.color} delay={i * 0.05} />
        ))}
      </div>
    </section>
  );
};

export default ModulesGrid;
