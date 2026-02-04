import React from 'react';
import { Button } from '../atoms/Button';
import { Pill } from '../atoms/Pill';
import type { Role } from '../../types';
import './organisms.css';

type ThemeKey = 'warm' | 'cool' | 'dark';

const themeOptions: { key: ThemeKey; label: string; desc: string }[] = [
  { key: 'warm', label: '暖色', desc: 'オレンジ＆コーラル' },
  { key: 'cool', label: '寒冷', desc: 'ブルー＆ミント' },
  { key: 'dark', label: 'ダーク', desc: 'コントラスト強め' }
];

type Props = {
  isOpen: boolean;
  close: () => void;
  role: Role;
  setRole: (r: Role) => void;
  requestAdminMode: () => void;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  resetData: () => void;
};

export const SettingsDrawer: React.FC<Props> = ({
  isOpen,
  close,
  role,
  setRole,
  requestAdminMode,
  theme,
  setTheme,
  resetData
}) => (
  <>
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-head">
        <div className="avatar lg">{role === 'admin' ? 'A' : 'G'}</div>
        <div>
          <p className="label">ユーザー</p>
          <h3>{role === 'admin' ? 'Admin' : 'General'}</h3>
          <p className="muted small">表示ロールを切り替えて管理機能を操作できます。</p>
        </div>
        <Button variant="ghost" size="sm" onClick={close}>✕</Button>
      </div>

      <div className="drawer-section">
        <p className="label">ロール切替</p>
        <div className="pill-row">
          <Pill active={role === 'general'} as="button" onClick={() => setRole('general')}>
            General
          </Pill>
          <Pill active={role === 'admin'} as="button" onClick={requestAdminMode}>
            Admin
          </Pill>
          {role === 'admin' && (
            <Button variant="ghost" size="sm" onClick={() => setRole('general')}>
              ログアウト
            </Button>
          )}
        </div>
      </div>

      <div className="drawer-section">
        <p className="label">テーマ</p>
        <div className="pill-row">
          {themeOptions.map((opt) => (
            <Pill
              key={opt.key}
              active={theme === opt.key}
              as="button"
              onClick={() => setTheme(opt.key)}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
        <p className="muted small">暖色系がデフォルトです。</p>
      </div>

      <div className="drawer-section">
        <p className="label">クイック操作</p>
        <Button variant="ghost" onClick={resetData}>データ初期化</Button>
      </div>
    </div>
    <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={close} />
  </>
);
const avatarIcon = {
  general: '🧒',
  admin: '🧑‍💼'
} as const;
