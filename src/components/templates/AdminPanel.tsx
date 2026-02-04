import React from 'react';
import { Button } from '../atoms/Button';
import type { Course, Difficulty, Mission, MissionRequest, MissionType } from '../../types';

type MissionFormState = Omit<Mission, 'id' | 'clears'>;

type Props = {
  visible: boolean;
  courses: Course[];
  missionTypes: MissionType[];
  missionForm: MissionFormState;
  editingId: string | null;
  onChangeForm: (f: MissionFormState) => void;
  onSubmitMission: (e: React.FormEvent<HTMLFormElement>) => void;
  onResetForm: () => void;
  requests: MissionRequest[];
  approveRequest: (r: MissionRequest) => void;
  rejectRequest: (id: string) => void;
  handlePinChange: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const AdminPanel: React.FC<Props> = ({
  visible,
  courses,
  missionTypes,
  missionForm,
  editingId,
  onChangeForm,
  onSubmitMission,
  onResetForm,
  requests,
  approveRequest,
  rejectRequest,
  handlePinChange
}) => {
  if (!visible) return null;
  return (
    <section className="panel admin" id="admin">
      <h2>管理パネル</h2>
      <div className="card">
        <div className="card-head">
          <h3>{editingId ? 'ミッション編集' : 'ミッション追加'}</h3>
          {editingId && (
            <Button variant="ghost" onClick={onResetForm}>
              新規作成に切替
            </Button>
          )}
        </div>
        <form className="form" onSubmit={onSubmitMission}>
          <label>
            タイトル
            <input
              required
              value={missionForm.title}
              onChange={(e) => onChangeForm({ ...missionForm, title: e.target.value })}
            />
          </label>
          <label>
            説明
            <textarea
              rows={3}
              required
              value={missionForm.description}
              onChange={(e) => onChangeForm({ ...missionForm, description: e.target.value })}
            />
          </label>
          <div className="form-row">
            <label>
              コース
              <select
                value={missionForm.course}
                onChange={(e) =>
                  onChangeForm({ ...missionForm, course: e.target.value as Course })
                }
              >
                {courses.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              参加人数
              <input
                type="number"
                min={0}
                value={missionForm.participants}
                onChange={(e) =>
                  onChangeForm({
                    ...missionForm,
                    participants: Number(e.target.value)
                  })
                }
              />
            </label>
            <label>
              難易度
              <select
                value={missionForm.difficulty}
                onChange={(e) =>
                  onChangeForm({
                    ...missionForm,
                    difficulty: Number(e.target.value) as Difficulty
                  })
                }
              >
                <option value={1}>★</option>
                <option value={2}>★★</option>
                <option value={3}>★★★</option>
              </select>
            </label>
            <label>
              タイプ
              <select
                value={missionForm.missionType}
                onChange={(e) =>
                  onChangeForm({
                    ...missionForm,
                    missionType: e.target.value as MissionType
                  })
                }
              >
                {missionTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              作成者
              <select
                value={missionForm.createdBy}
                onChange={(e) =>
                  onChangeForm({
                    ...missionForm,
                    createdBy: e.target.value as Mission['createdBy']
                  })
                }
              >
                <option value="teacher">教師</option>
                <option value="student">生徒</option>
              </select>
            </label>
            <label>
              公開状態
              <select
                value={missionForm.status}
                onChange={(e) =>
                  onChangeForm({
                    ...missionForm,
                    status: e.target.value as Mission['status']
                  })
                }
              >
                <option value="active">有効</option>
                <option value="inactive">無効</option>
              </select>
            </label>
          </div>
          <Button type="submit">
            {editingId ? '更新する' : '追加する'}
          </Button>
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>依頼レビュー</h3>
          <p className="muted">生徒からの依頼をミッション化できます。</p>
        </div>
        <div className="request-list">
          {requests.map((req) => (
            <div key={req.id} className="request-item">
              <div>
                <p className="label">{req.requesterName}</p>
                <p className="title">{req.title}</p>
                <p className="muted small">{req.detail}</p>
                <div className="tags">
                  {req.course && <span className="tag">{req.course}</span>}
                  {req.missionType && <span className="tag">{req.missionType}</span>}
                  <span className={req.status === 'pending' ? 'tag warning' : 'tag'}>
                    {req.status}
                  </span>
                  <span className="tag soft">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {req.status === 'pending' && (
                <div className="admin-buttons">
                  <Button size="sm" onClick={() => approveRequest(req)}>
                    承認してミッション化
                  </Button>
                  <Button variant="ghost-danger" onClick={() => rejectRequest(req.id)}>
                    却下
                  </Button>
                </div>
              )}
              {req.status !== 'pending' && req.approvedAsMissionId && (
                <p className="muted small">承認済み: ミッションID {req.approvedAsMissionId}</p>
              )}
            </div>
          ))}
          {!requests.length && <p className="muted">依頼はまだありません。</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Admin PIN 設定</h3>
          <p className="muted">adminモード切替時に必要なPINを変更します。</p>
        </div>
        <form className="form" onSubmit={handlePinChange}>
          <label>
            現在のPIN
            <input name="currentPin" type="password" required />
          </label>
          <label>
            新しいPIN（4桁以上）
            <input name="nextPin" type="password" required minLength={4} />
          </label>
          <Button type="submit">更新する</Button>
        </form>
      </div>
    </section>
  );
};
