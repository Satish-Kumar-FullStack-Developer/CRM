import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Menu, LogOut, User, BarChart3, X } from 'lucide-react';

/**
 * Navigation/Header Component with Perfect Styling
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Leads', href: '/leads' },
    { name: 'Deals', href: '/deals' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Reports', href: '/reports' },
  ];

  return (
    <nav style={{ background: 'linear-gradient(90deg, #1f2937 0%, #111827 50%, #1f2937 100%)', color: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <BarChart3 size={32} color="#60a5fa" strokeWidth={2} />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
              CRM Pro
            </h1>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div style={{ display: 'flex', gap: '32px', margin: 0, alignItems: 'center' }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '15px', fontWeight: '500', padding: '8px 12px', borderRadius: '6px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* User Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: '#d1d5db', marginRight: '12px' }}>
              {user?.firstName || 'User'} {user?.lastName || ''}
            </span>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ padding: '8px', borderRadius: '50%', border: '2px solid #4b5563', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.3)';
                  e.currentTarget.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#4b5563';
                }}
              >
                <User size={20} />
              </button>

              {isDropdownOpen && (
                <div style={{ position: 'absolute', right: 0, marginTop: '12px', width: '220px', background: '#1f2937', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', paddingTop: '8px', paddingBottom: '8px', zIndex: 10, border: '1px solid #374151' }}>
                  <a
                    href="/profile"
                    style={{ display: 'block', padding: '12px 16px', fontSize: '14px', color: '#d1d5db', textDecoration: 'none', transition: 'all 0.2s', borderBottom: '1px solid #374151', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                    }}
                  >
                    <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: '14px', color: '#d1d5db', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                    }}
                  >
                    <LogOut size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              style={{ display: 'none', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '6px' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{ display: 'block', paddingBottom: '16px', borderTop: '1px solid #374151' }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ display: 'block', padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s', borderRadius: '6px', margin: '4px 0' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#d1d5db';
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
