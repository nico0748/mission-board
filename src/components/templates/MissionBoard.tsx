import React from 'react';
import { MissionCard } from '../organisms/MissionCard';
import { Tag } from '../atoms/Tag';
import type { Course, Mission, Role } from '../../types';

type Props = {
  courses: Course[];
  courseMissions: Mission[][];
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  role: Role;
  onEdit: (m: Mission) => void;
  onDelete: (id: string) => void;
  onClear: (missionId: string, name: string) => void;
};

export const MissionBoard: React.FC<Props> = ({
  courses,
  courseMissions,
  activeIndex,
  setActiveIndex,
  role,
  onEdit,
  onDelete,
  onClear
}) => {
  return (
    <section className="panel board" id="board">
      <div className="panel-header sticky">
        <div>
          <p className="label">ミッションボード</p>
          <h2>{courses[activeIndex]}</h2>
        </div>
        <div className="pill-row course-tabs">
          {courses.map((c, idx) => (
            <button
              key={c}
              className={idx === activeIndex ? 'pill active' : 'pill'}
              onClick={() => setActiveIndex(idx)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="board-simple board-scroll">
        <div className="board-head">
          <div className="course-chip">
            <span>{courses[activeIndex]}</span>
          </div>
          <Tag tone="soft">{(courseMissions[activeIndex] || []).length} 件</Tag>
        </div>
        <div className="mission-grid">
          {(courseMissions[activeIndex] || []).map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              isAdmin={role === 'admin'}
              onEdit={onEdit}
              onDelete={onDelete}
              onClear={(name) => onClear(m.id, name)}
            />
          ))}
          {!(courseMissions[activeIndex] || []).length && (
            <div className="empty">
              <p>このコースに該当するミッションがありません。</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
