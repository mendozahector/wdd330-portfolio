
// [{ id : timestamp, content: string, completed: bool } ]
let todoItems = JSON.parse(localStorage.getItem("todoItems")) ? JSON.parse(localStorage.getItem("todoItems")) : [];
let activeItems = "All";

function show(type) {
    activeItems = type;
    updateUI();
}

function deleteTask(i) {
    todoItems.splice(i,1);
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function checkTask(i) {
    todoItems[i]["completed"] = !todoItems[i]["completed"];
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function updateUI() {
    todoListHtml = document.getElementById("todo-list");
    todoListHtml.textContent = "";
    let i = 0;
    todoItems.forEach(item => {
        if (activeItems == "All" ||
           (activeItems == "Active" && item["completed"] == false) ||
           (activeItems == "Completed" && item["completed"] == true)) {
            const li = document.createElement("li");
            li.innerHTML = item["content"];
            li.value = i;
            if (item["completed"] == true) {
                li.classList.add("completed");
            }
            const b = document.createElement("button");
            b.innerHTML = "&#10060";
            b.value = i;
            li.appendChild(b);
            todoListHtml.appendChild(li);
        }
        i += 1;
    });

    const totalTasks = todoListHtml.childElementCount;
    const toolButtons = {"all-button": "All", "active-button": "Active", "completed-button": "Completed"};
    const todoTools = document.getElementById("todo-tools");

    if (totalTasks >= 1) {
        let message = "";
        if (activeItems == "Completed") {
            message = totalTasks == 1 ? "1 task completed" : `${totalTasks} tasks completed`;
        } else {
            message = totalTasks == 1 ? "1 task left" : `${totalTasks} tasks left`;
        }

        document.getElementById("total-tasks").innerHTML = message;
        
        if (todoTools.childElementCount < 2) {
            for (const [key, value] of Object.entries(toolButtons)) {
                const button = document.createElement("button");
                button.id = key;
                button.classList.add("tool-button");
                button.innerHTML = value;
                button.addEventListener('click', function(){
                    show(value);
                });
                todoTools.appendChild(button);
              }
        }
        
    } else {
        console.log(todoTools.childElementCount)
        if (activeItems == "All" || todoItems.length < 1) {
            if (todoTools.childElementCount >= 2) {
                for (const [key, _] of Object.entries(toolButtons)) {
                    document.getElementById(key).remove();
                  }
            }
            document.getElementById("total-tasks").innerHTML = "Please add a task &#128071 &#128221 &#128526";
        } else {
            const message = activeItems == "Active" ? "No active tasks &#128526" : "No completed tasks! Get to work! &#128170";
            document.getElementById("total-tasks").innerHTML = message;
        }
        
    }
}

function addItem() {
    const newItem = document.getElementById("todo-item");
    const task = newItem.value;
    if (task && task.length < 50) {
        const todoItem = {"id": Date.now(), "content": task, "completed": false};
        todoItems.push(todoItem);
        localStorage.setItem("todoItems", JSON.stringify(todoItems));
        updateUI();
    }

    newItem.value = "";
}

updateUI();

const taskInputHtml = document.getElementById("todo-item");
taskInputHtml.addEventListener("keypress",function (event) {
    if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById("add-task").click();
    }
});

const list = document.querySelector("ol");
list.addEventListener("click", function(ev) {
    const tagName = ev.target.tagName;
    const i = ev.target.value;

    if (tagName == "LI") {
        checkTask(i);
    } else if (tagName == "BUTTON") {
        deleteTask(i);
    }

    updateUI();
});