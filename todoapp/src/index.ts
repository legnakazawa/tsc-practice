// DOM要素の取得
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const addButton = document.getElementById('add-button') as HTMLButtonElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;

// nullチェックを追加する方がより安全です
if (!todoInput || !addButton || !todoList) {
  throw new Error("必要なDOM要素が見つかりません。");
}

// ToDoアイテムの型定義
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// ToDoリストを格納する配列
let todos: TodoItem[] = [];

// ローカルストレージからToDoリストを取得する関数
function loadTodos(): void {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        try {
            todos = JSON.parse(storedTodos);
        } catch (error) {
            console.error('ToDoリストのデータが壊れています。', error);
            todos = [];
        }
    }
}

// ローカルストレージにToDoリストを保存する関数
function saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(todos));
}
    

// ToDoリストをレンダリングする関数
function renderTodos(): void {
    // リストをクリア
    todoList.innerHTML = '';

    // 各ToDoアイテムをレンダリング
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.text;
        listItem.dataset.id = todo.id.toString();

        if (todo.completed) {
            listItem.classList.add('completed');
        }

        // チェックボックスを追加
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            toggleComplete(todo.id);
        });

        // 削除ボタンを追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            deleteTodo(todo.id);
        });

        listItem.prepend(checkbox);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    });
}

// 新しいToDoを追加する関数
function addTodo(): void {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('ToDoを入力してください');
        return;
    }

    const newTodo: TodoItem = {
        id: Date.now(),
        text,
        completed: false,
    };

    todos.push(newTodo);
    saveTodos();
    todoInput.value = '';
    renderTodos();
}

// 完了状態を切り替える関数
function toggleComplete(id: number): void {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {...todo, completed: !todo.completed};
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// ToDoを削除する関数
function deleteTodo(id: number): void {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// イベントリスナーの設定
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (event) => {
    if ((event as KeyboardEvent).key === 'Enter') {
        addTodo();
    }
});

// 初期化
loadTodos();
renderTodos();





