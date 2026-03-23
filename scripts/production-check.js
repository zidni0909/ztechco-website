const fs = require('fs');

console.log('🔍 Production Readiness Check\n');

let passed = 0;
let failed = 0;

// Check .next build
console.log('1. Build Check:');
if (fs.existsSync('.next')) {
  console.log('   ✅ .next folder exists');
  passed++;
} else {
  console.log('   ❌ .next folder missing - Run: npm run build');
  failed++;
}

// Check node_modules
console.log('\n2. Dependencies:');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules exists');
  passed++;
} else {
  console.log('   ❌ node_modules missing - Run: npm install');
  failed++;
}

// Check database files
console.log('\n3. Database Files:');
if (fs.existsSync('database/schema.sql')) {
  console.log('   ✅ schema.sql exists');
  passed++;
} else {
  console.log('   ❌ schema.sql missing');
  failed++;
}

// Check config files
console.log('\n4. Configuration:');
const configs = ['next.config.mjs', 'ecosystem.config.js', '.env.production'];
configs.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
    passed++;
  } else {
    console.log(`   ❌ ${file} missing`);
    failed++;
  }
});

// Check package.json scripts
console.log('\n5. Package Scripts:');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.scripts.build && pkg.scripts.start) {
  console.log('   ✅ Build and start scripts configured');
  passed++;
} else {
  console.log('   ❌ Missing build or start script');
  failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n🎉 Ready for production deployment!');
  console.log('\nNext steps:');
  console.log('1. Upload files to server');
  console.log('2. Setup database');
  console.log('3. Configure .env.local');
  console.log('4. Start with PM2');
  console.log('\nSee docs/deployment-aapanel.md for details');
} else {
  console.log('\n⚠️  Fix the issues above before deploying');
}

console.log('');
