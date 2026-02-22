import { useRef, useState } from 'react';
import { MissionCard } from '../organisms/MissionCard';
import { Tag } from '../atoms/Tag';
import { MaximizeIcon } from '../icons/MaximizeIcon';
import { MinimizeIcon } from '../icons/MinimizeIcon';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useInterval } from '../../hooks/useInterval';
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
  interval: number;
};

export const MissionBoard: React.FC<Props> = ({
  courses,
  courseMissions,
  activeIndex,
  setActiveIndex,
  role,
  onEdit,
  onDelete,
  onClear,
  interval
}) => {
  const boardRef = useRef<HTMLElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(boardRef);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate based on interval prop (seconds -> ms) unless paused
  useInterval(() => {
    setActiveIndex((activeIndex + 1) % courses.length);
  }, isPaused ? null : interval * 1000);

  return (
    <section 
      className="panel board" 
      id="board" 
      ref={boardRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Row 1: Title Area */}
      <div className="board-header-top">
        <p className="label">ミッションボード</p>
        <h2>{courses[activeIndex]}</h2>
      </div>

      {/* Row 2: Controls Area (Sticky) */}
      <div className="board-header-controls">
        <div className="pill-row course-tabs" style={{ flex: 1, justifyContent: 'center' }}>
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
        <button
          className="icon-button"
          onClick={toggleFullscreen}
          title={isFullscreen ? '全画面終了' : '全画面表示'}
          aria-label={isFullscreen ? '全画面終了' : '全画面表示'}
        >
          {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
        </button>
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
