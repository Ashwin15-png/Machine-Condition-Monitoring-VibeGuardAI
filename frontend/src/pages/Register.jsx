import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, UserPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { APP_CONFIG } from '../utils/constants';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register(name, email, password, role);
      if (success) {
        navigate('/overview');
      } else {
        alert('Registration failed - Please check details.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication Gateway Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-2 shadow-lg shadow-purple-500/10">
            <UserPlus className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Register Access</h2>
          <p className="text-xs text-slate-400">Create a new {APP_CONFIG.COMPANY} Engineer Profile</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            type="text"
            placeholder="Engineer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Corporate Email Address"
            icon={Mail}
            type="email"
            placeholder="operator@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Engineering Assignment Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0F172A]/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 appearance-none transition-all"
                required
              >
                <option value="Operator">Operator</option>
                <option value="Engineer">Engineer</option>
                <option value="Administrator">Administrator</option>
                <option value="Maintenance Engineer">Maintenance Engineer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Reliability Engineer">Reliability Engineer</option>
              </select>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={loading}
            icon={Zap}
          >
            Create Profile & Initialize
          </Button>
        </form>

        {/* Existing User Login Link */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[12px] text-slate-400">
            Already have an active corporate profile?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="text-center text-[10px] text-slate-500">
          Encrypted with 256-bit TLS Gateway Security • {APP_CONFIG.VERSION}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
