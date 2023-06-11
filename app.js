//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos)
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);


//Functions
function addTodo(event){
    event.preventDefault();

    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create li
    const newtoDo = document.createElement('li');
    newtoDo.innerText = todoInput.value;
    
    newtoDo.classList.add('todo-item');
    todoDiv.appendChild(newtoDo);

    //Add todo to localStorage
    saveLocalTodos(todoInput.value);

    //Checked button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to list
    todoList.appendChild(todoDiv);

    //Clear input text
    todoInput.value = "";
    
    if(todoInput.value === ""){
        todoButton.disabled = true;
    }
}

function success() {
    if(todoInput.value==="") { 
        todoButton.disabled = true; 
       } else { 
        todoButton.disabled = false;
       }
   }


function deleteCheck(e){
    // console.log(e.target)
    const item = e.target;
    //Delete todo
    if (item.classList == "trash-btn"){
        const todo = item.parentElement;
        //Fade animation
        todo.classList.add("fade");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', () => {
            todo.remove();
        })
    }
    //Check todo
    if (item.classList == "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) { 
        const mStyle = todo.style;  
        if(mStyle != undefined && mStyle != null){
            switch (e.target.value) {
                case "all":
                    mStyle.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains('completed')) {
                        mStyle.display = 'flex';
                    } else {
                        mStyle.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (todo.classList.contains('completed')){
                        mStyle.display = 'none';
                    }
                    else{
                        mStyle.display = "flex";
                    }
                    break;
            }
        }
    })
}


function saveLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos(){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){

        const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create li
    const newtoDo = document.createElement('li');
    newtoDo.innerText = todo;
    
    newtoDo.classList.add('todo-item');
    todoDiv.appendChild(newtoDo);

    //Checked button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to list
    todoList.appendChild(todoDiv);

    })
}

function removeLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
// localStorage.clear()

//Pomodoro Timer
let workTime = 25; // in minutes
let breakTime = 5; // in minutes

let timerElement = document.getElementById('timer');
let statusElement = document.getElementById('status');
let chimeAudio = new Audio('chime-sound-7143.mp3');

let isWorkTime = true;
let timeLeft = workTime * 60; // converting to seconds
let timerInterval = null;

document.getElementById('pause-button').addEventListener('click', pauseTimer);

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStatusDisplay() {
    if (timerInterval !== null) {
        statusElement.textContent = isWorkTime ? 'Working' : 'Having a break';
    } else {
        statusElement.textContent = '';
    }
}

function showNotification(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

function switchTimer() {
    isWorkTime = !isWorkTime;
    timeLeft = (isWorkTime ? workTime : breakTime) * 60;
    updateStatusDisplay();

    if (isWorkTime) {
        showNotification('Work time started!');
    } else {
        showNotification('Break time started!');
    }

    chimeAudio.play();
}

function timerTick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        switchTimer();
    }
}

function startTimer() {
    if (timerInterval === null) {
        timerInterval = setInterval(timerTick, 1000); // 1000 milliseconds = 1 second
    }
    updateStatusDisplay();
}

function resetTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isWorkTime = true;
    timeLeft = workTime * 60;
    updateTimerDisplay();
    updateStatusDisplay();
}

function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

updateStatusDisplay();
