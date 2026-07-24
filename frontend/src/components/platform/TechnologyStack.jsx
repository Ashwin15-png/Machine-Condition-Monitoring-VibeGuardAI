import React from 'react';
import { Database, Server, Component, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const TechnologyStack = () => {
  const stack = [
    {
      title: 'Backend Ecosystem',
      icon: Server,
      color: 'text-emerald-400',
      items: ['Node.js', 'Express', 'MongoDB Atlas', 'Mongoose', 'JWT', 'Socket.IO', 'Helmet', 'Morgan', 'Compression'],
    },
    {
      title: 'Frontend Framework',
      icon: Component,
      color: 'text-blue-400',
      items: ['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
    },
    {
      title: 'Database & Storage',
      icon: Database,
      color: 'text-purple-400',
      items: ['MongoDB Atlas', 'Deployment Ready', 'Cloud Persistence'],
    },
    {
      title: 'Real-Time Capabilities',
      icon: ShieldCheck,
      color: 'text-rose-400',
      items: ['Live Machine Status', 'Live Alerts', 'Live Dashboard', 'Live Analytics', 'Live Charts', 'Automatic Reconnection', 'Health Monitoring', 'Data Synchronization'],
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Enterprise Technology Stack</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">Built securely relying on modern full-stack methodologies.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stack.map((group, idx) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
                <Icon className={`w-5 h-5 ${group.color}`} />
                <h3 className="text-sm font-bold text-slate-200">{group.title}</h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TechnologyStack;
