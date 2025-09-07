#!/usr/bin/env node
/**
 * Post-install script to patch undici File API compatibility issue
 * Fixes "ReferenceError: File is not defined" in Node.js < 20
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Patching undici for Node.js compatibility...');

const undiciWebIdlPath = path.join(__dirname, '..', 'node_modules', 'undici', 'lib', 'web', 'webidl', 'index.js');

if (!fs.existsSync(undiciWebIdlPath)) {
  console.log('⚠️  undici webidl file not found, skipping patch');
  process.exit(0);
}

try {
  let content = fs.readFileSync(undiciWebIdlPath, 'utf8');
  
  // Check if already patched
  if (content.includes('// PATCHED: File API compatibility')) {
    console.log('✅ undici already patched');
    process.exit(0);
  }

  // Add File API polyfill at the beginning
  const polyfillCode = `
// PATCHED: File API compatibility for Node.js < 20
if (typeof globalThis.File === 'undefined') {
  globalThis.File = class File {
    constructor(parts, filename, options = {}) {
      this.name = filename || '';
      this.lastModified = Date.now();
      this.type = options.type || '';
      this.size = 0;
      if (Array.isArray(parts)) {
        this.size = parts.reduce((total, part) => {
          if (typeof part === 'string') return total + part.length;
          if (part && part.length) return total + part.length;
          return total;
        }, 0);
      }
    }
    stream() { return new ReadableStream(); }
    arrayBuffer() { return Promise.resolve(new ArrayBuffer(0)); }
    text() { return Promise.resolve(''); }
    slice() { return new File([], this.name); }
  };
}

if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = class Blob {
    constructor(parts = [], options = {}) {
      this.size = 0;
      this.type = options.type || '';
      if (Array.isArray(parts)) {
        this.size = parts.reduce((total, part) => {
          if (typeof part === 'string') return total + part.length;
          if (part && part.length) return total + part.length;
          return total;
        }, 0);
      }
    }
    arrayBuffer() { return Promise.resolve(new ArrayBuffer(0)); }
    text() { return Promise.resolve(''); }
    slice() { return new Blob(); }
    stream() { return new ReadableStream(); }
  };
}

`;

  // Insert polyfill at the beginning of the file
  content = polyfillCode + content;
  
  // Write the patched content
  fs.writeFileSync(undiciWebIdlPath, content, 'utf8');
  
  console.log('✅ undici successfully patched for File API compatibility');
  
} catch (error) {
  console.error('❌ Failed to patch undici:', error.message);
  process.exit(1);
}
