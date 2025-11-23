import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, DollarSign, TrendingUp, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchLeads } from '../redux/leadSlice';
import { fetchDeals } from '../redux/dealSlice';
import { fetchTasks } from '../redux/taskSlice';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.leads);
  const { deals } = useSelector((state) => state.deals);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    // Fetch all data on component mount
    dispatch(fetchLeads());
    dispatch(fetchDeals());
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalDealsValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const closedDealsValue = deals.filter((d) => d.stage === 'Closed Won' || d.stage === 'Closed Lost').reduce((sum, d) => sum + (d.value || 0), 0);
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified').length;
  const conversionRate = leads.length > 0 ? Math.round((qualifiedLeads / leads.length) * 100) : 0;
  const avgDealSize = deals.length > 0 ? Math.round(totalDealsValue / deals.length) : 0;
  const winRate = deals.length > 0 ? Math.round((deals.filter((d) => d.stage === 'Closed Won').length / deals.length) * 100) : 0;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '24px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Reports & Analytics</h1>
            <p style={{ color: '#6b7280', fontSize: 'clamp(14px, 3vw, 16px)' }}>Comprehensive business insights and performance metrics</p>
          </div>

          {/* Key Metrics - Responsive Grid */}
          <div className="grid-responsive" style={{ marginBottom: '40px' }}>
            {/* Total Leads Card */}
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>Total Leads</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{leads.length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>All leads in system</div>
              </div>
              <Users size={56} color="rgba(255, 255, 255, 0.9)" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* Pipeline Value Card */}
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>Pipeline Value</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>${(totalDealsValue / 1000).toFixed(1)}K</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Total pipeline</div>
              </div>
              <DollarSign size={56} color="rgba(255, 255, 255, 0.9)" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* Revenue Won Card */}
            <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>Revenue Won</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>${(closedDealsValue / 1000).toFixed(1)}K</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Closed deals</div>
              </div>
              <TrendingUp size={56} color="rgba(255, 255, 255, 0.9)" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>

            {/* Active Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: 'clamp(16px, 4vw, 28px)', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>Active Tasks</div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{tasks.filter((t) => !t.completed).length}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Pending tasks</div>
              </div>
              <CheckCircle size={56} color="rgba(255, 255, 255, 0.9)" strokeWidth={1.5} style={{ minWidth: '40px', display: 'none' }} className="hide-mobile" />
            </div>
          </div>

          {/* Charts & Analytics - Responsive Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {/* Sales Pipeline */}
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: 'clamp(20px, 4vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 'bold', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={24} color="#2563eb" /> Sales Pipeline
              </h2>
              <div style={{ space: '1rem' }}>
                {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map((stage) => {
                  const stageDeals = deals.filter((d) => d.stage === stage);
                  const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
                  const percentage = totalDealsValue > 0 ? (stageValue / totalDealsValue) * 100 : 0;
                  return (
                    <div key={stage} style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: 'clamp(13px, 2vw, 14px)', fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>{stage}</span>
                        <span style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280' }}>
                          ${(stageValue / 1000).toFixed(1)}K ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                            height: '100%',
                            borderRadius: '9999px',
                            width: `${percentage}%`,
                            transition: 'width 0.3s'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lead Status Distribution */}
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: 'clamp(20px, 4vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 'bold', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={24} color="#10b981" /> Lead Status Distribution
              </h2>
              <div style={{ space: '1rem' }}>
                {['New', 'Contacted', 'Qualified', 'Lost'].map((status) => {
                  const statusLeads = leads.filter((l) => l.status === status);
                  const percentage = leads.length > 0 ? (statusLeads.length / leads.length) * 100 : 0;
                  const colorsBg = {
                    New: '#1e40af',
                    Contacted: '#15803d',
                    Qualified: '#6b21a8',
                    Lost: '#7f1d1d'
                  };
                  return (
                    <div key={status} style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>{status}</span>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                          {statusLeads.length} leads ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: 'linear-gradient(90deg, ' + colorsBg[status] + ' 0%, ' + colorsBg[status] + ' 100%)',
                            height: '100%',
                            borderRadius: '9999px',
                            width: `${percentage}%`,
                            transition: 'width 0.3s'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Metrics - 3 columns */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: 'clamp(20px, 4vw, 32px)' }}>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 'bold', color: '#111827', marginBottom: '28px' }}>Key Performance Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(20px, 4vw, 32px)' }}>
              {/* Conversion Rate */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Lead Conversion Rate</p>
                  <p style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{conversionRate}%</p>
                  <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#1e40af' }}>
                    {qualifiedLeads} of {leads.length} leads qualified
                  </p>
                </div>
              </div>

              {/* Average Deal Size */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Average Deal Size</p>
                  <p style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>${avgDealSize.toLocaleString()}</p>
                  <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#15803d' }}>
                    Across {deals.length} total deals
                  </p>
                </div>
              </div>

              {/* Win Rate */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '12px', borderLeft: '4px solid #f97316' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Deal Win Rate</p>
                  <p style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{winRate}%</p>
                  <p style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#92400e' }}>
                    {deals.filter((d) => d.stage === 'closed').length} deals won
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics - 2 sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
            {/* Task Completion */}
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: 'clamp(20px, 4vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Task Completion</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
                <div style={{ background: '#f0fdf4', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #dcfce7' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Total Tasks</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#166534' }}>{tasks.length}</p>
                </div>
                <div style={{ background: '#eff6ff', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #dbeafe' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Completed</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#1e3a8a' }}>{completedTasks}</p>
                </div>
                <div style={{ background: '#fef3c7', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #fed7aa' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Completion %</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#78350f' }}>
                    {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: 'clamp(20px, 4vw, 32px)' }}>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Revenue Summary</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
                <div style={{ background: '#eff6ff', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #dbeafe' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Pipeline</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#1e3a8a' }}>${(totalDealsValue / 1000).toFixed(0)}K</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #dcfce7' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Revenue Won</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#166534' }}>${(closedDealsValue / 1000).toFixed(0)}K</p>
                </div>
                <div style={{ background: '#fdf2f8', padding: 'clamp(16px, 3vw, 20px)', borderRadius: '12px', border: '1.5px solid #e9d5ff' }}>
                  <p style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Total Deals</p>
                  <p style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 'bold', color: '#581c87' }}>{deals.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
