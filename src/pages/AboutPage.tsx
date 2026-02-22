import { Link, NavLink, Outlet } from 'react-router-dom';
import './AboutPage.css';

const NAV_ITEMS = [
  { to: 'overview',    label: '概要' },
  { to: 'background',  label: '背景' },
  { to: 'architecture', label: '構成' },
  { to: 'tech-stack',  label: '技術スタック' },
  { to: 'future',      label: '追加予定の機能' },
];

export function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-brand">
          <span className="logo-dot" />
          <strong>ミッションボード</strong>
        </div>
        <Link to="/" className="about-back-link">
          ← ボードに戻る
        </Link>
      </header>

      <div className="about-body">
        <aside className="about-sidebar">
          <p className="sidebar-heading">ドキュメント</p>
          <nav>
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="about-main">
          <div className="about-content">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="about-footer">
        <p>Mission Based Idea Helper &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
