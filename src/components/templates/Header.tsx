import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';

type Props = {
  role: 'admin' | 'general';
  onAvatarClick: () => void;
  onReset: () => void;
};

export const Header: React.FC<Props> = React.memo(({ role, onAvatarClick, onReset }) => (
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
      <Button variant="ghost" size="sm" onClick={onReset}>
        データ初期化
      </Button>
      <button className="ghost small avatar-btn" onClick={onAvatarClick} aria-label="ユーザー設定">
        <span className="avatar">{role === 'admin' ? 'A' : 'G'}</span>
      </button>
    </div>
  </header>
));
