import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit2, Lock, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: user?.department || '',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Profile Settings</h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Manage your account and preferences</p>
          </div>

          {/* User Info Card */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '8px' }}>{user?.email}</p>
                  <p style={{ fontSize: '14px', color: '#9ca3af' }}>Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{ padding: '12px 24px', background: isEditing ? '#ef4444' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.background = isEditing ? '#dc2626' : '#1d4ed8'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.background = isEditing ? '#ef4444' : '#2563eb'; e.target.style.transform = 'translateY(0)'; }}
              >
                <Edit2 size={18} /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Edit Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', background: 'white', cursor: 'pointer', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Select Department</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="support">Support</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s', width: '100%' }}
                  onMouseEnter={(e) => { e.target.style.background = '#059669'; e.target.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#10b981'; e.target.style.transform = 'translateY(0)'; }}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>First Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>{formData.firstName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Last Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>{formData.lastName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>{formData.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Department</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827', textTransform: 'capitalize' }}>{formData.department || '—'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Card */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={24} color="#2563eb" /> Security & Privacy
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>✓ Password</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Last changed 30 days ago</p>
                </div>
                <button
                  style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                >
                  Change
                </button>
              </div>
              <div style={{ padding: '20px', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>🔐 Two-Factor Authentication</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Add an extra layer of security</p>
                </div>
                <button
                  style={{ padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#475569'}
                  onMouseLeave={(e) => e.target.style.background = '#64748b'}
                >
                  Enable
                </button>
              </div>
              <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#7f1d1d', marginBottom: '4px' }}>🗑️ Delete Account</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Permanently remove your account</p>
                </div>
                <button
                  style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Account Activity</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>Login from Chrome on Mac</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>2 hours ago • 192.168.1.1</p>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>Profile updated</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>1 day ago</p>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>Password changed</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
