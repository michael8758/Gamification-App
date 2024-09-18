// test-db.js
const { promisePool, testConnection } = require('./database');

async function testDBOperations() {
    try {
        await testConnection(); // Test the connection
        const [result] = await promisePool.query('INSERT INTO tasks (title) VALUES (?)', ['Test Task']);
        console.log('Insert successful:', result);
        const [rows] = await promisePool.query('SELECT * FROM tasks');
        console.log('Fetched tasks:', rows);
    } catch (error) {
        console.error('Database operation failed:', error);
    }
}

testDBOperations();