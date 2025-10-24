
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import teamLogo from '../assets/Evergreen_Logo__2110-150x150.png';

const navTabs = [
  { label: 'Home', route: '/' },
  { label: 'My learning', route: '/my-learning' },
  { label: 'Browse courses', route: '/browse-courses' },
  { label: 'Help', route: '/help' },
  { label: 'Support', route: '/support' },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = React.useState(() => {
    const stored = window.localStorage.getItem('displayMode');
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  });

  React.useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
    // Set body background and text color for light/dark mode
    if (mode === 'light') {
      document.body.style.background = '#fff';
      document.body.style.color = '#000';
    } else {
      document.body.style.background = '#181818';
      document.body.style.color = '#fff';
    }
    window.localStorage.setItem('displayMode', mode);
  }, [mode]);

  // Switch component for dark/light mode
  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
      <span style={{ fontSize: 12 }}>{checked ? '🌙' : '☀️'}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <span
        style={{
          width: 36,
          height: 20,
          background: checked ? '#333' : '#e0e0e0',
          borderRadius: 12,
          position: 'relative',
          transition: 'background 0.2s',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: checked ? 18 : 2,
            top: 2,
            width: 16,
            height: 16,
            background: checked ? '#fff' : '#333',
            borderRadius: '50%',
            transition: 'left 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        />
      </span>
    </label>
  );

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <img src={teamLogo} alt="Team Logo" className="nav-logo-img" />
      </div>
      <div className="nav-tabs">
        {navTabs.map((tab) => {
          const selected = location.pathname === tab.route;
          return (
            <button
              key={tab.label}
              className={`nav-tab-btn${selected ? ' selected' : ''}`}
              onClick={() => navigate(tab.route)}
              tabIndex={0}
            >
              {tab.label}
              {selected && <div className="nav-tab-underline" />}
            </button>
          );
        })}
      </div>
      <div className="nav-toggle">
        <Switch checked={mode === 'dark'} onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')} />
      </div>
    </nav>
  );
};
export default Navigation;