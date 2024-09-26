const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'gamification',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a promise-based interface to use async/await
const promisePool = pool.promise();

// Function to test the connection
async function testConnection() {
  try {
    const [rows, fields] = await promisePool.query('SELECT 1');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Export the promisePool and testConnection function
module.exports = {
  promisePool,
  testConnection
};
