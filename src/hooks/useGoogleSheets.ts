import { useState, useEffect, useCallback } from 'react';
import type { Mission, Course, Difficulty, MissionType } from '../types';

// Row structure:
// [0] ID, [1] Title, [2] Description, [3] Course, [4] Difficulty, [5] MissionType, [6] CreatedBy, [7] Status, [8] Participants, [9] Hidden
type SheetRow = [
  string, // ID
  string, // Title
  string, // Description
  string, // Course
  string, // Difficulty
  string, // MissionType
  string, // CreatedBy
  string, // Status
  string, // Participants
  string  // Hidden (TRUE/FALSE or checked)
];

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const RANGE = 'Sheet1!A2:J'; // Assuming row 1 is header

export function useGoogleSheets() {
  const [data, setData] = useState<Mission[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSheetData = useCallback(async () => {
    if (!API_KEY || !SPREADSHEET_ID) {
      console.warn('Google Sheets API Key or Spreadsheet ID not set.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Step 1: Fetch spreadsheet metadata to get sheet names
      const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
      const metaResponse = await fetch(metaUrl);
      const metaJson = await metaResponse.json();

      if (metaJson.error) {
        throw new Error(metaJson.error.message);
      }

      const sheets = metaJson.sheets;
      if (!sheets || sheets.length < 1) {
        throw new Error('No sheets found in the spreadsheet');
      }

      const missionSheetName = sheets[0]?.properties?.title;
      const clearsSheetName = sheets[1]?.properties?.title; // Assuming 2nd sheet is Clears

      if (!missionSheetName) {
         throw new Error('Mission sheet not found');
      }

      // Step 2: Fetch data from both sheets
      // We can use batchGet to fetch multiple ranges in one request if we want, 
      // but simple parallel fetch is also fine and easier to read for 2 sheets.
      // Let's use individual fetches for clarity or a batch request? 
      // Individual is fine unless rate limited. Let's try batchGet for efficiency.
      
      const ranges = [
        `${missionSheetName}!A2:J`,
        clearsSheetName ? `${clearsSheetName}!A2:Z` : '' // Fetch up to Z columns for students
      ].filter(Boolean);

      const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}&ranges=${ranges.map(r => encodeURIComponent(r)).join('&ranges=')}`;
      
      const response = await fetch(batchUrl);
      const json = await response.json();

      if (json.error) {
         throw new Error(json.error.message);
      }

      const valueRanges = json.valueRanges;
      if (!valueRanges || valueRanges.length === 0) {
        setData([]);
        return;
      }

      // Parse Missions (Index 0 in ranges, assuming order is preserved or we check range name)
      // The API returns valueRanges in the order requested.
      const missionRows: SheetRow[] = valueRanges[0].values || [];
      const clearRows: any[][] = (Object.keys(valueRanges).length > 1 && valueRanges[1].values) ? valueRanges[1].values : [];

      // Create a map of MissionID -> List of Student Names
      const clearsMap = new Map<string, string[]>();
      clearRows.forEach(row => {
        const missionId = row[0];
        if (!missionId) return;
        // Columns B onwards are student names
        const students = row.slice(1).filter((s: string) => s && s.trim().length > 0);
        if (students.length > 0) {
          clearsMap.set(missionId, students);
        }
      });

      const parsedMissions: Mission[] = missionRows
        .map((row) => {
          // Check if Hidden column (index 9) is TRUE or checked
          const isHidden = row[9]?.toLowerCase() === 'true';
          
          if (isHidden) return null;

          const id = row[0] || crypto.randomUUID();
          
          // Generate Clear Entries from the map
          const studentNames = clearsMap.get(id) || [];
          const clearEntries = studentNames.map(name => ({
            id: crypto.randomUUID(), // We trigger new IDs on every fetch which might cause re-renders or key issues if not memoized, but for now it's okay given the read-only nature mostly.
            studentName: name,
            clearedAt: new Date().toISOString() // No date in sheet, so use current time or maybe a fixed past time? Current load time is safest to ensure they show up.
          }));

          return {
            id: id,
            title: row[1] || 'No Title',
            description: row[2] || '',
            course: (row[3] as Course) || 'Scratch',
            difficulty: (Number(row[4]) as Difficulty) || 1,
            missionType: (row[5] as MissionType) || 'その他',
            createdBy: (row[6] as 'teacher' | 'student') || 'teacher',
            status: (row[7] as 'active' | 'inactive') || 'active',
            participants: Number(row[8]) || 0,
            clears: clearEntries 
          } as Mission;
        })
        .filter((mission): mission is Mission => mission !== null);

      setData(parsedMissions);
    } catch (err: any) {
      console.error('Failed to fetch Google Sheets data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSheetData();
  }, [fetchSheetData]);

  return { data, loading, error, refetch: fetchSheetData };
}
