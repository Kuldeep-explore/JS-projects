// ===============================
// Todo App - Clean JS Structure
// ===============================

// DOM Elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// State (Single source of truth)
let todos = [];

/**
 * Initialize app
 */
function init() {
  loadFromLocalStorage();
  renderTodos();
}

/**
 * Add a new todo
 */
function addTodo() {
  const text = input.value.trim();

  // Validation
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);
  saveToLocalStorage();
  renderTodos();

  input.value = ''; // reset input
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

  todos.forEach(todo => {
    const li = document.createElement('li');

    // Text span
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = todo.completed ? 'completed' : '';

    // Toggle on click
    span.addEventListener('click', () => toggleTodo(todo.id));

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(span);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

/**
 * Save todos to localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Load todos from localStorage
 */
function loadFromLocalStorage() {
  const data = localStorage.getItem('todos');
  if (data) {
    todos = JSON.parse(data);
  }
}

// Event listeners
addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Start app
init();
