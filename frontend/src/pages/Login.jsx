import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, LogIn, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { APP_CONFIG } from '../utils/constants';
import { DEMO_ACCOUNT } from '../config/demoAccount';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        navigate('/overview');
      } else {
        setErrorMsg('Invalid corporate credentials. Please check email and password.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication Gateway Failed. Check server connection.');
    } finally {
      setLoading(false);
      setDemoLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleDemoAutofillLogin = () => {
    const demoEmail = DEMO_ACCOUNT.email || 'operator@apex-industrial.com';
    const demoPass = DEMO_ACCOUNT.password || 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    setDemoLoading(true);
    // Execute live authentication using existing backend API
    executeLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient Industrial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--info)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[var(--info)]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[18px] bg-[var(--info)]/15 border border-[var(--info)]/30 text-[var(--info)] mb-1 shadow-lg shadow-blue-500/10">
            <Zap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{APP_CONFIG.NAME}</h1>
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            {APP_CONFIG.COMPANY} — Industrial Telemetry Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded-[4px] bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--info)] focus:ring-[var(--info)] cursor-pointer"
              />
              <span>Remember Device</span>
            </label>
            <a href="#forgot" className="text-[var(--info)] hover:underline font-medium">
              Forgot Credentials?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-[54px] rounded-[14px]"
            loading={loading && !demoLoading}
            icon={LogIn}
          >
            Access Dashboard
          </Button>
        </form>

        {/* Enterprise Demo Access Card */}
        <div className="pt-5 border-t border-[var(--border)] space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[16px] p-4 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--info)]">
              <ShieldCheck className="w-4 h-4" />
              <span>⚡ Enterprise Demo Access</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Use the configured demonstration operator account.
            </p>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-mono font-semibold text-[var(--text-secondary)]">
              [ Demo Operator ]
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-[54px] rounded-[14px] font-semibold text-xs text-[var(--text-primary)] hover:border-[var(--info)] transition-colors"
              onClick={handleDemoAutofillLogin}
              loading={demoLoading}
              icon={UserCheck}
            >
              Autofill & Login
            </Button>
          </div>
        </div>

        <div className="text-center pt-1">
          <p className="text-xs text-[var(--text-secondary)]">
            Unknown user?{' '}
            <Link to="/register" className="text-[var(--info)] hover:underline font-semibold transition-colors">
              Create an account
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

export default Login;