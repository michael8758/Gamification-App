const { ipcRenderer } = require('electron');

document.getElementById('addTask').addEventListener('click', async () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Task cannot be empty!');
        return;
    }
    try {
        await ipcRenderer.invoke('database-query', 'INSERT INTO tasks (title) VALUES (?)', [taskText]);
        taskInput.value = '';
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

async function fetchTasks() {
    try {
        const tasks = await ipcRenderer.invoke('database-query', 'SELECT * FROM tasks', []);
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = tasks.map(task => `
            <div class="task">
                <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id}, this.checked)">
                <span class="${task.completed ? 'completed-task' : ''}" ondblclick="editTask(${task.id}, this)">${task.title}</span>
                <div class="dropdown">
                    <button class="dropbtn">⋮</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="editTask(${task.id}, this.parentElement.parentElement.previousElementSibling)">Edit</a>
                        <a href="#" onclick="deleteTask(${task.id})">Delete</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function toggleComplete(id, completed) {
    try {
        await ipcRenderer.invoke('database-query', 'UPDATE tasks SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(id) {
    try {
        await ipcRenderer.invoke('database-query', 'DELETE FROM tasks WHERE id = ?', [id]);
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function editTask(id, element) {
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    element.replaceWith(input);
    input.focus();

    const save = () => saveTask(id, input);
    input.addEventListener('blur', save);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            save();
        }
    });
}

async function saveTask(id, input) {
    const newText = input.value.trim();
    if (!newText) {
        alert('Task cannot be empty!');
        input.removeEventListener('blur', saveTask);
        input.removeEventListener('keydown', saveTask);
        input.focus();
        return;
    }
    try {
        await ipcRenderer.invoke('database-query', 'UPDATE tasks SET title = ? WHERE id = ?', [newText, id]);
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

document.getElementById('fetchTasks').addEventListener('click', fetchTasks);

// Add event listener for Enter key on the input field
document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('addTask').click();
    }
});

// Fetch tasks when the page loads
fetchTasks();