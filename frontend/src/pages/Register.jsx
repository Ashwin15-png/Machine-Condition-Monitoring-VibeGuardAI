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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient Industrial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--info)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[var(--info)]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[18px] bg-[var(--info)]/15 border border-[var(--info)]/30 text-[var(--info)] mb-1 shadow-lg shadow-purple-500/10">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Register Access</h1>
          <p className="text-xs font-medium text-[var(--text-secondary)]">Create a new {APP_CONFIG.COMPANY} Engineer Profile</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-medium text-center">
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
            required
          />

          <Input
            label="Corporate Email Address"
            icon={Mail}
            type="email"
            placeholder="sterling@apex-industrial.com"
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

          <div>
            <label className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] mb-[10px] select-none">
              Role / Assignment
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-[56px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[14px] px-[20px] text-[15px] text-[var(--text-primary)] outline-none focus:border-[var(--info)] focus:ring-2 focus:ring-[var(--info)]/40 appearance-none transition-all cursor-pointer font-sans"
                required
              >
                <option value="Operator">Operator</option>
                <option value="Engineer">Engineer</option>
                <option value="Administrator">Administrator</option>
                <option value="Maintenance Engineer">Maintenance Engineer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Reliability Engineer">Reliability Engineer</option>
              </select>
              <div className="absolute top-1/2 right-[20px] -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-[54px] rounded-[14px] mt-2"
            loading={loading}
            icon={Zap}
          >
            Create Profile & Initialize
          </Button>
        </form>

        {/* Existing User Login Link */}
        <div className="pt-4 border-t border-[var(--border)] text-center space-y-2">
          <p className="text-xs text-[var(--text-secondary)]">
            Already have an active corporate profile?{' '}
            <Link to="/login" className="text-[var(--info)] hover:underline font-semibold transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="text-center text-[10px] font-mono text-[var(--text-muted)] pt-1">
          Encrypted with 256-bit TLS Gateway Security • {APP_CONFIG.VERSION}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
