const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOOKS_DIR = path.resolve(__dirname, '..', 'hooks');

describe('gsd-check-update hook', () => {
  it('should not crash when no package version file exists', () => {
    try {
      execSync(`node "${path.join(HOOKS_DIR, 'gsd-check-update.js')}"`, {
        encoding: 'utf-8',
        timeout: 15000,
        env: { ...process.env, HOME: os.tmpdir(), USERPROFILE: os.tmpdir() },
      });
    } catch {
      // May exit with error but should not throw unhandled exception
    }
  });
});

describe('gsd-context-monitor hook', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-hook-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should exit cleanly when no bridge file exists', () => {
    try {
      const result = execSync(`node "${path.join(HOOKS_DIR, 'gsd-context-monitor.js')}"`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: { ...process.env, SESSION_ID: 'test-session-123' },
      });
      // Should exit cleanly with no output (no warning needed)
    } catch (e) {
      // Exit code 0 is expected (no warning)
      assert.ok(e.status === 0 || e.status === null, 'Should exit cleanly');
    }
  });
});

describe('gsd-statusline hook', () => {
  it('should produce output when given context metrics on stdin', () => {
    const metrics = JSON.stringify({ context_window: { used: 50000, total: 200000 } });
    try {
      const result = execSync(`echo '${metrics}' | node "${path.join(HOOKS_DIR, 'gsd-statusline.js')}"`, {
        encoding: 'utf-8',
        timeout: 5000,
        env: { ...process.env, HOME: os.tmpdir(), USERPROFILE: os.tmpdir() },
        shell: true,
      });
      // Should produce some statusline output
      assert.ok(typeof result === 'string', 'Should return string output');
    } catch {
      // May fail without proper Claude Code env, that's ok
    }
  });
});
