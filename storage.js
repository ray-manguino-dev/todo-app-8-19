/**
 * Task Storage Module - Handles localStorage persistence for tasks
 */

const TASKS_KEY = 'todo-app-tasks';

/**
 * Get all tasks from localStorage
 * @returns {Array} Array of task objects
 */
export function getTasks() {
    try {
        const data = localStorage.getItem(TASKS_KEY);
        if (!data) return [];
        const tasks = JSON.parse(data);
        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        console.error('Error reading tasks from localStorage:', error);
        return [];
    }
}

/**
 * Save all tasks to localStorage
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {
    try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

/**
 * Add a new task
 * @param {string} title - Task title
 * @returns {Object} The created task object
 */
export function addTask(title) {
    const tasks = getTasks();
    const newTask = {
        id: generateId(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}

/**
 * Toggle task completion status
 * @param {string} taskId - The task ID
 * @returns {Object|null} Updated task or null if not found
 */
export function toggleTask(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks(tasks);
    return tasks[taskIndex];
}

/**
 * Delete a task
 * @param {string} taskId - The task ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteTask(taskId) {
    const tasks = getTasks();
    const initialLength = tasks.length;
    const filtered = tasks.filter(t => t.id !== taskId);
    
    if (filtered.length === initialLength) return false;
    
    saveTasks(filtered);
    return true;
}

/**
 * Generate a unique ID
 * @returns {string} UUID-like ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Clear all tasks (for testing purposes)
 */
export function clearAllTasks() {
    localStorage.removeItem(TASKS_KEY);
}