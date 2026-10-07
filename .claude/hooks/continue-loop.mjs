#!/usr/bin/env node
// Sift build loop — Stop hook.
// Runs after every Claude turn. While .claude/loop/RUN exists it:
//   1. runs the verification commands from .claude/loop/config.json,
//   2. requires a clean git work tree,
//   3. reads docs/PROGRESS.md and either sends Claude to the next step
//      ({"decision":"block"}) or lets it stop (and removes RUN).
// Without RUN it does nothing, so normal Claude Code use is unaffected.

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const loopDir = join(root, '.claude', 'loop');
const RUN = join(loopDir, 'RUN');
const STOP = join(loopDir, 'STOP');
const STATE = join(loopDir, 'state.json');
const CONFIG = join(loopDir, 'config.json');

const readJson = (p, fallback) => {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; }
};
const emit = (obj) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };

function allowStop(message) {
  try { if (existsSync(RUN)) unlinkSync(RUN); } catch { /* ignore */ }
  try { if (existsSync(STOP)) unlinkSync(STOP); } catch { /* ignore */ }
  writeFileSync(STATE, JSON.stringify({ iterations: 0 }, null, 2));
  const safe = message.replace(/[\u0000-\u001f]/g, ' ').slice(0, 200);
  emit({
    systemMessage: `Build loop stopped: ${message}`,
    terminalSequence: `\u001b]9;Sift build loop: ${safe}\u0007`,
  });
}

function keepGoing(reason) {
  const state = readJson(STATE, { iterations: 0 });
  state.iterations = (state.iterations || 0) + 1;
  writeFileSync(STATE, JSON.stringify(state, null, 2));
  emit({ decision: 'block', reason });
}

// Drain stdin (hook input JSON); not needed beyond that.
try { readFileSync(0, 'utf8'); } catch { /* ignore */ }

// 0. Loop switched off → normal behavior.
if (!existsSync(RUN)) process.exit(0);

const config = {
  phaseLimit: 0,
  maxIterations: 40,
  verify: ['npm test'],
  verifyTimeoutSeconds: 300,
  progressFile: 'docs/PROGRESS.md',
  ...readJson(CONFIG, {}),
};

if (existsSync(STOP)) allowStop('STOP file found');

const state = readJson(STATE, { iterations: 0 });
if ((state.iterations || 0) >= config.maxIterations) {
  allowStop(`iteration cap of ${config.maxIterations} reached`);
}

// 1. Verification.
for (const cmd of config.verify) {
  try {
    execSync(cmd, {
      cwd: root,
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: config.verifyTimeoutSeconds * 1000,
    });
  } catch (e) {
    const log = `${e.stdout || ''}\n${e.stderr || ''}`.trim().slice(-3000);
    keepGoing(
      `Verification failed: \`${cmd}\`. Fix the cause before anything else. ` +
      `Do not weaken, skip or delete tests. If this is the third failure on the same step, ` +
      `apply the failure rule in docs/LOOP.md.\n\n${log}`,
    );
  }
}

// 2. Clean work tree.
let dirty = '';
try {
  dirty = execSync('git status --porcelain', { cwd: root, encoding: 'utf8' }).trim();
} catch { /* not a git repo: skip */ }
if (dirty) {
  keepGoing(
    `The work tree is not clean:\n${dirty.slice(0, 1500)}\n\n` +
    `Finish the current step (definition of done, CHANGELOG, docs/PROGRESS.md) and commit it, ` +
    `or restore the files if the change was abandoned. Every turn must end with a clean tree.`,
  );
}

// 3. Progress.
let text = '';
try { text = readFileSync(join(root, config.progressFile), 'utf8'); } catch {
  allowStop(`${config.progressFile} not found`);
}
const steps = [...text.matchAll(/^- \[( |~|x|!)\] (\d+)\.(\d+) (.+)$/gm)].map((m) => ({
  mark: m[1],
  phase: Number(m[2]),
  id: `${m[2]}.${m[3]}`,
  title: m[4].trim(),
}));
if (steps.length === 0) allowStop('no steps found in the progress file');

const blocked = steps.filter((s) => s.mark === '!');
if (blocked.length) allowStop(`step ${blocked.map((s) => s.id).join(', ')} needs the owner`);

const next = steps.find((s) => s.mark === '~') || steps.find((s) => s.mark === ' ');
if (!next) allowStop('all steps are done');
if (next.phase > config.phaseLimit) {
  allowStop(`phase ${config.phaseLimit} is complete. Review it, then raise phaseLimit to continue`);
}

keepGoing(
  `Build loop (docs/LOOP.md): continue with step ${next.id} ${next.title}` +
  `${next.mark === '~' ? ' (already in progress)' : ''}. ` +
  `Iteration ${(state.iterations || 0) + 1} of ${config.maxIterations}.`,
);
