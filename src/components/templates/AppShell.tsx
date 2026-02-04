import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { MissionBoard } from './MissionBoard';
import { ShowcasePanel } from './ShowcasePanel';
import { AdminPanel } from './AdminPanel';
import { RequestForm } from './RequestForm';
import { SettingsDrawer } from '../organisms/SettingsDrawer';
import { Ticker } from '../organisms/Ticker';
import type { Course, Mission, MissionRequest, Role, ShowcaseEntry } from '../../types';

type MissionFormState = Omit<Mission, 'id' | 'clears'>;

type Props = {
  role: Role;
  setRole: (r: Role) => void;
  theme: 'warm' | 'cool' | 'dark';
  setTheme: (t: 'warm' | 'cool' | 'dark') => void;
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
  handlePinChange: (e: React.FormEvent<HTMLFormElement>) => void;
  handleRequestSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearTickerItems: { id: string; missionTitle: string; course: Course; studentName: string; clearedAt: string }[];
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  requestAdminMode: () => void;
  resetData: () => void;
};

export const AppShell: React.FC<Props> = (props) => {
  const {
    role,
    setRole,
    theme,
    setTheme,
    courses,
    courseMissions,
    activeCourseIndex,
    setActiveCourseIndex,
    stats,
    randomMission,
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
    handlePinChange,
    handleRequestSubmit,
    clearTickerItems,
    settingsOpen,
    setSettingsOpen,
    requestAdminMode,
    resetData
  } = props;

  return (
    <div className="page">
      <Header role={role} onAvatarClick={() => setSettingsOpen(true)} onReset={resetData} />
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
        />
        <ShowcasePanel items={showcase} />
      </main>

      <RequestForm courses={courses} missionTypes={['機能系', '思考系', '体験系', '技術縛り系', '社会テーマ系', 'その他']} onSubmit={handleRequestSubmit} />
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
        handlePinChange={handlePinChange}
      />

      <Ticker items={clearTickerItems} />
      <SettingsDrawer
        isOpen={settingsOpen}
        close={() => setSettingsOpen(false)}
        role={role}
        setRole={setRole}
        requestAdminMode={requestAdminMode}
        theme={theme}
        setTheme={setTheme}
        resetData={resetData}
      />
    </div>
  );
};
