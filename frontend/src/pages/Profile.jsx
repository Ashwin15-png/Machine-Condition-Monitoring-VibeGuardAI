import React, { useState } from 'react';
import { User, Mail, Building, Shield, Save, Key, Phone, Link as LinkIcon, Clock, Activity, Calendar } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    plantLocation: user?.plantLocation || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[var(--info)]" />
          <span>User Profile & Security Clearance</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Manage operator authentication credentials, facility assignments, and alert preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Header */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4">
          <Avatar src={user?.avatarUrl} name={user?.name} size="xl" />
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{user?.name}</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">{user?.role}</p>
          </div>
          <div className="w-full pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] space-y-2 text-left">
            <p className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--info)] shrink-0" />
              <span>{user?.department}</span>
            </p>
            <p className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--success)] shrink-0" />
              <span>{user?.employeeId || 'TEMP-000'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--info)] shrink-0" />
              <span>{user?.phone || 'Not provided'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--warning)] shrink-0" />
              <span>Last Login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : 'Active Now'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--danger)] shrink-0" />
              <span>Status: {user?.status || 'Active'}</span>
            </p>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <Input
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address (Locked)"
                icon={Mail}
                type="email"
                value={formData.email}
                disabled={user?.role !== 'Admin'}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                icon={Phone}
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Department"
                icon={Building}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <Input
                label="Plant Facility Location"
                icon={Building}
                value={formData.plantLocation}
                onChange={(e) => setFormData({ ...formData, plantLocation: e.target.value })}
              />
              <Input
                label="Avatar External URL"
                icon={LinkIcon}
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
              />

              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <Button variant="primary" size="sm" icon={Save} type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;