import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  role: 'admin' | 'general';
};

export const Header: React.FC<Props> = React.memo(({ role }) => (
  <header className="topbar">
    <div className="brand">
      <span className="logo-dot" />
      <div>
        <p className="mini">Mission Based Idea Helper</p>
        <strong>ミッションボード</strong>
      </div>
    </div>
    <div className="top-actions">
      <Link to="/about" className="about-link">このアプリについて</Link>
      <Link to="/settings" className="avatar-btn ghost small" aria-label="設定">
        <span className="avatar">{role === 'admin' ? 'A' : 'G'}</span>
      </Link>
    </div>
  </header>
));
