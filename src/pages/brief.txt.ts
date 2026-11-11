// One-link project brief for Claude (and people) at /iktva/brief.txt.
// Plain text, rebuilt on every deploy from the same records as the site:
// STATUS.md, shots, production, pipeline, the file timeline, daily summaries
// and the git history. Newcomers paste this one URL into Claude.

import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';
import statusRaw from '../../STATUS.md?raw';
import { project } from '../content/project';
import { shots } from '../content/shots';
import { milestones, reviews, laser, venue, brand, onboarding } from '../content/production';
import { sceneSetup, renderPasses, ledWall, cameras, deliverySpec, gotchas, namingRules } from '../content/pipeline';
import { fileEvents, summaries, timelineUpdatedAt, dayKey, timeOf, stamp, ukDate, latestVersion } from '../content/timeline';

const SITE = 'https://rd-code-storage.github.io/iktva/';
const DAYS = 14;
const PER_DAY = 12;

function recentCommits(sinceIso: string): string[] {
  try {
    const raw = execSync(`git log --no-merges --since=${sinceIso} --format=%x1e%an%x1f%aI%x1f%s%x1f%b`, {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
    return raw
      .split('\x1e')
      .filter((c) => c.trim())
      .map((c) => c.split('\x1f'))
      .filter(([, , , body = '']) => !/^tracked-by:/im.test(body))
      .map(([author, date, subject, body = '']) => {
        const withClaude = /co-authored-by:\s*claude/i.test(body) ? ' (with Claude)' : '';
        return `- ${stamp(date)} | ${author.trim()}${withClaude} | ${subject.trim()}`;
      });
  } catch {
    return ['- (git history not available in this build)'];
  }
}

export const GET: APIRoute = () => {
  const now = new Date();
  const since = new Date(now.getTime() - DAYS * 24 * 3600 * 1000);
  const sinceIso = since.toISOString();
  const L: string[] = [];
  const h = (title: string) => L.push('', `## ${title}`, '');

  L.push(
    `# ${project.title}: project brief`,
    '',
    `Generated ${stamp(now.toISOString())} (UK time) from the project knowledge base: ${SITE}`,
    timelineUpdatedAt ? `Animation folder on U: last scanned ${stamp(timelineUpdatedAt)}.` : '',
    '',
    'HOW TO USE THIS (for Claude or any reader):',
    '- This file is the single source for "what has happened, what do I need to know right now, and what is left to do".',
    '- Answer from this file only. Say when something is marked TBC (not confirmed) or when a record looks older than a week.',
    '- Give a short answer first, then point to the site pages listed at the end for detail.',
    '- File activity is recorded automatically from the U: drive (file info only, never contents). Names are the Windows owner of each file.',
    '- All dates are UK format, DD/MM/YYYY. "Draft" or "TBC" means not yet confirmed by the team.',
    '- Sections run from most to least important: status first, raw activity log near the end.',
  );

  h('Project');
  L.push(
    `- Project: ${project.title} (code ${project.code})`,
    `- Client: ${project.client}`,
    `- Venue: ${project.venue}`,
    `- Producer: ${project.producer}`,
    `- Phase: ${project.status}`,
    `- What it is: ${project.description}`,
    `- Team: ${project.team.map((t) => `${t.name} (${t.role})`).join('; ')}`,
  );

  h('Status (STATUS.md, maintained by the team)');
  // Demote STATUS.md's headings so they sit under this section
  L.push(statusRaw.replace(/\r/g, '').replace(/^# .*\n+/, '').replace(/^## /gm, '### ').trim());

  h('Shots and tasks');
  for (const s of shots) {
    const re = s.match ? new RegExp(s.match, 'i') : null;
    const related = re ? fileEvents.filter((e) => re.test(`${e.path}\\${e.name}`)) : [];
    const last = related.reduce<(typeof related)[number] | undefined>((a, e) => (!a || e.date > a.date ? e : a), undefined);
    const v = latestVersion(related);
    L.push(
      `- [${s.status}] ${s.id}: ${s.name}. Owner: ${s.owner}.${v ? ` Highest version number in its files (renders or scenes): ${v}.` : ''}${
        last ? ` Last activity: ${stamp(last.date)} (${last.title}).` : ''
      }`,
      `  ${s.description}${s.notes ? ` Note: ${s.notes}` : ''}`,
    );
  }

  h('Schedule');
  for (const m of milestones) {
    L.push(`- [${m.status === 'done' ? 'done' : m.status === 'next' ? 'in progress' : 'planned'}] ${m.date ? ukDate(m.date) : 'date TBC'}: ${m.title}${m.tbc ? ' (TBC)' : ''}`);
  }

  h('Review and approval log');
  if (reviews.length === 0) L.push('- No reviews logged yet.');
  for (const r of reviews) L.push(`- ${ukDate(r.date)}: ${r.version}, shown to ${r.shownTo}. Outcome: ${r.outcome}. ${r.feedback}`);

  // Raw activity goes near the end (see pushActivity call below)
  const pushActivity = () => {
  h(`Last ${DAYS} days of activity (most recent ${PER_DAY} entries per day)`);
  const recent = fileEvents.filter((e) => e.date >= sinceIso && e.kind !== 'info');
  const byDay = new Map<string, typeof recent>();
  for (const e of recent) {
    const d = dayKey(e.date);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(e);
  }
  const summaryByDay = new Map(summaries.map((s) => [s.date, s.summary]));
  const updatesByDay = new Map<string, string[]>();
  for (const u of project.updates) {
    if (u.date < dayKey(sinceIso)) continue;
    updatesByDay.set(u.date, [...(updatesByDay.get(u.date) ?? []), `${u.title}: ${u.description}`]);
  }
  const days = [...new Set([...byDay.keys(), ...updatesByDay.keys(), ...summaries.map((s) => s.date).filter((d) => d >= dayKey(sinceIso))])].sort().reverse();
  if (days.length === 0) L.push('- Nothing recorded.');
  for (const d of days) {
    L.push(`${ukDate(d)}:`);
    if (summaryByDay.has(d)) L.push(`  Summary: ${summaryByDay.get(d)}`);
    for (const u of updatesByDay.get(d) ?? []) L.push(`  - Project update. ${u}`);
    const evs = byDay.get(d) ?? [];
    const shown = evs.slice(0, PER_DAY);
    for (const e of shown) {
      L.push(`  - ${timeOf(e.date)} ${e.by}: ${e.title}${e.detail ? ` (${e.detail})` : ''}${e.path ? ` [${e.path}]` : ''}${e.backfill ? ' (time = file last modified)' : ''}`);
    }
    if (evs.length > shown.length) L.push(`  - ...and ${evs.length - shown.length} more (see Timeline page)`);
  }

  h(`Changes to the knowledge base, last ${DAYS} days`);
  const commits = recentCommits(sinceIso);
  L.push(...(commits.length ? commits.slice(0, 25) : ['- None.']));
  };

  h('Still to be confirmed (TBC)');
  const tbc = [
    ...sceneSetup.filter((s) => s.tbc).map((s) => `Scene setup: ${s.label}`),
    ...ledWall.filter((s) => s.tbc).map((s) => `LED wall: ${s.label} (working value ${s.value})`),
    ...deliverySpec.filter((s) => s.tbc).map((s) => `Delivery: ${s.label}`),
    ...laser.filter((s) => s.tbc).map((s) => `Laser: ${s.label}`),
    ...venue.filter((s) => s.tbc).map((s) => `Venue: ${s.label}`),
    ...brand.filter((s) => s.tbc).map((s) => `Brand: ${s.label}`),
  ];
  L.push(...tbc.map((t) => `- ${t}`));

  h('Known issues and gotchas');
  L.push(...gotchas.map((g) => `- ${g.issue}: ${g.detail}`));

  h('Key technical facts');
  L.push(...sceneSetup.map((s) => `- ${s.label}: ${s.value}${s.tbc ? ' (TBC)' : ''}`));
  L.push(...renderPasses.map((s) => `- Render pass ${s.label.trim()}: ${s.value}. ${s.note ?? ''}`));
  L.push(...ledWall.map((s) => `- LED ${s.label}: ${s.value}${s.tbc ? ' (TBC)' : ''}`));
  L.push(...cameras.map((s) => `- ${s.label}: ${s.value}. ${s.note ?? ''}`));
  L.push(...namingRules.map((r) => `- Naming: ${r.rule} (e.g. ${r.example})`));

  h('First-day checklist');
  L.push(...onboarding.map((o) => `- ${o.item}: ${o.detail}`));

  pushActivity();

  h('Links');
  L.push(
    `- Start here: ${SITE}start/`,
    `- Timeline (all activity): ${SITE}timeline/`,
    `- Shots: ${SITE}shots/`,
    `- Technical (pipeline, LED wall, cameras, naming, delivery): ${SITE}technical/`,
    `- Production (schedule, reviews, laser, venue, brand): ${SITE}production/`,
    `- Assets: ${SITE}assets/`,
    `- Changes (who changed what on the site): ${SITE}changes/`,
    ...project.links.map((l) => `- ${l.label}: ${l.url}`),
  );

  const text = L.filter((line, i, arr) => !(line === '' && arr[i - 1] === '')).join('\n') + '\n';
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
