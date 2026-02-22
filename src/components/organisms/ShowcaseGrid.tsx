import React, { useRef } from 'react';
import { Tag } from '../atoms/Tag';
import { MaximizeIcon } from '../icons/MaximizeIcon';
import { MinimizeIcon } from '../icons/MinimizeIcon';
import { useFullscreen } from '../../hooks/useFullscreen';
import type { ShowcaseEntry } from '../../types';
import './organisms.css';

export const ShowcaseGrid: React.FC<{ items: ShowcaseEntry[] }> = ({ items }) => {
  const showcaseRef = useRef<HTMLElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(showcaseRef);

  return (
    <section className="panel showcase" ref={showcaseRef}>
      <div className="panel-header">
        <div>
          <p className="label">作品しょうかい</p>
          <h2>Showcase</h2>
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={toggleFullscreen}
            title={isFullscreen ? '全画面終了' : '全画面表示'}
            aria-label={isFullscreen ? '全画面終了' : '全画面表示'}
          >
            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </button>
        </div>
      </div>
      <div className="showcase-grid">
        {items.map((s) => (
          <div key={s.id} className="showcase-card">
            <p className="label">{s.award ?? '紹介'}</p>
            <h4>{s.workName}</h4>
            <p className="muted">{s.comment}</p>
            <div className="tags">
              <Tag>{s.creator}</Tag>
              <Tag>{s.course}</Tag>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
