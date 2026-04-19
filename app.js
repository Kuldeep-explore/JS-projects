// ===============================
// Todo App - Clean JS Structure
// ===============================

// DOM Elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');

// State (Single source of truth)
let todos = [];

/**
 * Initialize app
 */
function init() {
  loadFromLocalStorage();
  renderTodos();
  // Focus input on load for better UX
  input.focus();
}

// Prevent double submission by disabling button briefly
let isSubmitting = false;

/**
 * Add a new todo
 */
function addTodo() {
  if (isSubmitting) return;
  
  const text = input.value.trim();

  // Validation
  if (!text) {
    input.focus();
    return;
  }

  isSubmitting = true;
  addBtn.disabled = true;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);
  saveToLocalStorage();
  renderTodos();

  input.value = ''; // reset input
  input.focus(); // refocus for better UX
  
  // Re-enable button after a short delay
  setTimeout(() => {
    addBtn.disabled = false;
    isSubmitting = false;
  }, 100);
}

/**
 * Toggle todo completion
 */
function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveToLocalStorage();
  renderTodos();
}

/**
 * Delete a todo
 */
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

/**
 * Render all todos
 */
function renderTodos() {
  list.innerHTML = '';

  // Show/hide empty state
  if (todos.length === 0) {
    emptyState.classList.add('show');
    list.style.display = 'none';
  } else {
    emptyState.classList.remove('show');
    list.style.display = 'block';
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');

    // Text span
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = todo.completed ? 'completed' : '';
    span.setAttribute('aria-label', `${todo.text}${todo.completed ? ' (completed)' : ''}`);
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');

    // Toggle on click or Enter/Space key
    const toggleHandler = () => toggleTodo(todo.id);
    span.addEventListener('click', toggleHandler);
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleHandler();
      }
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Delete task: ${todo.text}`);
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    li.appendChild(span);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

/**
 * Save todos to localStorage with error handling
 */
function saveToLocalStorage() {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
    // Could show a user-friendly message here if needed
  }
}

/**
 * Load todos from localStorage with error handling
 */
function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('todos');
    if (data) {
      todos = JSON.parse(data);
      // Validate todos structure
      todos = todos.filter(todo => todo && typeof todo === 'object' && todo.id && todo.text);
    }
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    todos = [];
  }
}

// Event listeners
addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
});

// Start app
init();
