import { useEffect, useMemo, useState, useCallback } from 'react';
import { seedMissions, seedRequests, seedShowcase } from './data/seed';
import { usePersistentState } from './hooks/usePersistentState';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { useSettings } from './contexts/SettingsContext';
import { AppShell } from './components/templates/AppShell';
import type {
  ClearEntry,
  Course,
  Mission,
  MissionRequest,
  MissionType,
  ShowcaseEntry,
} from './types';
import './styles/theme.css';
import './styles/app.css';
import './index.css';

const DATA_VERSION = 'seed-20250204-v2';

const courses: Course[] = [
  'Scratch',
  'Unity',
  'LEGO SPIKE Basic',
  'LEGO SPIKE Prime',
  '3Dペン',
  'Blender + 3D造形'
];

type MissionFormState = Omit<Mission, 'id' | 'clears'>;

/**
 * Create a blank mission form state populated with sensible defaults.
 *
 * @returns A `MissionFormState` initialized with empty `title` and `description`, `course` set to `"Scratch"`, `difficulty` 1, `missionType` `"機能系"`, `createdBy` `"teacher"`, `status` `"active"`, and `participants` 5.
 */
function createEmptyMissionForm(): MissionFormState {
  return {
    title: '',
    description: '',
    course: 'Scratch',
    difficulty: 1,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 5
  };
}

/**
 * Root application component that manages mission data, requests, showcase, and settings integration, and renders the main AppShell.
 *
 * Manages persistent application state, synchronizes missions with Google Sheets when available, applies data versioning and migration, and provides handlers for creating, editing, deleting, and clearing missions as well as submitting, approving, and rejecting requests.
 *
 * @returns The AppShell element populated with application state, derived data, and event handlers.
 */
function App() {
  const { role, boardInterval, tickerDuration, registerResetData } = useSettings();
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  const [missions, setMissions] = usePersistentState<Mission[]>('missions', () => seedMissions);

  const { data: sheetMissions } = useGoogleSheets();

  // Sync Sheet data to filtered missions when loaded
  useEffect(() => {
    if (sheetMissions) {
      console.log('Loaded missions from Sheet:', sheetMissions.length);

      setMissions((prevMissions: Mission[]) => {
        return sheetMissions.map((sheetMsg: Mission) => {
          const localMatch = prevMissions.find((m: Mission) => m.id === sheetMsg.id);
          return {
            ...sheetMsg,
            clears: (sheetMsg.clears && sheetMsg.clears.length > 0) ? sheetMsg.clears : (localMatch ? localMatch.clears : []),
            participants: sheetMsg.participants || localMatch?.participants || 0
          };
        });
      });
    }
  }, [sheetMissions, setMissions]);

  const [requests, setRequests] =
    usePersistentState<MissionRequest[]>('missionRequests', () => seedRequests);
  const [showcase, setShowcase] =
    usePersistentState<ShowcaseEntry[]>('showcaseEntries', () => seedShowcase);

  const [missionForm, setMissionForm] = useState<MissionFormState>(createEmptyMissionForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  // data versioning: if version mismatch, reseed local data (Only if NO sheet data loaded yet?)
  useEffect(() => {
    if (!sheetMissions) {
      const storedVersion = localStorage.getItem('mission-board:dataVersion');
      if (storedVersion !== DATA_VERSION) {
        setMissions(seedMissions);
        setRequests(seedRequests);
        setShowcase(seedShowcase);
        localStorage.setItem('mission-board:dataVersion', DATA_VERSION);
      }
    }
  }, [setMissions, setRequests, setShowcase, sheetMissions]);

  // migrate old data without participants
  useEffect(() => {
    const missing = missions.some((m) => m.participants === undefined);
    if (missing) {
      setMissions((ms: Mission[]) =>
        ms.map((m) =>
          m.participants === undefined ? { ...m, participants: Math.max(3, (m.clears?.length || 0) + 2) } : m
        )
      );
    }
  }, [missions, setMissions]);

  const resetDataImpl = useCallback(() => {
    setMissions(seedMissions);
    setRequests(seedRequests);
    setShowcase(seedShowcase);
    localStorage.setItem('mission-board:dataVersion', DATA_VERSION);
  }, [setMissions, setRequests, setShowcase]);

  // Register resetData with the context so SettingsPage can call it
  useEffect(() => {
    registerResetData(resetDataImpl);
  }, [registerResetData, resetDataImpl]);

  const stats = useMemo(() => {
    const total = missions.length;
    const cleared = missions.reduce((sum, m) => sum + (m.clears?.length || 0), 0);
    const active = missions.filter((m) => m.status === 'active').length;
    return { total, cleared, active };
  }, [missions]);

  const randomMission = null;

  const courseMissions = useMemo(() => {
    return courses.map((course) =>
      missions.filter((m) => m.course === course)
    );
  }, [missions]);

  const clearTickerItems = useMemo(
    () => {
      const missionsWithClears = missions.filter((m) => m.clears && m.clears.length > 0);
      const items = missionsWithClears.map((m) => {
        const sortedClears = [...m.clears].sort((a, b) => (a.clearedAt < b.clearedAt ? 1 : -1));
        const latestClearAt = sortedClears[0]?.clearedAt || new Date().toISOString();
        const names = sortedClears.map((c) => c.studentName);
        return {
          id: m.id,
          missionTitle: m.title,
          course: m.course,
          studentNames: names,
          clearedAt: latestClearAt
        };
      });
      return items
        .sort((a, b) => (a.clearedAt < b.clearedAt ? 1 : -1))
        .slice(0, 16);
    },
    [missions]
  );

  const handleSubmitMission = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!missionForm.title.trim()) return;
    if (editingId) {
      setMissions(
        missions.map((m) =>
          m.id === editingId
            ? { ...m, ...missionForm, clears: m.clears }
            : m
        )
      );
    } else {
      const newMission: Mission = {
        id: crypto.randomUUID(),
        ...missionForm,
        clears: []
      };
      setMissions([newMission, ...missions]);
    }
    setEditingId(null);
    setMissionForm(createEmptyMissionForm());
  }, [editingId, missionForm, missions, setMissions]);

  const handleEditMission = useCallback((mission: Mission) => {
    setEditingId(mission.id);
    const { id, clears, ...rest } = mission;
    void id; void clears;
    setMissionForm(rest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteMission = useCallback((id: string) => {
    if (!confirm('このミッションを削除しますか？')) return;
    setMissions(missions.filter((m) => m.id !== id));
  }, [missions, setMissions]);

  const handleClearRegister = useCallback((missionId: string, studentName: string) => {
    if (!studentName.trim()) return;
    const entry: ClearEntry = {
      id: crypto.randomUUID(),
      studentName,
      clearedAt: new Date().toISOString()
    };
    setMissions(
      missions.map((m) => (m.id === missionId ? { ...m, clears: [entry, ...m.clears] } : m))
    );
  }, [missions, setMissions]);

  const handleRequestSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get('title') as string).trim();
    if (!title) return;
    const newRequest: MissionRequest = {
      id: crypto.randomUUID(),
      requesterName: (form.get('requesterName') as string)?.trim() || 'ななし',
      title,
      detail: (form.get('detail') as string)?.trim() || '',
      course: (form.get('course') as Course) || undefined,
      missionType: (form.get('missionType') as MissionType) || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setRequests([newRequest, ...requests]);
    e.currentTarget.reset();
  }, [requests, setRequests]);

  const approveRequest = useCallback((request: MissionRequest) => {
    const newMission: Mission = {
      id: crypto.randomUUID(),
      title: request.title,
      description: request.detail || '（依頼内容より作成）',
      course: request.course || 'Scratch',
      difficulty: 1,
      missionType: request.missionType || 'その他',
      createdBy: 'student',
      status: 'active',
      participants: 5,
      clears: []
    };
    setMissions([newMission, ...missions]);
    setRequests(
      requests.map((r) =>
        r.id === request.id
          ? { ...r, status: 'approved', approvedAsMissionId: newMission.id }
          : r
      )
    );
  }, [missions, setMissions, requests, setRequests]);

  const rejectRequest = useCallback((requestId: string) => {
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)));
  }, [requests, setRequests]);

  return (
    <AppShell
      role={role}
      courses={courses}
      courseMissions={courseMissions}
      activeCourseIndex={activeCourseIndex}
      setActiveCourseIndex={setActiveCourseIndex}
      stats={stats}
      randomMission={randomMission}
      showcase={showcase}
      adminVisible={role === 'admin'}
      missionForm={missionForm}
      setMissionForm={setMissionForm}
      editingId={editingId}
      onSubmitMission={handleSubmitMission}
      onResetMissionForm={() => { setEditingId(null); setMissionForm(createEmptyMissionForm()); }}
      onEditMission={handleEditMission}
      onDeleteMission={handleDeleteMission}
      onClearRegister={handleClearRegister}
      requests={requests}
      approveRequest={approveRequest}
      rejectRequest={rejectRequest}
      handleRequestSubmit={handleRequestSubmit}
      clearTickerItems={clearTickerItems}
      boardInterval={boardInterval}
      tickerDuration={tickerDuration}
    />
  );
}

export default App;
