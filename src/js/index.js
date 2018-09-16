import "../sass/style.sass";

let todolist = {}; // todolist object
let demoTasks = {}; // demo object
let id = 0; // unique ID for task

// load todolist from localStorage
function loadTodolistFromStorage() {
  if (localStorage.getItem("todolist") != undefined) {
    todolist = JSON.parse(localStorage.getItem("todolist"));
    id = Object.keys(todolist).length; // update unique ID for task
    // draw all tasks
    for (let key in todolist) {
      drawTodolist(todolist, key);
    }
    // draw projects filter
    drawProjectsFilter(todolist);
  }
}
loadTodolistFromStorage();

function addDemoTask() {
  fetch("http://deco-creative.com.ua/demoTasks.json")
    .then(response => response.json())
    // .then(json => console.log(json))
    .then(data => {
      // clear current HTML todolist
      document.querySelector(".todo__list").innerHTML = "";
      // draw demo tasks
      for (let key in data) {
        drawTodolist(data, key);
      }
      // draw demo projects filter
      drawProjectsFilter(data);
      demoTasks = data; // write data
    });
}

document.querySelector("#demoTasks").addEventListener("click", function() {
  addDemoTask();
});

// FUNCTION DRAW PROJECTS FILTER
function drawProjectsFilter(obj) {
  let uniqueFilters = new Set();
  for (let key in obj) {
    let value = obj[key].taskProject;
    uniqueFilters.add(value);
  }
  let projectsFilter = document.querySelector(".todo__filter-projects");
  projectsFilter.options.length = 0; // reset select
  let allOption = document.createElement("option");
  // add "All" selector
  allOption.value = "0";
  allOption.text = "Все";
  projectsFilter.add(allOption);
  // create new options
  uniqueFilters.forEach(value => {
    let option = document.createElement("option");
    option.value = value;
    option.text = value;
    projectsFilter.add(option);
  });
}

// FUNCTION DRAW TODOLIST
function drawTodolist(obj, id) {
  // create todolist wrapper
  let task = document.createElement("div");
  task.className = "todo__item todo-item";
  task.setAttribute("data-id", id);

  // add todolist title
  let taskTitle = document.createElement("h4");
  taskTitle.className = "todo-item__title";
  taskTitle.innerHTML = obj[id]["taskTitle"];

  // add project and priority wrapper
  let projectPriorityWrapper = document.createElement("div");
  projectPriorityWrapper.className = "row";

  // add todolist project
  let taskProject = document.createElement("div");
  taskProject.className = "todo-item__project";
  taskProject.innerHTML = `<span class="todo-item__label">Проект:</span><span class="todo-item-element__content">${
    obj[id]["taskProject"]
  }</span>`;

  // add todolist priority
  let taskPriority = document.createElement("div");
  taskPriority.className = "todo-item__priority";
  taskPriority.innerHTML = `<span class="todo-item__label">Приоритет:</span><span class="todo-item-element__content">${
    obj[id]["taskPriority"]
  }</span>`;

  // render project and priority
  projectPriorityWrapper.appendChild(taskProject);
  projectPriorityWrapper.appendChild(taskPriority);

  // add todolist description
  let taskText = document.createElement("div");
  taskText.className = "todo-item__text slide-up";
  taskText.innerHTML = obj[id]["taskText"];

  // add buttons wrapper
  let buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "todo-item__control-panel row";

  // add edit button
  let buttonEdit = document.createElement("button");
  buttonEdit.className = "todo-item__edit";
  buttonEdit.setAttribute("data-id", id);
  buttonEdit.innerHTML = "Изменить";
  buttonEdit.onclick = editTask;

  // add remove button
  let buttonRemove = document.createElement("button");
  buttonRemove.className = "todo-item__remove";
  buttonRemove.setAttribute("data-id", id);
  buttonRemove.innerHTML = "Закрыть";
  buttonRemove.onclick = removeTask;

  // add text toggle button
  let buttonToggle = document.createElement("button");
  buttonToggle.className = "todo-item__toggle";
  buttonToggle.setAttribute("data-id", id);
  buttonToggle.innerHTML = "Развернуть";
  buttonToggle.onclick = toggleTask;

  // render buttons
  buttonsWrapper.appendChild(buttonEdit);
  buttonsWrapper.appendChild(buttonRemove);
  buttonsWrapper.appendChild(buttonToggle);

  // render task
  task.appendChild(taskTitle);
  task.appendChild(projectPriorityWrapper);
  task.appendChild(taskText);
  task.appendChild(buttonsWrapper);

  document.querySelector(".todo__list").appendChild(task); // add new task in HTML
}

function editTask() {
  let currentID = this.getAttribute("data-id");

  document.querySelector(".todo__form_item_title").value =
    todolist[currentID]["taskTitle"];
  document.querySelector(".todo__form_item_project").value =
    todolist[currentID]["taskProject"];
  document.querySelector(".todo__form_item_priority").value =
    todolist[currentID]["taskPriority"];
  document.querySelector(".todo__form_item_text").value =
    todolist[currentID]["taskText"];

  document
    .querySelector(".todo__form_btn_submit")
    .setAttribute("data-id", currentID);

  showForm();
}

function removeTask() {
  let currentID = this.getAttribute("data-id");
  let parent = document.querySelector(`.todo-item[data-id="${currentID}"]`);
  parent.remove(); // remove HTML
  delete todolist[currentID];
  localStorage.setItem("todolist", JSON.stringify(todolist)); // save todolist to localStorage
}

function toggleTask() {
  let currentID = this.getAttribute("data-id");
  let currentBtn = document.querySelector(
    `.todo-item[data-id="${currentID}"] .todo-item__toggle`
  );
  let currentText = document.querySelector(
    `.todo-item[data-id="${currentID}"] .todo-item__text`
  );
  // animate toggle
  if (!currentText.classList.contains("slide-down")) {
    currentBtn.innerHTML = "Cвернуть";
    currentText.style.maxHeight = currentText.scrollHeight + "px";
    currentText.classList.add("slide-down");
  } else {
    currentBtn.innerHTML = "Развернуть";
    currentText.style.maxHeight = 0;
    currentText.classList.remove("slide-down");
  }
}

function todolistFormHandler() {
  let submitBtn = document.querySelector(".todo__form_btn_submit"); // get submit button
  let dataID = submitBtn.getAttribute("data-id"); // get dataID of submit button
  // get data from inputs
  let taskTitle = document.querySelector(".todo__form_item_title").value;
  let taskProject = document.querySelector(".todo__form_item_project").value;
  let taskPriority = document.querySelector(".todo__form_item_priority").value;
  let taskText = document.querySelector(".todo__form_item_text").value;
  // check submit button state
  if (dataID == undefined) {
    // if undefined than add new task

    id++; // counter increment

    let task = {}; // create new task object
    task.id = id;
    task.taskTitle = taskTitle;
    task.taskProject = taskProject;
    task.taskPriority = taskPriority;
    task.taskText = taskText;

    todolist[id] = task; // add new task to todolist object
    drawTodolist(todolist, id);
    drawProjectsFilter(todolist);
  } else {
    // if dataID is set edit data in global todolist object and edit existing HTML tasl by ID
    todolist[dataID].taskTitle = taskTitle;
    document.querySelector(
      `.todo-item[data-id="${dataID}"] .todo-item__title`
    ).innerHTML = taskTitle;
    todolist[dataID].taskProject = taskProject;
    console.log(taskProject);
    document.querySelector(
      `.todo-item[data-id="${dataID}"] .todo-item__project .todo-item-element__content`
    ).innerHTML = taskProject;
    todolist[dataID].taskPriority = taskPriority;
    document.querySelector(
      `.todo-item[data-id="${dataID}"] .todo-item__priority .todo-item-element__content`
    ).innerHTML = taskPriority;
    todolist[dataID].taskText = taskText;
    document.querySelector(
      `.todo-item[data-id="${dataID}"] .todo-item__text`
    ).innerHTML = taskText;
  }

  localStorage.setItem("todolist", JSON.stringify(todolist)); // save todolist to localStorage
}

function showForm() {
  document.querySelector(".todo__control-panel").classList.add("hidden"); // hide control panel
  document.querySelector(".todo__form").classList.remove("hidden"); // show edit form
}
function hideForm() {
  document.querySelector(".todo__form").classList.add("hidden"); // hide edit form
  document.querySelector(".todo__control-panel").classList.remove("hidden"); // show control panel
}

// show form when clicked "New task" and hide control panel
document.querySelector(".todo__add").addEventListener("click", function() {
  showForm();
});

// PRIORITY SORT
function todolistSort(type) {
  let list, i, switching, b, currentValue, nextValue, shouldSwitch;
  list = document.querySelector(".todo__list");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    b = list.querySelectorAll(".todo-item");
    //Loop through all list-items:
    for (i = 0; i < b.length - 1; i++) {
      // check sort argument
      if (type == "priority") {
        currentValue = b[i].querySelector(
          ".todo-item__priority .todo-item-element__content"
        ).innerHTML;
        nextValue = b[i + 1].querySelector(
          ".todo-item__priority .todo-item-element__content"
        ).innerHTML;
      } else {
        currentValue = b[i].getAttribute("data-id");
        nextValue = b[i + 1].getAttribute("data-id");
      }

      //start by saying there should be no switching:
      shouldSwitch = false;
      /*check if the next item should
      switch place with the current item:*/
      if (currentValue > nextValue) {
        /*if next item is alphabetically
        lower than current item, mark as a switch
        and break the loop:*/
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark the switch as done:*/
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}
document
  .querySelector("#todo__sort-priority")
  .addEventListener("change", function() {
    if (this.checked) {
      todolistSort("priority");
    } else {
      todolistSort("order");
    }
  });

// PROJECTS FILTER
function filterProjects(obj, keyword) {
  let value = keyword;
  let HTMLTasks = document.querySelectorAll(".todo-item"); // get all tasks in HTML code
  // check selected value
  if (value == 0) {
    // if "All selection" - show all task
    [].forEach.call(HTMLTasks, function(el) {
      el.classList.remove("hidden"); // show all tasks in HTML code
    });
  } else {
    // search filter value in todolist object
    for (let key in obj) {
      let taskProject = obj[key]["taskProject"];
      // check filter value in tasks
      if (taskProject == value) {
        let searchedProjects = document.querySelectorAll(
          `.todo-item[data-id="${key}"]`
        );
        [].forEach.call(searchedProjects, function(el) {
          el.classList.remove("hidden"); // show filtered tasks
        });
      } else {
        let searchedProjects = document.querySelectorAll(
          `.todo-item[data-id="${key}"]`
        );
        [].forEach.call(searchedProjects, function(el) {
          el.classList.add("hidden"); // hide tasks that doesn't match
        });
      }
    }
  }
}
document
  .querySelector(".todo__filter-projects")
  .addEventListener("change", function() {
    let value = this.value;
    if (Object.keys(demoTasks).length === 0) {
      filterProjects(todolist, value);
    } else {
      filterProjects(demoTasks, value);
    }
  });

// form validation function
function formValidation() {
  let inputs = document.querySelectorAll(".todo__form input[type=text]");
  let textarea = document.querySelector("textarea");
  let state;
  // check inputs
  [].forEach.call(inputs, function(el) {
    let value = el.value;
    if (value == "") {
      el.parentElement.classList.add("todo-form-input-wrapper_invalid");
      state = false;
    } else {
      el.parentElement.classList.remove("todo-form-input-wrapper_invalid");
      state = true;
    }
  });
  // check textarea
  if (textarea.value != "" && state == true) {
    textarea.parentElement.classList.remove("todo-form-input-wrapper_invalid");
    state = true;
  } else if (textarea.value != "" && state == false) {
    textarea.parentElement.classList.remove("todo-form-input-wrapper_invalid");
    state = false;
  } else {
    textarea.parentElement.classList.add("todo-form-input-wrapper_invalid");
    state = false;
  }
  return state;
}

// save button click
document
  .querySelector(".todo__form_btn_submit")
  .addEventListener("click", function(e) {
    e.preventDefault();
    if (formValidation() == true) {
      todolistFormHandler();
      hideForm();
      // clear form
      document.querySelector(".todo__form").reset(); // clear form inputs
    }
  });

// hide form when clicked "Cancel" button and show control panel
document
  .querySelector(".todo__form_btn_cancel")
  .addEventListener("click", function(e) {
    e.preventDefault();
    hideForm();
  });
