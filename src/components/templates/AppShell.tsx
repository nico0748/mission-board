import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { MissionBoard } from './MissionBoard';
import { ShowcasePanel } from './ShowcasePanel';
import { AdminPanel } from './AdminPanel';
import { RequestForm } from './RequestForm';
import { Ticker } from '../organisms/Ticker';
import type { Course, Mission, MissionRequest, Role, ShowcaseEntry } from '../../types';

type MissionFormState = Omit<Mission, 'id' | 'clears'>;

type Props = {
  role: Role;
  courses: Course[];
  courseMissions: Mission[][];
  activeCourseIndex: number;
  setActiveCourseIndex: (n: number) => void;
  stats: { total: number; cleared: number; active: number };
  randomMission: Mission | null;
  showcase: ShowcaseEntry[];
  adminVisible: boolean;
  missionForm: MissionFormState;
  setMissionForm: (f: MissionFormState) => void;
  editingId: string | null;
  onSubmitMission: (e: React.FormEvent<HTMLFormElement>) => void;
  onResetMissionForm: () => void;
  onEditMission: (m: Mission) => void;
  onDeleteMission: (id: string) => void;
  onClearRegister: (missionId: string, name: string) => void;
  requests: MissionRequest[];
  approveRequest: (r: MissionRequest) => void;
  rejectRequest: (id: string) => void;
  handleRequestSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearTickerItems: { id: string; missionTitle: string; course: Course; studentNames: string[]; clearedAt: string }[];
  boardInterval: number;
  tickerDuration: number;
};

export const AppShell: React.FC<Props> = (props) => {
  const {
    role,
    courses,
    courseMissions,
    activeCourseIndex,
    setActiveCourseIndex,
    stats,
    showcase,
    adminVisible,
    missionForm,
    setMissionForm,
    editingId,
    onSubmitMission,
    onResetMissionForm,
    onEditMission,
    onDeleteMission,
    onClearRegister,
    requests,
    approveRequest,
    rejectRequest,
    handleRequestSubmit,
    clearTickerItems,
    boardInterval,
    tickerDuration,
  } = props;

  return (
    <div className="page">
      <Header role={role} />
      <Hero stats={stats} />
      <main className="layout layout-tight">
        <MissionBoard
          courses={courses}
          courseMissions={courseMissions}
          activeIndex={activeCourseIndex}
          setActiveIndex={setActiveCourseIndex}
          role={role}
          onEdit={onEditMission}
          onDelete={onDeleteMission}
          onClear={onClearRegister}
          interval={boardInterval}
        />
        <ShowcasePanel items={showcase} />
      </main>

      {import.meta.env.VITE_ENABLE_REQUEST_FORM === 'true' && (
        <RequestForm courses={courses} missionTypes={['機能系', '思考系', '体験系', '技術縛り系', '社会テーマ系', 'その他']} onSubmit={handleRequestSubmit} />
      )}
      <AdminPanel
        visible={adminVisible}
        courses={courses}
        missionTypes={['機能系', '思考系', '体験系', '技術縛り系', '社会テーマ系', 'その他']}
        missionForm={missionForm}
        editingId={editingId}
        onChangeForm={setMissionForm}
        onSubmitMission={onSubmitMission}
        onResetForm={onResetMissionForm}
        requests={requests}
        approveRequest={approveRequest}
        rejectRequest={rejectRequest}
      />

      <Ticker items={clearTickerItems} duration={tickerDuration} />
    </div>
  );
};
