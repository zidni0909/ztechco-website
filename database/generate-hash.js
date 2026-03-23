const bcrypt = require('bcryptjs');

// Generate hash untuk password: admin123
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nGunakan hash ini di schema.sql untuk default admin user');
