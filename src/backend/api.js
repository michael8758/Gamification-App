const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql2');

app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'gamification',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// GET tasks
app.get('/tasks', async (req, res) => {
    try {
        const [results] = await promisePool.query('SELECT * FROM tasks');
        res.json(results);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST new task
app.post('/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        const [results] = await promisePool.query('INSERT INTO tasks (title) VALUES (?)', [title]);
        res.status(201).json({ id: results.insertId, title });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// PUT update task completion
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const query = title ? 'UPDATE tasks SET title = ? WHERE id = ?' : 'UPDATE tasks SET completed = ? WHERE id = ?';
        const params = title ? [title, id] : [completed, id];

        await promisePool.query(query, params);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await promisePool.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});