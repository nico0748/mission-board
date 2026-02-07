import React from 'react';

type Props = {
  stats: { total: number; cleared: number; active: number };
};

export const Hero: React.FC<Props> = React.memo(({ stats }) => (
  <section className="hero single">
    <div>
      <p className="eyebrow">授業前5分でアイデア確定</p>
      <h1>今日のミッションを決めよう</h1>
      <div className="stats">
        <div>
          <p className="label">ミッション数</p>
          <p className="value">{stats.total}</p>
        </div>
        <div>
          <p className="label">クリア登録</p>
          <p className="value">{stats.cleared}</p>
        </div>
        <div>
          <p className="label">公開中</p>
          <p className="value">{stats.active}</p>
        </div>
      </div>
    </div>
  </section>
));
