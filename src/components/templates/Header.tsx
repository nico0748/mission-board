import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import './Header.css';

export const Header: React.FC = React.memo(() => {
  const { role } = useSettings();
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="logo-dot" />
        <div>
          <p className="mini">Mission Based Idea Helper</p>
          <strong>Questarium</strong>
        </div>
      </Link>
      <nav className="top-actions">
        <Link
          to="/"
          className={`nav-link${pathname === '/' ? ' active' : ''}`}
        >
          ホーム
        </Link>
        <Link
          to="/about"
          className={`nav-link${pathname.startsWith('/about') ? ' active' : ''}`}
        >
          このアプリについて
        </Link>
        <Link to="/settings" className="avatar-btn" aria-label="設定">
          <span className="avatar">{role === 'admin' ? 'A' : 'G'}</span>
        </Link>
      </nav>
    </header>
  );
});
