import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pill } from '../atoms/Pill';
import type { Course } from '../../types';
import './organisms.css';

type Item = { id: string; missionTitle: string; course: Course; studentName: string; clearedAt: string };

export const Ticker: React.FC<{ items: Item[] }> = React.memo(({ items }) => {
  const [fullscreenElement, setFullscreenElement] = useState<Element | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreenElement(document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const content = (
    <footer className="ticker">
      {items.length === 0 ? (
        <p className="muted">まだクリア登録がありません。</p>
      ) : (
        <div className="ticker-track">
          {[...items, ...items].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="ticker-item">
              <Pill soft>{item.missionTitle}</Pill>
              <Pill>{item.studentName}</Pill>
              <span className="muted small">{new Date(item.clearedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </footer>
  );

  if (fullscreenElement) {
    return createPortal(content, fullscreenElement);
  }

  return content;
});
