// src/renderer/App.jsx
import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import PomodoroTimer from './components/PomodoroTimer';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './styles.css';

function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [tasks, setTasks] = useState([]); // Define tasks state

    // Fetch tasks from the database
    const fetchTasks = async () => {
        try {
            const fetchedTasks = await window.electronAPI.databaseQuery('SELECT * FROM tasks', []);
            setTasks(fetchedTasks.map(task => ({
                id: task.id,
                text: task.title,
                completed: task.completed
            })));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, []);

    const addTask = async (text) => {
        if (!text.trim()) {
            alert('Task cannot be empty!');
            return;
        }
        try {
            await window.electronAPI.databaseQuery('INSERT INTO tasks (title) VALUES (?)', [text]);
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            await window.electronAPI.databaseQuery('UPDATE tasks SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await window.electronAPI.databaseQuery('DELETE FROM tasks WHERE id = ?', [id]);
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = async (id, newText) => {
        if (!newText.trim()) {
            alert('Task cannot be empty!');
            return;
        }
        try {
            await window.electronAPI.databaseQuery('UPDATE tasks SET title = ? WHERE id = ?', [newText, id]);
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div className="app-container">
            <Menu setCurrentTab={setCurrentTab} /> {/* Only Menu component is used now */}
            <div className="content">
                {currentTab === 'dashboard' && (
                    <div>
                        <h1>Dashboard</h1>
                        <PomodoroTimer />
                    </div>
                )}
                {currentTab === 'tasks' && (
                    <div>
                        <h1>Tasks</h1>
                        <TaskInput addTask={addTask} />
                        <TaskList 
                            tasks={tasks} 
                            toggleComplete={toggleComplete} 
                            deleteTask={deleteTask} 
                            editTask={editTask}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;