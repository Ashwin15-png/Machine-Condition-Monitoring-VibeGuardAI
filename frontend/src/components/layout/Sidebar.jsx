import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cpu,
  Activity,
  AlertTriangle,
  BarChart3,
  History as HistoryIcon,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  PlusCircle,
  PieChart,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { APP_CONFIG } from '../../utils/constants';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Machines', path: '/machines', icon: Cpu },
  { name: 'Telemetry Readings', path: '/readings', icon: Activity },
  { name: 'Add Reading', path: '/readings/new', icon: PlusCircle },
  { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: 6 },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'OEE Dashboard', path: '/oee', icon: PieChart },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'History', path: '/history', icon: HistoryIcon },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const Sidebar = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] text-[var(--sidebar-text)] font-sans select-none relative transition-colors duration-300">
      {/* Sidebar Header / Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--sidebar-border)] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/10">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-base font-bold text-[var(--text-primary)] tracking-tight whitespace-nowrap">
                {APP_CONFIG.NAME}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] truncate">
                {APP_CONFIG.COMPANY}
              </span>
            </motion.div>
          )}
        </div>

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-active-text)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobileOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-active-text)] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/30 shadow-[var(--shadow)]'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-[var(--sidebar-active-text)]' : 'group-hover:scale-110'}`} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate">{item.name}</span>
                )}
              </div>

              {item.badge && (!isCollapsed || isMobileOpen) && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Card & Logout Footer */}
      <div className="p-3 border-t border-[var(--sidebar-border)] bg-[var(--bg-secondary)] space-y-3 shrink-0">
        {user && (!isCollapsed || isMobileOpen) && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[var(--sidebar-text)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] hover:border-[var(--danger)]/20 border border-transparent transition-all duration-200"
          title="Sign out of system"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
        </button>

        {(!isCollapsed || isMobileOpen) && (
          <div className="pt-2 text-center text-[10px] text-[var(--text-muted)] border-t border-[var(--sidebar-border)]">
            {APP_CONFIG.VERSION}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Position) */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide in from left) */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
