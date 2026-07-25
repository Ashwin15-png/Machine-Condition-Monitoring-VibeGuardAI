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
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const success = await register(name, email, password, role);
      if (success) {
        navigate('/overview');
      } else {
        setErrorMsg('Registration failed. Please check your details.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication Gateway Failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 sm:p-6 relative font-sans">
      {/* Ambient Industrial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-[#171717] border border-white/10 rounded-[24px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[18px] bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] mb-1 shadow-lg shadow-cyan-500/10">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Register Access</h1>
          <p className="text-xs font-medium text-white/60">Create a new {APP_CONFIG.COMPANY} Engineer Profile</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            icon={User}
            type="text"
            placeholder="Sterling Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

          <Input
            label="Corporate Email Address"
            icon={Mail}
            type="email"
            placeholder="sterling@apex-industrial.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <div>
            <label className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-white/80 mb-[12px] select-none">
              Role / Assignment
            </label>
            <div className="relative flex items-center w-full">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-[56px] bg-[#111111] border border-white/10 rounded-[14px] px-[20px] text-[15px] text-white outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/40 appearance-none transition-all cursor-pointer font-sans"
                required
              >
                <option value="Operator">Operator</option>
                <option value="Engineer">Engineer</option>
                <option value="Administrator">Administrator</option>
                <option value="Maintenance Engineer">Maintenance Engineer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Reliability Engineer">Reliability Engineer</option>
              </select>
              <div className="absolute top-1/2 right-[18px] -translate-y-1/2 pointer-events-none text-white/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-[54px] rounded-[14px] bg-[#06B6D4] hover:bg-[#0891B2] text-white border-none mt-2"
            loading={loading}
            icon={Zap}
          >
            Create Profile & Initialize
          </Button>
        </form>

        {/* Existing User Login Link */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <p className="text-xs text-white/60">
            Already have an active corporate profile?{' '}
            <Link to="/login" className="text-[#06B6D4] hover:underline font-semibold transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="text-center text-[10px] font-mono text-white/40 pt-1">
          Encrypted with 256-bit TLS Gateway Security • {APP_CONFIG.VERSION}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
