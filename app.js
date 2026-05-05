/**
 * Todo App - Core Feature: Mark tasks complete and delete
 * Uses storage.js for data persistence
 */

import { getTasks, addTask, toggleTask, deleteTask } from './storage.js';

/**
 * Initialize the app - load tasks and render
 */
function init() {
    const tasks = getTasks();
    renderTasks(tasks);
}

/**
 * Render all tasks to the DOM
 * @param {Array} tasks - Array of task objects
 */
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

/**
 * Create a task list item element
 * @param {Object} task - Task object with id, text, completed, createdAt
 * @returns {HTMLElement} The list item element
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'task-' + task.id;
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task as ' + (task.completed ? 'incomplete' : 'complete'));
    checkbox.addEventListener('change', () => handleToggle(task.id));
    
    const label = document.createElement('label');
    label.htmlFor = 'task-' + task.id;
    label.textContent = task.text || task.title;
    if (task.completed) {
        label.classList.add('completed');
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => handleDelete(task.id));
    
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    
    return li;
}

/**
 * Handle task toggle
 * @param {string} taskId - The task ID
 */
function handleToggle(taskId) {
    const updatedTask = toggleTask(taskId);
    if (updatedTask) {
        const li = document.querySelector('[data-task-id="' + taskId + '"]');
        if (li) {
            const label = li.querySelector('label');
            if (label) {
                label.classList.toggle('completed', updatedTask.completed);
            }
        }
    }
}

/**
 * Handle task deletion
 * @param {string} taskId - The task ID
 */
function handleDelete(taskId) {
    if (deleteTask(taskId)) {
        const li = document.querySelector('[data-task-id="' + taskId + '"]');
        if (li) {
            li.remove();
        }
    }
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// Export for testing
export { handleToggle, handleDelete, renderTasks };