
// [{ id : timestamp, content: string, completed: bool } ]
let todoItems = []
let activeItems = "All"

function show(type) {
    activeItems = type
}

function deleteTask(i) {
    todoItems.splice(i,1);
    updateUI();
}

function updateUI() {

    const totalTasks = todoItems.length;
    const toolButtons = {"all-button": "All", "active-button": "Active", "completed-button": "Completed"}

    if (totalTasks >= 1) {
        document.getElementById("total-tasks").innerHTML = totalTasks == 1 ? "1 task left" : `${totalTasks} tasks left`;
        
        const todoTools = document.getElementById("todo-tools");
        if (todoTools.childElementCount <= 1) {
            for (const [key, value] of Object.entries(toolButtons)) {
                const button = document.createElement("button");
                button.id = key
                button.innerHTML = value
                // button.addEventListener('click', function(){
                //     show(value);
                // });
                todoTools.appendChild(button);
              }
        }
        
    } else {
        for (const [key, _] of Object.entries(toolButtons)) {
            document.getElementById(key).remove();
          }
        document.getElementById("total-tasks").innerHTML = "Please add a task &#128071 &#128221 &#128526";
    }

    todoListHtml = document.getElementById("todo-list");
    todoListHtml.textContent = "";
    todoItems.forEach(item => {
        const i = todoListHtml.childElementCount;
        const li = document.createElement("li");
        li.innerHTML = item["content"];
        const b = document.createElement("button");
        b.innerHTML = "&#10060";
        b.addEventListener('click', function(){
            deleteTask(i);
        });
        li.appendChild(b);
        todoListHtml.appendChild(li);
    });
}

function addItem() {
    const newItem = document.getElementById("todo-item");
    const task = newItem.value;
    if (task && task.length < 50) {
        const todoItem = {"id": Date.now(), "content": task, "completed": false};
        todoItems.push(todoItem);
        updateUI();
    }

    newItem.value = "";
}

updateUI();