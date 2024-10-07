document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const adminDashboard = document.getElementById("admin-dashboard");
    const employeeDashboard = document.getElementById("employee-dashboard");

    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const employeeTaskList = document.getElementById("employeeTaskList");

    const employeeSelect = document.getElementById("employeeSelect");

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let loggedInUser = null; 
    let userRole = null; 

    const renderTasks = () => {
        taskList.innerHTML = "";
        employeeTaskList.innerHTML = "";

        tasks.forEach((task, index) => {
            if (userRole === 'admin') {
                const li = document.createElement("li");
                li.textContent = `${task.name} (Assigned to: ${task.assignedTo})`;
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.onclick = () => deleteTask(index);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            }

            if (userRole === 'employee' && loggedInUser === task.assignedTo) {
                const empLi = document.createElement("li");
                empLi.textContent = task.name;
                
                const doneBtn = document.createElement("button");
                doneBtn.textContent = task.done ? "Undo" : "Done"; 
                doneBtn.onclick = () => toggleTaskDone(index);
                empLi.appendChild(doneBtn);
                
                if (task.done) {
                    empLi.style.textDecoration = "line-through"; 
                    empLi.style.color = "gray"; 
                }

                employeeTaskList.appendChild(empLi);
            }
        });
    };

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTask = document.getElementById("newTask").value;
        const assignedTo = employeeSelect.value;
        tasks.push({ name: newTask, assignedTo: assignedTo, done: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById("newTask").value = "";
        renderTasks();
    });

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const toggleTaskDone = (index) => {
        tasks[index].done = !tasks[index].done; 
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const role = document.getElementById("role").value;
        const username = document.getElementById("username").value;
        loggedInUser = username; 
        userRole = role; 
        loginPage.classList.add("hidden");

        if (role === "admin") {
            adminDashboard.classList.remove("hidden");
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
        } else if (role === "employee") {
            employeeDashboard.classList.remove("hidden");
            document.body.style.backgroundColor = "#f4f4f4"; 
            document.body.style.color = "black"; 
        }

        renderTasks(); 
    });

    const logoutButtons = document.querySelectorAll(".logout-btn");
    logoutButtons.forEach(button => {
        button.addEventListener("click", () => {
            loginPage.classList.remove("hidden");
            adminDashboard.classList.add("hidden");
            employeeDashboard.classList.add("hidden");

            document.body.style.backgroundColor = "#f4f4f4";
            document.body.style.color = "black";

            loggedInUser = null;
            userRole = null;
        });
    });

    renderTasks();
});
