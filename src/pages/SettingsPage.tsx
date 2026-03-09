import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import type { ThemeKey } from '../contexts/SettingsContext';
import { Pill } from '../components/atoms/Pill';
import './SettingsPage.css';

const themeOptions: { key: ThemeKey; label: string; desc: string; swatch: string }[] = [
  { key: 'warm',  label: '暖色',  desc: 'オレンジ & コーラル', swatch: '#ffb869' },
  { key: 'cool',  label: '寒冷',  desc: 'ブルー & ミント',     swatch: '#60c8f5' },
  { key: 'dark',  label: 'ダーク', desc: 'コントラスト強め',    swatch: '#444' },
];

export function SettingsPage() {
  const {
    role, setRole, requestAdminMode,
    adminPin, setAdminPin,
    theme, setTheme,
    boardInterval, setBoardInterval,
    tickerDuration, setTickerDuration,
    resetData,
  } = useSettings();

  function handlePinChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const current = (form.get('currentPin') as string) || '';
    const next = (form.get('nextPin') as string) || '';
    if (current !== adminPin) {
      alert('現在のPINが一致しません');
      return;
    }
    if (next.trim().length < 4) {
      alert('PINは4桁以上にしてください');
      return;
    }
    setAdminPin(next.trim());
    alert('PINを更新しました');
    e.currentTarget.reset();
  }

  function handleResetData() {
    if (!confirm('すべてのデータを初期状態に戻しますか？')) return;
    resetData();
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div className="settings-brand">
          <span className="logo-dot" />
          <strong>ミッションボード</strong>
        </div>
        <Link to="/" className="settings-back-link">← ボードに戻る</Link>
      </header>

      <main className="settings-main">
        <div className="settings-content">

          {/* ── ユーザー / ロール ── */}
          <section className="settings-section">
            <p className="settings-section-title">ユーザー</p>
            <div className="settings-role-info">
              <div className="settings-avatar">{role === 'admin' ? 'A' : 'G'}</div>
              <div>
                <p className="settings-role-label">{role === 'admin' ? 'Admin' : 'General'}</p>
                <p className="settings-role-desc">表示ロールを切り替えて管理機能を操作できます。</p>
              </div>
            </div>
            <div className="pill-row">
              <Pill active={role === 'general'} as="button" onClick={() => setRole('general')}>
                General
              </Pill>
              <Pill active={role === 'admin'} as="button" onClick={requestAdminMode}>
                Admin
              </Pill>
              {role === 'admin' && (
                <Pill as="button" active={false} onClick={() => setRole('general')}>
                  ログアウト
                </Pill>
              )}
            </div>
          </section>

          {/* ── テーマ ── */}
          <section className="settings-section">
            <p className="settings-section-title">テーマ</p>
            <div className="settings-theme-grid">
              {themeOptions.map((opt) => (
                <button
                  key={opt.key}
                  className={`settings-theme-btn${theme === opt.key ? ' active' : ''}`}
                  onClick={() => setTheme(opt.key)}
                >
                  <span
                    style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: opt.swatch, display: 'block',
                      border: '2px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <span className="theme-name">{opt.label}</span>
                  <span className="theme-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── 表示設定 ── */}
          <section className="settings-section">
            <p className="settings-section-title">表示設定</p>

            <div className="settings-slider-row">
              <div className="settings-slider-label">
                <span>ボード切替間隔</span>
                <span>{boardInterval}秒</span>
              </div>
              <input
                type="range" min="5" max="60" step="5"
                value={boardInterval}
                onChange={(e) => setBoardInterval(Number(e.target.value))}
              />
            </div>

            <div className="settings-slider-row">
              <div className="settings-slider-label">
                <span>Ticker速度</span>
                <span>{tickerDuration}秒</span>
              </div>
              <input
                type="range" min="10" max="120" step="5"
                value={tickerDuration}
                onChange={(e) => setTickerDuration(Number(e.target.value))}
              />
              <p className="settings-hint">値が小さいほど速く流れます</p>
            </div>
          </section>

          {/* ── PIN変更（Admin のみ） ── */}
          {role === 'admin' && (
            <section className="settings-section">
              <p className="settings-section-title">Admin PIN 変更</p>
              <form className="settings-pin-form" onSubmit={handlePinChange}>
                <label>
                  現在のPIN
                  <input type="password" name="currentPin" autoComplete="current-password" />
                </label>
                <label>
                  新しいPIN（4桁以上）
                  <input type="password" name="nextPin" autoComplete="new-password" />
                </label>
                <button type="submit" className="settings-btn-danger" style={{ color: 'var(--accent-2)', borderColor: 'var(--accent-2)' }}>
                  PINを更新
                </button>
              </form>
            </section>
          )}

          {/* ── 危険な操作 ── */}
          <section className="settings-section danger">
            <p className="settings-section-title">危険な操作</p>
            <p className="settings-danger-desc">
              すべてのミッション・依頼・作品紹介データを初期状態に戻します。この操作は取り消せません。
            </p>
            <button className="settings-btn-danger" onClick={handleResetData}>
              データ初期化
            </button>
          </section>

        </div>
      </main>

      <footer className="settings-footer">
        <p>Mission Based Idea Helper &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
