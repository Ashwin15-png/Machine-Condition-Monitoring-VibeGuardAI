import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Clock,
  Settings,
  User,
  LogOut,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import Avatar from '../ui/Avatar';

export const Topbar = ({ isCollapsed, toggleSidebar, toggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between transition-all duration-300">
      {/* Left: Mobile Drawer Trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search machines, sensors, alerts... (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-xs leading-5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--info)]/40 focus:border-[var(--info)]/60 transition-all cursor-text flex items-center h-[38px]"
          />
        </div>
      </div>

      {/* Right: Date/Time, System Status, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--badge-normal-bg)] border border-[var(--badge-normal-text)]/20 text-[var(--badge-normal-text)] text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 animate-pulse" />
          <span>Sensors Telemetry OK</span>
        </div>

        {/* Date & Live Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] font-mono">
          <Clock className="w-3.5 h-3.5 text-[var(--info)]" />
          <span>{formattedDate}</span>
          <span className="text-[var(--text-muted)]">|</span>
          <span className="text-[var(--text-primary)] font-bold">{formattedTime}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border)]"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--warning)]" /> : <Moon className="w-4 h-4 text-[var(--info)]" />}
        </button>

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={
            <div className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border)] cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)] animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)]" />
            </div>
          }
          align="right"
          className="w-80"
        >
          <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[var(--text-primary)]">System Alerts (3 New)</h4>
            <button
              onClick={() => navigate('/alerts')}
              className="text-[10px] text-[var(--info)] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="py-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            <div className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-lg text-xs cursor-pointer border-l-2 border-[var(--danger)]">
              <p className="font-semibold text-[var(--danger)]">Critical Vibration Alarm</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">Cooling Tower Turbine exceeds 7.9 mm/s</p>
              <span className="text-[9px] text-[var(--text-muted)]">2 min ago</span>
            </div>
            <div className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-lg text-xs cursor-pointer border-l-2 border-[var(--warning)]">
              <p className="font-semibold text-[var(--warning)]">High Temp Warning</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">Hydraulic Press fluid temperature rising</p>
              <span className="text-[9px] text-[var(--text-muted)]">14 min ago</span>
            </div>
          </div>
        </Dropdown>

        {/* Profile Dropdown Menu */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border)]">
              <Avatar src={user?.avatarUrl} name={user?.name} size="sm" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{user?.name}</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{user?.role}</span>
              </div>
            </div>
          }
          align="right"
          className="w-56"
        >
          <div className="p-3 border-b border-[var(--border)]">
            <p className="text-xs font-bold text-[var(--text-primary)]">{user?.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
          <DropdownItem icon={User} onClick={() => navigate('/profile')}>
            Profile Settings
          </DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>
            Platform Configuration
          </DropdownItem>
          <DropdownItem icon={ShieldCheck} onClick={() => navigate('/analytics')}>
            Audit Logs
          </DropdownItem>
          <div className="border-t border-[var(--border)] my-1" />
          <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/login'); }}>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
