import React from 'react';
import { Button } from '../atoms/Button';
import { Pill } from '../atoms/Pill';
import { Tag } from '../atoms/Tag';
import type { Mission } from '../../types';
import './organisms.css';

type Props = {
  mission: Mission;
  isAdmin: boolean;
  onEdit: (m: Mission) => void;
  onDelete: (id: string) => void;
  onClear: (name: string) => void;
};

export const MissionCard: React.FC<Props> = ({ mission, isAdmin, onEdit, onDelete, onClear }) => (
  <article className="mission-card">
    <div className="mission-head">
      <div>
        <p className="label">{mission.createdBy === 'teacher' ? '教師ミッション' : '生徒ミッション'}</p>
        <h3>{mission.title}</h3>
        <p className="muted">{mission.description}</p>
      </div>
      <div className="tags">
        <Tag>{mission.course}</Tag>
        <Tag style={getDifficultyStyle(mission.difficulty)}>Level.{mission.difficulty}</Tag>
        <Tag>{mission.missionType}</Tag>
        <Tag tone={mission.status === 'active' ? 'success' : 'warning'}>
          {mission.status === 'active' ? '有効' : '無効'}
        </Tag>
      </div>
    </div>

    <div className="mission-foot">
      <div>
        <p className="label">クリア者</p>
        {mission.clears.length ? (
          <div className="clears">
            {mission.clears.slice(0, 3).map((c) => (
              <Pill key={c.id} soft>
                {c.studentName} / {new Date(c.clearedAt).toLocaleDateString()}
              </Pill>
            ))}
            {mission.clears.length > 3 && <Pill soft>+{mission.clears.length - 3} more</Pill>}
          </div>
        ) : (
          <p className="muted">まだ登録なし</p>
        )}
      </div>

      {isAdmin && (
        <div className="admin-actions">
          <ClearForm onSubmit={onClear} />
          <div className="admin-buttons">
            <Button variant="ghost" onClick={() => onEdit(mission)}>
              編集
            </Button>
            <Button variant="ghost-danger" onClick={() => onDelete(mission.id)}>
              削除
            </Button>
          </div>
        </div>
      )}
    </div>

    <div className="counts-row">
      <Tag tone="soft">参加 {mission.participants ?? 0} 人</Tag>
      <Tag tone="success">クリア {mission.clears.length} 人</Tag>
    </div>
  </article>
);

function ClearForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = React.useState('');
  return (
    <form
      className="clear-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name);
        setName('');
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="クリア者名"
      />
      <Button type="submit" size="sm">
        登録
      </Button>
    </form>
  );
}

function getDifficultyStyle(level: number): React.CSSProperties {
  // Low (1-2) -> Green/Teal
  // Mid (3-5) -> Yellow/Orange
  // High (6-7) -> Red/Pink
  // We can use HSL to create a smooth transition.
  // 1 -> 120 (Green)
  // 7 -> 0 (Red)
  // But let's tweak it to match "Light Green -> Yellow -> Red" requested.
  
  // Mapping approach:
  // 1: #dcfce7 (Light Green)
  // 2: #bbf7d0
  // 3: #fef08a (Yellow)
  // 4: #fde047
  // 5: #fdba74 (Orange)
  // 6: #f87171 (Red)
  // 7: #dc2626 (Deep Red)

  // Improved mapping with specific colors for better control + constrast
  const colors = [
    '#d1fae5', // 1: Emerald 100
    '#a7f3d0', // 2: Emerald 200
    '#fef08a', // 3: Yellow 200
    '#fde047', // 4: Yellow 300
    '#fdba74', // 5: Orange 300
    '#fbbf24', // 6: Amber 400 (Adjusted to avoid text contrast issues if text is white) -- wait, text is usually dark.
    // Let's use background colors that work with dark text (which seems to be the default).
    // If user wants "High level = Red", usually that means white text on red bg, or light red bg with red text.
    // The Tag component uses `var(--text)` usually.
  ];
  
  // Let's use specific HSL values for a gradient effect background
  // Level 1: 140deg (Green)
  // Level 4: 50deg (Yellow)
  // Level 7: 0deg (Red)
  const maxLevel = 7;
  const hue = 140 - ((level - 1) * (140 / (maxLevel - 1))); 
  
  return {
    backgroundColor: `hsl(${hue}, 80%, 90%)`, // Light background
    color: `hsl(${hue}, 80%, 25%)`, // Darker text of same hue
    borderColor: `hsl(${hue}, 60%, 80%)`
  };
}
