#!/usr/bin/env node
/**
 * Setup Project Script - Banking Application
 * 
 * Automated setup script for new developers joining the project.
 * This script will guide through the initial configuration process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏦 Banking App - Project Setup\n');

// Helper function to run commands
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Helper function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check prerequisites
console.log('🔍 Checking prerequisites...\n');

const prerequisites = [
  { command: 'node', name: 'Node.js', required: true },
  { command: 'npm', name: 'npm', required: true },
  { command: 'yarn', name: 'Yarn', required: true },
  { command: 'git', name: 'Git', required: true },
  { command: 'expo', name: 'Expo CLI', required: true },
  { command: 'eas', name: 'EAS CLI', required: false },
  { command: 'watchman', name: 'Watchman', required: false },
];

let missingRequired = [];

prerequisites.forEach(({ command, name, required }) => {
  if (commandExists(command)) {
    console.log(`✅ ${name} is installed`);
  } else {
    if (required) {
      console.log(`❌ ${name} is required but not installed`);
      missingRequired.push(name);
    } else {
      console.log(`⚠️  ${name} is not installed (optional)`);
    }
  }
});

if (missingRequired.length > 0) {
  console.log(`\n❌ Missing required tools: ${missingRequired.join(', ')}`);
  console.log('Please install them and run this script again.');
  console.log('See README.md for installation instructions.');
  process.exit(1);
}

console.log('\n✅ All required prerequisites are installed!\n');

// Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`📱 Node.js version: ${nodeVersion}`);
  
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (majorVersion < 18) {
    console.log('⚠️  WARNING: Node.js 18+ is recommended for this project');
  }
} catch (error) {
  console.log('❌ Could not check Node.js version');
}

// Setup environment file
console.log('\n🔧 Setting up environment configuration...');

if (!fs.existsSync('.env')) {
  if (fs.existsSync('env.example')) {
    try {
      fs.copyFileSync('env.example', '.env');
      console.log('✅ Created .env from env.example');
      console.log('⚠️  Please edit .env with your actual configuration values');
    } catch (error) {
      console.log('❌ Failed to create .env file:', error.message);
    }
  } else {
    console.log('❌ env.example not found. Please create .env manually');
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing project dependencies...');

if (fs.existsSync('yarn.lock')) {
  runCommand('yarn install', 'Installing with Yarn');
} else {
  runCommand('npm install', 'Installing with npm');
}

// iOS specific setup (macOS only)
if (process.platform === 'darwin') {
  console.log('\n🍎 Setting up iOS development environment...');
  
  if (fs.existsSync('ios')) {
    if (commandExists('pod')) {
      runCommand('cd ios && pod install && cd ..', 'Installing iOS CocoaPods');
    } else {
      console.log('⚠️  CocoaPods not found. Install with: sudo gem install cocoapods');
    }
  } else {
    console.log('📝 iOS folder not found. Will be created when you run: expo run:ios');
  }
} else {
  console.log('\n📝 iOS development only available on macOS');
}

// Android setup check
console.log('\n🤖 Checking Android development environment...');

const androidHome = process.env.ANDROID_HOME;
if (androidHome && fs.existsSync(androidHome)) {
  console.log('✅ ANDROID_HOME is set and directory exists');
} else {
  console.log('⚠️  ANDROID_HOME not set or directory missing');
  console.log('   Please install Android Studio and set ANDROID_HOME');
  console.log('   See README.md for detailed instructions');
}

// Git setup
console.log('\n📋 Git configuration check...');

try {
  const gitUser = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const gitEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  
  if (gitUser && gitEmail) {
    console.log(`✅ Git configured: ${gitUser} <${gitEmail}>`);
  } else {
    console.log('⚠️  Git user not configured. Please run:');
    console.log('   git config --global user.name "Your Name"');
    console.log('   git config --global user.email "your.email@example.com"');
  }
} catch (error) {
  console.log('⚠️  Git not configured. Please set up your git user and email');
}

// Expo login check
console.log('\n🌍 Expo configuration check...');

try {
  execSync('expo whoami', { stdio: 'ignore' });
  console.log('✅ Logged in to Expo');
} catch (error) {
  console.log('⚠️  Not logged in to Expo. Run: expo login');
}

// Final verification
console.log('\n🔍 Running final project verification...');

if (fs.existsSync('scripts/debug-check.js')) {
  runCommand('node scripts/debug-check.js', 'Project verification');
} else {
  console.log('⚠️  Debug check script not found');
}

// Success message and next steps
console.log('\n🎉 Project setup completed!\n');

console.log('📋 Next steps:');
console.log('1. Edit .env with your actual configuration values');
console.log('2. Start the development server: yarn start');
console.log('3. Test on your device/simulator');
console.log('4. Read README.md for detailed development instructions');

console.log('\n🚀 Quick start commands:');
console.log('  yarn start          # Start Metro bundler');
console.log('  yarn ios           # Run on iOS simulator (macOS only)');
console.log('  yarn android       # Run on Android emulator');
console.log('  yarn web           # Run in web browser');

console.log('\n💡 Useful development commands:');
console.log('  yarn start --clear # Start with cache cleared');
console.log('  yarn lint          # Check code quality');
console.log('  yarn type-check    # TypeScript validation');

console.log('\n📚 For more information:');
console.log('  - Check README.md for complete setup guide');
console.log('  - Review docs/ folder for project documentation');
console.log('  - Run: node scripts/debug-check.js for system verification');

console.log('\n✨ Happy coding! 🏦');
