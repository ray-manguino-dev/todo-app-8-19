import { getTasks, addTask, toggleTask, deleteTask } from './storage.js';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// Render the full task list
function renderTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.hidden = false;
        return;
    }
    
    emptyState.hidden = true;
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;
        
        // Checkbox
        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox-wrapper';
        checkbox.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox-input" 
                id="task-${task.id}" 
                ${task.completed ? 'checked' : ''}
                aria-label="Mark task '${escapeHtml(task.title)}' as ${task.completed ? 'incomplete' : 'complete'}"
            >
            <div class="checkbox-custom" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        `;
        
        // Label
        const label = document.createElement('label');
        label.className = 'task-label';
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.title;
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.setAttribute('aria-label', `Delete task '${escapeHtml(task.title)}'`);
        deleteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
        `;
        
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    
    addTask(title);
    taskInput.value = '';
    taskInput.focus();
    renderTasks();
});

// Handle checkbox toggle and delete via event delegation
taskList.addEventListener('change', (e) => {
    if (!e.target.classList.contains('checkbox-input')) return;
    const id = e.target.closest('.task-item')?.dataset.id;
    if (id) {
        toggleTask(id);
        renderTasks();
    }
});

taskList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-button');
    if (!deleteBtn) return;
    const id = deleteBtn.closest('.task-item')?.dataset.id;
    if (id) {
        deleteTask(id);
        renderTasks();
    }
});

// Initial render
renderTasks();