export type Course =
  | 'Scratch'
  | 'Unity'
  | 'LEGO SPIKE Basic'
  | 'LEGO SPIKE Prime'
  | '3Dペン'
  | 'Blender + 3D造形';

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type MissionType =
  | '機能系'
  | '思考系'
  | '体験系'
  | '技術縛り系'
  | '社会テーマ系'
  | 'その他';

export type Role = 'admin' | 'general';

export interface ClearEntry {
  id: string;
  studentName: string;
  clearedAt: string; // ISO string
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  course: Course;
  difficulty: Difficulty;
  missionType: MissionType;
  createdBy: 'teacher' | 'student';
  status: 'active' | 'inactive';
  participants: number;
  clears: ClearEntry[];
}

export interface MissionRequest {
  id: string;
  requesterName: string;
  title: string;
  detail: string;
  course?: Course;
  missionType?: MissionType;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAsMissionId?: string;
}

export interface ShowcaseEntry {
  id: string;
  workName: string;
  creator: string;
  course: Course;
  comment: string;
  award?: 'アイデア賞' | '技術賞' | 'デザイン賞' | 'チャレンジ賞';
}
