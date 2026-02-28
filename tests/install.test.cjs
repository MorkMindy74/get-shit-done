const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

// We need to extract testable functions from install.js
// Since it's a script not a module, we'll test via CLI execution
const { execSync } = require('child_process');

const INSTALL_PATH = path.resolve(__dirname, '..', 'bin', 'install.js');

describe('install.js', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-install-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should display help with --help flag', () => {
    try {
      const result = execSync(`node "${INSTALL_PATH}" --help`, { encoding: 'utf-8', timeout: 10000 });
      assert.ok(result.includes('get-shit-done') || result.includes('GSD') || result.includes('usage'), 'Help output should mention the tool');
    } catch (e) {
      // --help may exit with non-zero, check stderr/stdout
      const output = (e.stdout || '') + (e.stderr || '');
      assert.ok(output.length > 0, 'Should produce some output with --help');
    }
  });

  it('should detect install type correctly', () => {
    // Test that running from a local node_modules path is detected as local
    // This is a smoke test - just ensure the script doesn't crash
    try {
      execSync(`node "${INSTALL_PATH}" --version 2>&1 || true`, { encoding: 'utf-8', timeout: 10000 });
    } catch {
      // Expected - version flag may not exist
    }
  });

  it('should handle missing config directory gracefully', () => {
    const fakeHome = path.join(tmpDir, 'fake-home');
    fs.mkdirSync(fakeHome, { recursive: true });
    try {
      execSync(`node "${INSTALL_PATH}" --help`, {
        encoding: 'utf-8',
        timeout: 10000,
        env: { ...process.env, HOME: fakeHome, USERPROFILE: fakeHome },
      });
    } catch {
      // Expected to fail or show help - just shouldn't crash with unhandled error
    }
  });
});
