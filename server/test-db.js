import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('\n======================================================');
console.log('  RK NUTRITION — MONGODB ATLAS CONNECTIVITY TEST');
console.log('======================================================\n');

if (!uri) {
  console.error('❌ MONGODB_URI is not set in server/.env');
  process.exit(1);
}

const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Connecting to: ${maskedUri}...`);

try {
  const startTime = Date.now();
  await mongoose.connect(uri, {
    dbName: 'rk_nutrition',
    serverSelectionTimeoutMS: 15000
  });

  const duration = Date.now() - startTime;
  console.log(`\n\x1b[32m✔ [SUCCESS]\x1b[0m Connected to MongoDB Atlas in ${duration}ms!`);

  const adminDb = mongoose.connection.db.admin();
  const ping = await adminDb.ping();
  console.log(`\x1b[32m✔ [SUCCESS]\x1b[0m Database Ping:`, ping);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`\nFound ${collections.length} Collections in database 'rk_nutrition':`);

  for (const col of collections) {
    const count = await mongoose.connection.db.collection(col.name).countDocuments();
    console.log(`  - \x1b[36m${col.name}\x1b[0m: ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('\n\x1b[32m✔ Database connection is healthy and verified.\x1b[0m\n');
  process.exit(0);
} catch (err) {
  console.error('\n\x1b[31m✖ [CONNECTION FAILED]\x1b[0m');
  console.error(`Error Message: ${err.message}`);

  if (err.message.includes('Could not connect to any servers') || err.message.includes('whitelist') || err.message.includes('ECONNREFUSED')) {
    console.log('\n\x1b[33m[DIAGNOSIS & FIX]:\x1b[0m');
    console.log('Your MongoDB Atlas cluster has IP Whitelist protection enabled.');
    console.log('Please follow these steps in your MongoDB Atlas Dashboard:');
    console.log('  1. Go to https://cloud.mongodb.com and log in.');
    console.log('  2. Click on "Network Access" in the left sidebar.');
    console.log('  3. Click "+ Add IP Address".');
    console.log('  4. Either click "Add Current IP Address" OR select "Allow Access from Anywhere" (0.0.0.0/0).');
    console.log('  5. Click "Confirm" and wait 1-2 minutes for the changes to apply.');
  }

  process.exit(1);
}
