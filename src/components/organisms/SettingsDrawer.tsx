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
  boardInterval: number;
  setBoardInterval: (n: number) => void;
  tickerDuration: number;
  setTickerDuration: (n: number) => void;
};

export const SettingsDrawer: React.FC<Props> = ({
  isOpen,
  close,
  role,
  setRole,
  requestAdminMode,
  theme,
  setTheme,
  resetData,
  boardInterval,
  setBoardInterval,
  tickerDuration,
  setTickerDuration
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
        <p className="label">表示設定</p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="small">ボード切替間隔</span>
              <span className="small muted">{boardInterval}秒</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="5" 
              value={boardInterval} 
              onChange={(e) => setBoardInterval(Number(e.target.value))} 
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="small">Ticker速度（秒）</span>
              <span className="small muted">{tickerDuration}秒</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="120" 
              step="5" 
              value={tickerDuration} 
              onChange={(e) => setTickerDuration(Number(e.target.value))} 
              style={{ width: '100%' }}
            />
            <p className="muted small" style={{ marginTop: '4px' }}>※ 値が小さいほど速く流れます</p>
          </div>
        </div>
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
