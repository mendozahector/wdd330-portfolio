
// [{ id : timestamp, content: string, completed: bool } ]
let todoItems = []

function updateUI() {
    

    const totalTasks = todoItems.length;

    if (totalTasks >= 1) {
        console.log(todoItems)
        document.getElementById("total-tasks").innerHTML = "Please add a task";
    } else {
        document.getElementById("all-button").remove();
        document.getElementById("active-button").remove();
        document.getElementById("completed-button").remove();
        document.getElementById("total-tasks").innerHTML = "Please add a task &#128071 &#128221 &#128526";
    }
}

function createTodoList() {
    console.log("creating list");
}


function addItem() {
    const newItem = document.getElementById("todo-item").value;

    if (newItem && newItem.length < 50) {
        const todoItem = {"id": Date.now(), "content": newItem, "completed": false};
        todoItems.push(todoItem);
        createTodoList();
        updateUI();
    }
}

updateUI();