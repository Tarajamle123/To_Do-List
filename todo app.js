
        const listContainer = document.getElementById('list-container');
        const inputBox = document.getElementById('input-box');
        const addTaskButton = document.getElementById('add-task-button');
        const clearTasksButton = document.getElementById('clear-tasks-button');

        function toggleNoTaskMessage() {
            if (listContainer.children.length === 0) {
                const noTaskItem = document.createElement('li');
                noTaskItem.textContent = 'No tasks added yet!';
                listContainer.appendChild(noTaskItem);
            } else if (listContainer.children.length > 0 && listContainer.children[0].textContent === 'No tasks added yet!') {
                listContainer.removeChild(listContainer.children[0]);
            }
        }

        function addTask() {
            const taskValue = inputBox.value.trim();
            if (taskValue === '') {
                alert('Please enter a task!');
                return;
            }

            const existingTasks = [...listContainer.children].map(task => task.textContent.trim());
            if (existingTasks.includes(taskValue)) {
                alert('This task already exists!');
                return;
            }

            const task = createTaskElement(taskValue);
            listContainer.appendChild(task);
            inputBox.value = '';
            toggleNoTaskMessage();
            saveData();
        }

        function createTaskElement(taskValue) {
            const task = document.createElement('li');
            task.textContent = taskValue;
            task.addEventListener('click', () => {
                task.classList.toggle('checked');
                saveData();
            });

            const deleteButton = document.createElement('span');
            deleteButton.textContent = "\u00d7";
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteTask(task);
            });

            task.appendChild(deleteButton);
            return task;
        }

        function deleteTask(task) {
            listContainer.removeChild(task);
            toggleNoTaskMessage();
            saveData();
        }

        function clearAllTasks() {
            if (confirm("Are you sure you want to delete all tasks?")) {
                listContainer.innerHTML = '';
                toggleNoTaskMessage();
                saveData();
            }
        }

        function saveData() {
            const tasks = [...listContainer.children].map(task => task.outerHTML).join('');
            localStorage.setItem("todoListData", tasks);
        }

        function loadTasks() {
            const tasks = localStorage.getItem("todoListData");
            if (tasks) {
                listContainer.innerHTML = tasks;
                Array.from(listContainer.children).forEach(task => {
                    task.addEventListener('click', () => {
                        task.classList.toggle('checked');
                        saveData();
                    });
                    const deleteButton = task.querySelector('span');
                    if (deleteButton) {
                        deleteButton.addEventListener('click', (event) => {
                            event.stopPropagation();
                            deleteTask(task);
                        });
                    }
                });
            }
            toggleNoTaskMessage();
        }

        addTaskButton.addEventListener('click', addTask);
        clearTasksButton.addEventListener('click', clearAllTasks);
        inputBox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                addTask();
            }
        });

        loadTasks();