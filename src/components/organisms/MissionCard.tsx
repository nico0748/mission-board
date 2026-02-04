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
        <Tag>{mission.difficulty}</Tag>
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
