// src/renderer/components/TaskInput.jsx
import React, { useState } from 'react';

function TaskInput({ addTask }) {
    const [task, setTask] = useState('');

    const handleAddTask = () => {
        addTask(task);
        setTask('');
    };

    return (
        <div>
            <input
                type="text"
                id="taskInput"
                placeholder="Enter a new task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button id="addTask" className="button" onClick={handleAddTask}>
                Add Task
            </button>
        </div>
    );
}

export default TaskInput;