import React from 'react';
import { Tag } from '../atoms/Tag';
import type { ShowcaseEntry } from '../../types';
import './organisms.css';

export const ShowcaseGrid: React.FC<{ items: ShowcaseEntry[] }> = ({ items }) => (
  <section className="panel showcase">
    <div className="panel-header">
      <div>
        <p className="label">作品しょうかい</p>
        <h2>Showcase</h2>
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
