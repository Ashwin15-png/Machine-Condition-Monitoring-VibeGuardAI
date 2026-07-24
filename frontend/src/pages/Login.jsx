import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { APP_CONFIG } from '../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('a.sterling@apex-industrial.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/overview');
      } else {
        alert('Invalid corporate credentials');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication Gateway Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('a.sterling@apex-industrial.com');
    setPassword('enterprise123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-2 shadow-lg shadow-blue-500/10">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">{APP_CONFIG.NAME}</h2>
          <p className="text-xs text-slate-400">{APP_CONFIG.COMPANY} — Enterprise Telemetry Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember Device</span>
            </label>
            <a href="#forgot" className="text-blue-400 hover:underline">
              Forgot Access Credentials?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            icon={LogIn}
          >
            Access Dashboard
          </Button>
        </form>

        {/* Demo Fast Login Bar */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[11px] text-slate-500">Need quick testing credentials?</p>
          <button
            onClick={handleDemoFill}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <span>Autofill Demo Engineer Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-[12px] text-slate-400">
            Unknown user?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create an account
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

export default Login;