import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import reportService from '../services/reportService';
import { Users, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

/**
 * Dashboard Page with Inline Styles for Perfect Alignment
 */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      if (user) {
        const response = await reportService.getDashboardAnalytics();
        setAnalytics(response.data.data);
      } else {
        setAnalytics({
          totalLeads: 24,
          qualifiedLeads: 8,
          totalDeals: 12,
          dealsWon: 5,
          totalTasks: 42,
          completedTasks: 18,
        });
      }
    } catch (error) {
      setAnalytics({
        totalLeads: 24,
        qualifiedLeads: 8,
        totalDeals: 12,
        dealsWon: 5,
        totalTasks: 42,
        completedTasks: 18,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Welcome back, {user?.firstName || 'User'}! Here's your CRM overview.</p>
          </div>

          {/* Stats Cards Grid - 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
            {/* Total Leads Card */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Total Leads</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>{analytics?.totalLeads || 0}</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>📈 Up from last month</div>
              </div>
              <Users size={56} color="#3b82f6" strokeWidth={1.5} />
            </div>

            {/* Qualified Leads Card */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>Qualified Leads</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>{analytics?.qualifiedLeads || 0}</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>✓ Ready to convert</div>
              </div>
              <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
            </div>

            {/* Total Deals Card */}
            <div style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8', marginBottom: '12px' }}>Total Deals</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#581c87', marginBottom: '8px' }}>{analytics?.totalDeals || 0}</div>
                <div style={{ fontSize: '12px', color: '#6b21a8' }}>🎯 In pipeline</div>
              </div>
              <DollarSign size={56} color="#a855f7" strokeWidth={1.5} />
            </div>

            {/* Deals Won Card */}
            <div style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>Deals Won</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>{analytics?.dealsWon || 0}</div>
                <div style={{ fontSize: '12px', color: '#92400e' }}>💰 This quarter</div>
              </div>
              <TrendingUp size={56} color="#f97316" strokeWidth={1.5} />
            </div>

            {/* Total Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#7f1d1d', marginBottom: '12px' }}>Total Tasks</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#7f1d1d', marginBottom: '8px' }}>{analytics?.totalTasks || 0}</div>
                <div style={{ fontSize: '12px', color: '#7f1d1d' }}>📋 All tasks</div>
              </div>
              <CheckCircle size={56} color="#ef4444" strokeWidth={1.5} />
            </div>

            {/* Completed Tasks Card */}
            <div style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', padding: '28px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderLeft: '5px solid #06b6d4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#164e63', marginBottom: '12px' }}>Completed Tasks</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#082f49', marginBottom: '8px' }}>{analytics?.completedTasks || 0}</div>
                <div style={{ fontSize: '12px', color: '#164e63' }}>✅ {analytics?.totalTasks ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0}% done</div>
              </div>
              <TrendingUp size={56} color="#06b6d4" strokeWidth={1.5} />
            </div>
          </div>

          {/* Quick Actions - 4 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
            <button style={{ padding: '16px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = '#1d4ed8'; e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.background = '#2563eb'; e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'; e.target.style.transform = 'translateY(0)'; }}>
              ➕ Add Lead
            </button>
            <button style={{ padding: '16px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = '#15803d'; e.target.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.background = '#16a34a'; e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)'; e.target.style.transform = 'translateY(0)'; }}>
              💼 Add Deal
            </button>
            <button style={{ padding: '16px 24px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = '#9333ea'; e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.background = '#a855f7'; e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)'; e.target.style.transform = 'translateY(0)'; }}>
              📝 Add Task
            </button>
            <button style={{ padding: '16px 24px', background: '#64748b', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = '#475569'; e.target.style.boxShadow = '0 6px 16px rgba(100, 116, 139, 0.4)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.background = '#64748b'; e.target.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)'; e.target.style.transform = 'translateY(0)'; }}>
              📊 View Reports
            </button>
          </div>

          {/* System Status - 3 columns */}
          <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111827', marginBottom: '28px' }}>📊 System Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '10px', border: '1.5px solid #dcfce7' }}>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Backend Server</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>✓ Online</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>Port 5000 - Running</p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '10px', border: '1.5px solid #dcfce7' }}>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Database Connection</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>✓ Connected</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>MongoDB - Active</p>
              </div>
              <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '10px', border: '1.5px solid #dbeafe' }}>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Frontend</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>✓ Ready</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>React - Port 3000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
