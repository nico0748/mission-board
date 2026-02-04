import React from 'react';
import { Button } from '../atoms/Button';
import type { Course, MissionType } from '../../types';

type Props = {
  courses: Course[];
  missionTypes: MissionType[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const RequestForm: React.FC<Props> = ({ courses, missionTypes, onSubmit }) => (
  <div className="panel admin card" id="request-form">
    <div className="card-head">
      <h3>ミッション依頼フォーム</h3>
      <p className="muted">generalユーザーが新しいミッションを提案できます。</p>
    </div>
    <form className="form" onSubmit={onSubmit}>
      <label>
        お名前（ニックネーム可）
        <input name="requesterName" placeholder="たろう / 〇〇チーム" />
      </label>
      <label>
        依頼タイトル
        <input name="title" required placeholder="こんなゲームを作りたい！" />
      </label>
      <label>
        詳細
        <textarea name="detail" rows={3} placeholder="使いたい道具やルールを書いてね" />
      </label>
      <div className="form-row">
        <label>
          コース
          <select name="course" defaultValue="">
            <option value="">未指定</option>
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          タイプ
          <select name="missionType" defaultValue="">
            <option value="">未指定</option>
            {missionTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <Button type="submit">送信</Button>
    </form>
  </div>
);
