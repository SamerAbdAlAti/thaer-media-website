#!/usr/bin/env node
/**
 * Build the site locally and publish it to the `gh-pages` branch.
 *
 * Used while the GitHub Actions workflow can't run (the account's Actions are locked by a
 * billing issue). GitHub's own branch-based Pages publishing still works. Once Actions works
 * again, switch Pages back to "GitHub Actions" (see README) and this script isn't needed.
 *
 * Usage:  npm run deploy           (from an up-to-date main: run `git pull` first)
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const run = (cmd, args, env = {}) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...env } });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

// Repo and site address come from the "origin" remote, e.g. github.com/Owner/repo-name.
const remote = git('remote', 'get-url', 'origin');
const match = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
if (!match) throw new Error(`origin is not a GitHub repo: ${remote}`);
const [, owner, repo] = match;
const userSite = repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const env = {
  SITE_URL: `https://${owner.toLowerCase()}.github.io`,
  BASE_PATH: userSite ? '' : `/${repo}`,
  GITHUB_REPOSITORY: `${owner}/${repo}`,
  GITHUB_REF_NAME: 'main',
  MSYS_NO_PATHCONV: '1', // Git Bash on Windows would otherwise rewrite "/repo" into a Windows path
};
console.log(`\n▸ Building for ${env.SITE_URL}${env.BASE_PATH}/`);

// Astro 7.4 needs Node >= 22.23.4; use a temporary copy of that version if this one is older.
const [maj, min, pat] = process.versions.node.split('.').map(Number);
const nodeOk = maj > 22 || (maj === 22 && (min > 23 || (min === 23 && pat >= 4)));
if (nodeOk) run('npx', ['astro', 'build'], env);
else run('npx', ['-y', 'node@22.23.4', 'node_modules/astro/bin/astro.mjs', 'build'], env);

// Copy dist/ into a temporary worktree of gh-pages and push it.
const work = mkdtempSync(join(tmpdir(), 'tm-gh-pages-'));
try {
  run('git', ['fetch', 'origin', 'gh-pages']);
  run('git', ['worktree', 'add', '-B', 'gh-pages', work, 'origin/gh-pages']);
  for (const name of readdirSync(work)) if (name !== '.git') rmSync(join(work, name), { recursive: true, force: true });
  cpSync('dist', work, { recursive: true });
  writeFileSync(join(work, '.nojekyll'), ''); // keep the _astro/ folder (Jekyll would drop it)
  const g = (...args) => execFileSync('git', ['-C', work, ...args], { encoding: 'utf8' }).trim();
  g('add', '-A');
  if (!g('status', '--porcelain')) {
    console.log('\n✓ Nothing changed since the last deploy.');
  } else {
    const source = git('rev-parse', '--short', 'HEAD');
    g('commit', '-m', `Deploy ${source} (built locally)`);
    run('git', ['-C', work, 'push', 'origin', 'gh-pages']);
    console.log(`\n✓ Published. Live in about a minute: ${env.SITE_URL}${env.BASE_PATH}/`);
  }
} finally {
  spawnSync('git', ['worktree', 'remove', '--force', work], { stdio: 'ignore' });
}
