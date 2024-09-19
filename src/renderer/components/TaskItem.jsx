// src/renderer/components/TaskItem.jsx

// this file is used within the **task list* file to render each task item
import React, { useState } from 'react';

function TaskItem({ task, toggleComplete, deleteTask, editTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task.text);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        editTask(task.id, editedTask);
        setIsEditing(false);
    };

    return (
        <div className={`task ${task.completed ? 'completed-task' : ''}`}>
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={(e) => toggleComplete(task.id, e.target.checked)} 
            />
            {isEditing ? (
                <input 
                    type="text" 
                    value={editedTask} 
                    onChange={(e) => setEditedTask(e.target.value)} 
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
            ) : (
                <span 
                    className={task.completed ? 'completed-task' : ''} 
                    onDoubleClick={handleEdit}
                >
                    {task.text}
                </span>
            )}
            <div className="dropdown">
                <button className="dropbtn">⋮</button>
                <div className="dropdown-content">
                    <a href="#" onClick={handleEdit}>Edit</a>
                    <a href="#" onClick={() => deleteTask(task.id)}>Delete</a>
                </div>
            </div>
        </div>
    );
}

export default TaskItem;