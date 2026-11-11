// Typed access to the automatic file timeline (timeline.json, written by
// tracker/scan-3d.ps1) and the daily summaries (summaries.json, written by the
// daily Claude summary task). Do not edit timeline.json by hand.

import timelineData from './timeline.json';
import summaryData from './summaries.json';
import { project } from './project';

export type EventKind = 'added' | 'version' | 'updated' | 'render' | 'deleted' | 'info' | 'note';

export interface FileEvent {
  id: string;
  date: string; // ISO, UTC
  kind: EventKind;
  category: string;
  title: string;
  detail: string;
  path: string;
  name: string;
  key: string;
  by: string;
  count: number;
  size: number;
  saves: number;
  backfill: boolean;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD (UK)
  summary: string;
}

export const fileEvents: FileEvent[] = ((timelineData as { events?: FileEvent[] }).events ?? []).slice();
export const timelineUpdatedAt: string | undefined = (timelineData as { updatedAt?: string }).updatedAt;
export const summaries: DailySummary[] = (summaryData as DailySummary[]).slice();

// Project updates (src/content/project.ts) as timeline notes, dated midday UK.
export const noteEvents: FileEvent[] = project.updates.map((u, i) => ({
  id: `note-${i}`,
  date: `${u.date}T12:00:00Z`,
  kind: 'note',
  category: 'note',
  title: u.title,
  detail: u.description,
  path: '',
  name: '',
  key: `note-${i}`,
  by: '',
  count: 0,
  size: 0,
  saves: 0,
  backfill: false,
}));

export const allEvents: FileEvent[] = [...fileEvents, ...noteEvents].sort((a, b) => b.date.localeCompare(a.date));

const ukDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' });
const ukTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
const ukLong = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const ukStamp = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/** YYYY-MM-DD in UK time */
export const dayKey = (iso: string) => ukDay.format(new Date(iso));
export const timeOf = (iso: string) => ukTime.format(new Date(iso));
export const longDay = (day: string) => ukLong.format(new Date(`${day}T12:00:00Z`));
export const stamp = (iso: string) => ukStamp.format(new Date(iso));
export const ukDate = (ymd: string) => (ymd ? ymd.split('-').reverse().join('/') : '');

export function formatSize(bytes: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

export const kindLabels: Record<EventKind, string> = {
  added: 'Added',
  version: 'New version',
  updated: 'Updated',
  render: 'Render',
  deleted: 'Deleted',
  info: 'Info',
  note: 'Project update',
};

/** Latest version number (e.g. "V05") found in a list of events, by name or path. */
export function latestVersion(events: FileEvent[]): string | undefined {
  let best = -1;
  let label: string | undefined;
  for (const e of events) {
    for (const m of `${e.path}\\${e.name}`.matchAll(/[_\\ \-]V(\d{1,4})(?=[_\\ .\-]|$)/gi)) {
      const v = parseInt(m[1], 10);
      if (v > best) {
        best = v;
        label = `V${m[1]}`;
      }
    }
  }
  return label;
}
