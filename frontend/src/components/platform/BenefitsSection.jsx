import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const BenefitsSection = () => {
  const benefits = [
    'Reduce Downtime',
    'Increase Equipment Reliability',
    'Continuous Monitoring',
    'Predictive Maintenance',
    'Operational Visibility',
    'Data Driven Decisions',
    'Improved Productivity',
    'Lower Maintenance Cost'
  ];

  return (
    <section className="py-16 px-4 bg-[#0B1120]/40 border-y border-slate-800/80 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Key Business Benefits</h2>
          <p className="text-sm text-slate-400 mt-2">Deploying real-time SIH 2026 telemetry analytics.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-[#0F172A] hover:bg-slate-800 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" />
              <span className="text-xs font-semibold text-slate-200">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
