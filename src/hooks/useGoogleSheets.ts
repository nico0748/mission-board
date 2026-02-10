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
      // Step 1: Fetch spreadsheet metadata to get the correct sheet name
      const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
      const metaResponse = await fetch(metaUrl);
      const metaJson = await metaResponse.json();

      if (metaJson.error) {
        throw new Error(metaJson.error.message);
      }

      const sheetName = metaJson.sheets?.[0]?.properties?.title;
      if (!sheetName) {
        throw new Error('No sheets found in the spreadsheet');
      }

      // Step 2: Fetch data from the first sheet
      const range = `${sheetName}!A2:J`;
      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
      const response = await fetch(valuesUrl);
      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      if (!json.values) {
        setData([]); // No data found
        return;
      }

      const rows: SheetRow[] = json.values;
      const parsedMissions: Mission[] = rows
        .map((row) => {
          // Check if Hidden column (index 9) is TRUE or checked
          const isHidden = row[9]?.toLowerCase() === 'true';
          
          if (isHidden) return null;

          return {
            id: row[0] || crypto.randomUUID(),
            title: row[1] || 'No Title',
            description: row[2] || '',
            course: (row[3] as Course) || 'Scratch',
            difficulty: (Number(row[4]) as Difficulty) || 1,
            missionType: (row[5] as MissionType) || 'その他',
            createdBy: (row[6] as 'teacher' | 'student') || 'teacher',
            status: (row[7] as 'active' | 'inactive') || 'active',
            participants: Number(row[8]) || 0,
            clears: [] // Clears are not currently synced from sheet, using local state or empty for now
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
