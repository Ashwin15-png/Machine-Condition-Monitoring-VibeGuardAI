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
    <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between transition-all duration-300">
      {/* Left: Mobile Drawer Trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search machines, sensors, alerts... (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
          />
        </div>
      </div>

      {/* Right: Date/Time, System Status, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 animate-pulse" />
          <span>Sensors Telemetry OK</span>
        </div>

        {/* Date & Live Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{formattedDate}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-100 font-bold">{formattedTime}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors border border-transparent hover:border-slate-700"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={
            <div className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors border border-transparent hover:border-slate-700">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </div>
          }
          align="right"
          className="w-80"
        >
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200">System Alerts (3 New)</h4>
            <button
              onClick={() => navigate('/alerts')}
              className="text-[10px] text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="py-2 space-y-1 max-h-64 overflow-y-auto">
            <div className="p-2.5 hover:bg-slate-800/50 rounded-lg text-xs cursor-pointer border-l-2 border-red-500">
              <p className="font-semibold text-red-400">Critical Vibration Alarm</p>
              <p className="text-[11px] text-slate-400 truncate">Cooling Tower Turbine exceeds 7.9 mm/s</p>
              <span className="text-[9px] text-slate-500">2 min ago</span>
            </div>
            <div className="p-2.5 hover:bg-slate-800/50 rounded-lg text-xs cursor-pointer border-l-2 border-amber-500">
              <p className="font-semibold text-amber-400">High Temp Warning</p>
              <p className="text-[11px] text-slate-400 truncate">Hydraulic Press fluid temperature rising</p>
              <span className="text-[9px] text-slate-500">14 min ago</span>
            </div>
          </div>
        </Dropdown>

        {/* Profile Dropdown Menu */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800">
              <Avatar src={user?.avatarUrl} name={user?.name} size="sm" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-400">{user?.role}</span>
              </div>
            </div>
          }
          align="right"
          className="w-56"
        >
          <div className="p-3 border-b border-slate-800">
            <p className="text-xs font-bold text-slate-200">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
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
          <div className="border-t border-slate-800 my-1" />
          <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/login'); }}>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
