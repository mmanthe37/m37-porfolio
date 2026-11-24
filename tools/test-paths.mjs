import { spawnSync } from 'node:child_process';

for (const url of ['https://mmanthe37.github.io/m37-porfolio/', 'https://m37.tech/']) {
  const env = { ...process.env, PAGES_URL: url, ASTRO_TELEMETRY_DISABLED: '1' };
  for (const args of [['run', 'build'], ['run', 'check:site']]) {
    const run = spawnSync('npm', args, { env, stdio: 'inherit', shell: process.platform === 'win32' });
    if (run.status !== 0) process.exit(run.status ?? 1);
  }
}
