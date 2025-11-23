import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Plus, Trash2, Search, TrendingUp, ArrowUpRight, CheckCircle, Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchLeads, createLead, deleteLead, updateLead } from '../redux/leadSlice';
import { StatusChip } from '../utils/statusColors';
import { toast } from 'react-toastify';

const LeadsPage = () => {
  const dispatch = useDispatch();
  const { leads, isLoading } = useSelector((state) => state.leads);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);

  useEffect(() => {
    // Fetch leads on component mount
    dispatch(fetchLeads());
  }, [dispatch]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddOrUpdateLead = async () => {
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      toast.error('First name must be at least 2 characters');
      return;
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      toast.error('Last name must be at least 2 characters');
      return;
    }
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingLeadId) {
        await dispatch(updateLead(editingLeadId, {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
        }));
        toast.success('Lead updated successfully');
      } else {
        await dispatch(createLead({
          ...formData,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        }));
        toast.success('Lead added successfully');
      }

      // Clear form and reset editing state
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
      });
      setShowModal(false);
      setIsEditing(false);
      setEditingLeadId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      await dispatch(deleteLead(id));
      toast.success('Lead deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleEditLead = (leadId) => {
    const leadToEdit = leads.find((lead) => lead._id === leadId);
    if (leadToEdit) {
      setFormData({
        firstName: leadToEdit.firstName,
        lastName: leadToEdit.lastName,
        email: leadToEdit.email,
        phone: leadToEdit.phone,
        company: leadToEdit.company,
        status: leadToEdit.status.toLowerCase(),
      });
      setEditingLeadId(leadId);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0;
  const conversionRate = leads.length > 0 ? Math.round((qualifiedLeads / leads.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Leads</h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Manage and track your leads</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#1d4ed8';
                e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2563eb';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} /> Add Lead
            </button>
          </div>

          {/* Stats Cards Grid - 4 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            {/* Total Leads Card */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Total Leads</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{totalLeads}</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>All active leads</div>
              </div>
              <Users size={56} color="#3b82f6" strokeWidth={1.5} />
            </div>

            {/* Qualified Leads Card */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Qualified</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>{qualifiedLeads}</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>Ready to convert</div>
              </div>
              <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
            </div>

            {/* Average Score Card */}
            <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8', marginBottom: '12px' }}>Avg Score</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#581c87', marginBottom: '8px' }}>{avgScore}%</div>
                <div style={{ fontSize: '12px', color: '#6b21a8' }}>Lead quality metric</div>
              </div>
              <TrendingUp size={56} color="#a855f7" strokeWidth={1.5} />
            </div>

            {/* Conversion Rate Card */}
            <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Conversion</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{conversionRate}%</div>
                <div style={{ fontSize: '12px', color: '#92400e' }}>Qualification rate</div>
              </div>
              <ArrowUpRight size={56} color="#f97316" strokeWidth={1.5} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Leads Table */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : filteredLeads.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr
                      key={lead._id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        background: index % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb'}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>{lead.firstName} {lead.lastName}</td>
                      <td style={{ padding: '16px 24px', fontSize: '15px', color: '#6b7280' }}>{lead.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: '15px', color: '#6b7280' }}>{lead.company || '-'}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <StatusChip status={lead.status} type="lead" />
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', minWidth: '60px', background: '#e5e7eb', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', height: '100%', borderRadius: '9999px', width: `${lead.score}%` }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{lead.score}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => handleEditLead(lead._id)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s', padding: '4px' }}
                          onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                          onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s', padding: '4px' }}
                          onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Users size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p style={{ fontSize: '16px', color: '#9ca3af' }}>No leads found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s'
          }}
          onClick={() => setShowModal(false)}
        >
          {/* Modal Content */}
          <div
            style={{
              background: 'white',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'slideUp 0.3s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Add New Lead</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{
                  padding: '12px 16px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{
                  padding: '12px 16px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '24px',
                background: 'white',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddOrUpdateLead}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: isSubmitting ? '#93c5fd' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = '#1d4ed8';
                    e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = '#2563eb';
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : isEditing ? 'Update Lead' : 'Add Lead'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default LeadsPage;
