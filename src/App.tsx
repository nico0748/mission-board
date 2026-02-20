import { useEffect, useMemo, useState, useCallback } from 'react';
import { seedMissions, seedRequests, seedShowcase } from './data/seed';
import { usePersistentState } from './hooks/usePersistentState';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { AppShell } from './components/templates/AppShell';
import type {
  ClearEntry,
  Course,
  Mission,
  MissionRequest,
  MissionType,
  ShowcaseEntry,
  Role
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

type ThemeKey = 'warm' | 'cool' | 'dark';
type MissionFormState = Omit<Mission, 'id' | 'clears'>;

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

function App() {
  const [role, setRole] = useState<Role>('general');
  const [adminPin, setAdminPin] = usePersistentState<string>('adminPin', () => '2468');
  const [theme, setTheme] = usePersistentState<ThemeKey>('theme', () => 'warm');
  const [boardInterval, setBoardInterval] = usePersistentState<number>('boardInterval', () => 10);
  const [tickerDuration, setTickerDuration] = usePersistentState<number>('tickerDuration', () => 30);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  // usePersistentState is still useful for editing/clears if we want to persist local changes on top of sheet data
  // But for now, let's treat Sheet data as master for the mission list.
  const [missions, setMissions] = usePersistentState<Mission[]>('missions', () => seedMissions);
  
  const { data: sheetMissions, loading: sheetLoading, error: sheetError } = useGoogleSheets();

  // Sync Sheet data to filtered missions when loaded
  useEffect(() => {
    if (sheetMissions) {
      console.log('Loaded missions from Sheet:', sheetMissions.length);
      // Merge strategy: Replace entirely or merge? 
      // User said "migrate data/seed.ts to Google SpreadSheets".
      // So we should probably use sheetMissions as the source.
      // However, `clears` are currently local and not in the sheet. 
      // If we just replace `missions` with `sheetMissions`, we lose local `clears`.
      // We need to preserve `clears` from local state if IDs match.
      
      setMissions((prevMissions: Mission[]) => {
        return sheetMissions.map((sheetMsg: Mission) => {
          const localMatch = prevMissions.find((m: Mission) => m.id === sheetMsg.id);
          return {
            ...sheetMsg,
            // If data is coming from the sheet, it includes clears now. 
            // We prioritize sheet clears. If sheet has no clears (length 0), we *could* fallback to local, 
            // but if the sheet is meant to be the source of truth, we should probably stick to it.
            // However, to be safe during migration: if sheet clears are empty, maybe keep local? 
            // Actually, if I just want to switch to Sheet 2, I should likely just use sheetMsg.clears.
            // Let's concat them to ensure we don't lose local clears that haven't been synced?
            // "migrate data... to Google SpreadSheets" -> eventually local clears should be gone.
            // For now, I will use sheetMsg.clears if it has data.
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
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

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

  const stats = useMemo(() => {
    const total = missions.length;
    const cleared = missions.reduce((sum, m) => sum + (m.clears?.length || 0), 0);
    const active = missions.filter((m) => m.status === 'active').length;
    return { total, cleared, active };
  }, [missions]);

  // Random Mission (not implemented in original but required by props)
  const randomMission = null;

  const courseMissions = useMemo(() => {
    return courses.map((course) =>
      missions.filter((m) => {
        return m.course === course;
      })
    );
  }, [missions]);

  const activeList = courseMissions[activeCourseIndex] ?? [];

  const clearTickerItems = useMemo(
    () => {
      // 1. Filter missions that have clears
      const missionsWithClears = missions.filter((m) => m.clears && m.clears.length > 0);

      // 2. Map to Ticker Item format (Grouped)
      const items = missionsWithClears.map((m) => {
        // Sort clears by date desc to find the latest
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

      // 3. Sort missions by their latest clear date
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

  const resetData = useCallback(() => {
    if (!confirm('すべてのデータを初期状態に戻しますか？')) return;
    setMissions(seedMissions);
    setRequests(seedRequests);
    setShowcase(seedShowcase);
    localStorage.setItem('mission-board:dataVersion', DATA_VERSION);
  }, [setMissions, setRequests, setShowcase]);

  const requestAdminMode = useCallback(() => {
    if (role === 'admin') return;
    const input = prompt('Admin PIN を入力してください');
    if (input === null) return;
    if (input === adminPin) {
      setRole('admin');
    } else {
      alert('PIN が違います');
      setRole('general');
    }
  }, [role, adminPin, setRole]);

  const handlePinChange = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const current = (form.get('currentPin') as string) || '';
    const next = (form.get('nextPin') as string) || '';
    if (current !== adminPin) {
      alert('現在のPINが一致しません');
      return;
    }
    if (next.trim().length < 4) {
      alert('PINは4桁以上にしてください');
      return;
    }
    setAdminPin(next.trim());
    alert('PINを更新しました');
    e.currentTarget.reset();
  }, [adminPin, setAdminPin]);

  return (
    <AppShell
      role={role}
      setRole={setRole}
      theme={theme}
      setTheme={setTheme}
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
      handlePinChange={handlePinChange}
      handleRequestSubmit={handleRequestSubmit}
      clearTickerItems={clearTickerItems}
      settingsOpen={settingsOpen}
      setSettingsOpen={setSettingsOpen}
      requestAdminMode={requestAdminMode}
      resetData={resetData}
      boardInterval={boardInterval}
      setBoardInterval={setBoardInterval}
      tickerDuration={tickerDuration}
      setTickerDuration={setTickerDuration}
    />
  );
}

export default App;
