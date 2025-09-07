#!/usr/bin/env node
/**
 * Debug Check Script - Banking Application
 * 
 * This script verifies that all critical files and dependencies are in place
 * and identifies potential issues that could cause the app to crash.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Banking App Debug Check\n');

// Files to check
const criticalFiles = [
  'App.js',
  'index.js',
  'package.json',
  'app.json',
  'metro.config.js',
  'src/presentation/navigation/DemoAppNavigator.tsx',
  'src/presentation/screens/demo/ComponentsDemo.js',
  'src/presentation/screens/demo/ComponentDetailScreen.js',
  'themes/Colors.js',
  'themes/Fonts.js',
  'themes/Metrics.js',
  'assets/icons/feather-search-black.svg',
  'assets/icons/x-close.svg'
];

// Check if files exist
console.log('📁 Checking critical files...');
let missingFiles = [];

criticalFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check package.json dependencies
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check React version
  const reactVersion = packageJson.dependencies?.react;
  console.log(`📱 React version: ${reactVersion}`);
  
  if (reactVersion && reactVersion.startsWith('19.')) {
    console.log('⚠️  WARNING: React 19.x is very new and may have compatibility issues');
    console.log('   Consider downgrading to React 18.x if you experience crashes');
  }
  
  // Check critical dependencies
  const criticalDeps = [
    'expo',
    '@react-navigation/native',
    'react-native-svg',
    'react-native-svg-transformer'
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check metro.config.js for SVG support
console.log('\n🚇 Checking Metro configuration...');
try {
  const metroConfig = fs.readFileSync('metro.config.js', 'utf8');
  
  if (metroConfig.includes('react-native-svg-transformer')) {
    console.log('✅ SVG transformer configured');
  } else {
    console.log('❌ SVG transformer not found in metro.config.js');
  }
  
  if (metroConfig.includes('svg')) {
    console.log('✅ SVG file extensions configured');
  } else {
    console.log('❌ SVG extensions not configured');
  }
  
} catch (error) {
  console.log('❌ Error reading metro.config.js:', error.message);
}

// Check fonts
console.log('\n🔤 Checking font configuration...');
try {
  const fontsFile = fs.readFileSync('themes/Fonts.js', 'utf8');
  
  if (fontsFile.includes('SF Pro') && !fontsFile.includes('Platform')) {
    console.log('⚠️  WARNING: SF Pro font detected without Platform check');
    console.log('   This can cause crashes on Android devices');
  } else if (fontsFile.includes('Platform')) {
    console.log('✅ Safe font configuration detected');
  } else {
    console.log('ℹ️  Font configuration appears safe');
  }
  
} catch (error) {
  console.log('❌ Error reading themes/Fonts.js:', error.message);
}

// Summary
console.log('\n📊 Summary:');
if (missingFiles.length === 0) {
  console.log('✅ All critical files are present');
} else {
  console.log(`❌ ${missingFiles.length} critical files are missing:`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
}

console.log('\n🚀 Recommendations:');
console.log('1. Run: npx expo start --clear');
console.log('2. Check the logs for detailed error information');
console.log('3. The app now has ErrorBoundary for better error reporting');
console.log('4. If issues persist, check DEBUG_GUIDE.md for detailed steps');

console.log('\n✨ Debug check completed!');
