import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, CheckCircle, TrendingUp, Plus, Trash2, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { addDeal, removeDeal } from '../redux/dealSlice';
import { toast } from 'react-toastify';

const DealsPage = () => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const [showModal, setShowModal] = useState(false);
  const [filterStage, setFilterStage] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'prospecting',
    probability: 25,
    closingDate: '',
  });

  const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed'];
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const filteredDeals = deals.filter((deal) => filterStage === 'all' || deal.stage === filterStage);
  const avgDealSize = deals.length > 0 ? Math.round(totalValue / deals.length) : 0;
  const closedWon = deals.filter((d) => d.stage === 'closed').length;

  const handleAddDeal = () => {
    if (!formData.title || !formData.value) {
      toast.error('Please fill in required fields');
      return;
    }
    dispatch(
      addDeal({
        ...formData,
        id: Date.now(),
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        createdAt: new Date().toISOString(),
      })
    );
    setFormData({
      title: '',
      value: '',
      stage: 'prospecting',
      probability: 25,
      closingDate: '',
    });
    setShowModal(false);
    toast.success('Deal added successfully');
  };

  const handleDeleteDeal = (id) => {
    dispatch(removeDeal(id));
    toast.success('Deal deleted');
  };

  const stageBadgeStyle = (stage) => {
    const baseStyle = { display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' };
    const stages = {
      prospecting: { background: '#dbeafe', color: '#1e40af' },
      qualification: { background: '#dcfce7', color: '#15803d' },
      proposal: { background: '#e9d5ff', color: '#6b21a8' },
      negotiation: { background: '#fed7aa', color: '#92400e' },
      closed: { background: '#cffafe', color: '#164e63' },
    };
    return { ...baseStyle, ...stages[stage] };
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Deals</h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Manage your sales pipeline</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#15803d';
                e.target.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#16a34a';
                e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} /> Add Deal
            </button>
          </div>

          {/* Stats Cards Grid - 4 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            {/* Total Deals Card */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Total Deals</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{deals.length}</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>In pipeline</div>
              </div>
              <DollarSign size={56} color="#3b82f6" strokeWidth={1.5} />
            </div>

            {/* Pipeline Value Card */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Pipeline Value</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>${(totalValue / 1000).toFixed(1)}K</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>Total value</div>
              </div>
              <TrendingUp size={56} color="#10b981" strokeWidth={1.5} />
            </div>

            {/* Avg Deal Size Card */}
            <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8', marginBottom: '12px' }}>Avg Deal Size</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#581c87', marginBottom: '8px' }}>${avgDealSize.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#6b21a8' }}>Per deal</div>
              </div>
              <BarChart3 size={56} color="#a855f7" strokeWidth={1.5} />
            </div>

            {/* Closed Won Card */}
            <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Closed Won</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{closedWon}</div>
                <div style={{ fontSize: '12px', color: '#92400e' }}>This period</div>
              </div>
              <CheckCircle size={56} color="#f97316" strokeWidth={1.5} />
            </div>
          </div>

          {/* Stage Filter */}
          <div style={{ marginBottom: '24px' }}>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s',
                minWidth: '200px'
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
              <option value="all">All Stages</option>
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Deal Stages Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage);
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
              const stagePercentage = totalValue > 0 ? (stageValue / totalValue) * 100 : 0;
              return (
                <div
                  key={stage}
                  style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '14px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px', textTransform: 'capitalize' }}>{stage}</h3>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>{stageDeals.length}</div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>${(stageValue / 1000).toFixed(1)}K</p>
                  <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        height: '100%',
                        borderRadius: '9999px',
                        width: `${stagePercentage}%`,
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deals Table */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            {filteredDeals.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stage</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Probability</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Value</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal, index) => (
                    <tr
                      key={deal.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        background: index % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb'}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>{deal.title}</td>
                      <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>${deal.value?.toLocaleString()}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={stageBadgeStyle(deal.stage)}>{deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', minWidth: '60px', background: '#e5e7eb', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', height: '100%', borderRadius: '9999px', width: `${deal.probability}%` }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{deal.probability}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>${Math.round((deal.value * deal.probability) / 100).toLocaleString()}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
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
                <DollarSign size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p style={{ fontSize: '16px', color: '#9ca3af' }}>No deals found</p>
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
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Add New Deal</h2>

            <input
              type="text"
              placeholder="Deal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              type="number"
              placeholder="Deal Value ($)"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '16px',
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
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed">Closed</option>
            </select>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Probability: {formData.probability}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '9999px',
                  background: '#e5e7eb',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              />
            </div>

            <input
              type="date"
              value={formData.closingDate}
              onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '24px',
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddDeal}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#15803d';
                  e.target.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#16a34a';
                  e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Add Deal
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
                onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.background = '#e5e7eb'}
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
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
          border: none;
        }
      `}</style>
    </>
  );
};

export default DealsPage;
