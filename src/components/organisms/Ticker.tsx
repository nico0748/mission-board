import React from 'react';
import { Pill } from '../atoms/Pill';
import type { Course } from '../../types';
import './organisms.css';

type Item = { id: string; missionTitle: string; course: Course; studentName: string; clearedAt: string };

export const Ticker: React.FC<{ items: Item[] }> = ({ items }) => {
  if (!items.length) {
    return (
      <footer className="ticker">
        <p className="muted">まだクリア登録がありません。</p>
      </footer>
    );
  }
  const loop = [...items, ...items];
  return (
    <footer className="ticker">
      <div className="ticker-track">
        {loop.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="ticker-item">
            <Pill soft>{item.missionTitle}</Pill>
            <Pill>{item.studentName}</Pill>
            <span className="muted small">{new Date(item.clearedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};
