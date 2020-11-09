let serverContainer = document.getElementById("serversContainer");
let taskContainer = document.getElementById("tasksContainer");
let addServer = document.getElementById("addServer");
let deleteServer = document.getElementById("deleteServer");
let totalTasks = document.getElementById("Tasks");
let tasks = [];
let serverList = [];

const addServerInList = () => {
  deleteServer.disabled = false;
  if (serverList.length >= 10) return;
  serverList.push({
    id: `Server${serverList.length}`,
    content: `Server ${serverList.length + 1}`,
    isBusy: false
  });

  let server = document.createElement("div");
  server.setAttribute("id", `Server${serverList.length - 1}`);
  server.setAttribute("class", "server");
  server.innerHTML = `${serverList[serverList.length - 1].content}`;
  serverContainer.appendChild(server);
  if (serverList.length >= 10) {
    addServer.disabled = true;
  }
};

const deleteServerFromList = () => {
  addServer.disabled = false;
  if (serverList.length <= 1) return;

  let servers = document.getElementsByClassName("server");
  if (serverList[servers.length - 1].isBusy) return;

  servers[servers.length - 1].remove();
  serverList.pop();

  if (serverList.length <= 1) {
    deleteServer.disabled = true;
  }
};

const addTasksInList = () => {
  let count = totalTasks.value;
  for (let i = 0; i < count; i++) {
    let taskObject = {
      id: `Task${tasks.length}`,
      content: `Task ${tasks.length + 1}`,
      isRunning: false
    };
    tasks.push(taskObject);
    let task = document.createElement("div");
    task.setAttribute("class", "tasks");
    task.setAttribute("id", `${taskObject.id}`);
    task.innerHTML = `${taskObject.content}`;
    let taskId = `${taskObject.id}`;
    task.innerHTML += `<button class="deleteButton" onclick='deleteTaskFromList(${taskId})'>Delete</button>`;
    taskContainer.appendChild(task);
  }
};

const deleteTaskFromList = (task) => {
  let taskToBeDeleted = document.getElementById(task.id);
  tasks = tasks.filter((t) => t.id !== task.id);
  taskToBeDeleted.remove();
};

const initialServerList = () => {
  serverList.push({
    id: "Server0",
    content: `Server ${serverList.length + 1}`,
    isBusy: false
  });
  let server = document.createElement("div");
  server.setAttribute("class", "server");
  server.setAttribute("id", `Server${serverList.length - 1}`);
  server.innerHTML = `${serverList[serverList.length - 1].content}`;
  serverContainer.appendChild(server);
};
const checkForAvailableServer = () => {
  for (let i = 0; i < serverList.length; i++) {
    if (!serverList[i].isBusy) {
      assignTaskToServer(i);
    }
  }
};

const progressUpdation = (task) => {
  var elements = task.getElementsByClassName("myprogressBar");
  var width = 1;
  var id = setInterval(display, 200);
  function display() {
    for (let i = 0; i < elements.length; i++)
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elements[i].style.width = width + "%";
        elements[i].innerHTML = width * 1 + "%";
      }
  }
};

const assignTaskToServer = (index) => {
  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].isRunning) {
      let runningTask = document.getElementsByClassName("tasks");
      runningTask[i].setAttribute("running", true);
      runningTask[i].innerHTML += `<div class="progress"> 
                            <div class="myprogressBar">0%</div> 
                              </div> `;
      progressUpdation(runningTask[i]);
      runningTask[i].getElementsByTagName("button")[0].disabled = true;

      serverList[index].isBusy = true;
      serverList[index].content = tasks[i].content;
      document.getElementById(
        `Server${index}`
      ).innerHTML = `${tasks[i].content}`;
      tasks[i].isRunning = true;
      setTimeout(() => removeServer(index, runningTask[i]), 20000);
      break;
    }
  }
};

const deleteTask = (task) => {
  let list = document.querySelectorAll('[running="true"]');
  for (let i = 0; i < list.length; i++) {
    if (
      list[i].getElementsByClassName("myprogressBar")[0].innerHTML === "100%"
    ) {
      list[i].parentNode.removeChild(list[i]);
      tasks.shift();
    }
  }
};
const removeServer = (indexOfTask, taskId) => {
  serverList[indexOfTask].isBusy = false;
  serverList[indexOfTask].content = `Server ${serverList.length + 1}`;
  document.getElementById(`Server${indexOfTask}`).innerHTML = `Server ${
    indexOfTask + 1
  }`;
  deleteTask(taskId);
};
initialServerList();
setInterval(checkForAvailableServer, 1000);
