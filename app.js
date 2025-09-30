let students = JSON.parse(localStorage.getItem("students")) || ["Alice","Bob","Charlie"];
let outStudents = JSON.parse(localStorage.getItem("outStudents")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];
let customTitle = localStorage.getItem("customTitle") || "Classroom Sign-Out Tracker";

const studentSelect = document.getElementById("studentSelect");
const leaveBtn = document.getElementById("leaveBtn");
const viewLogBtn = document.getElementById("viewLogBtn");
const adminBtn = document.getElementById("adminBtn");
const outList = document.getElementById("outList");
const instructions = document.getElementById("instructions");
const logView = document.getElementById("logView");
const logTableBody = document.querySelector("#logTable tbody");
const closeLogBtn = document.getElementById("closeLogBtn");
const adminPanel = document.getElementById("adminPanel");
const addStudentBtn = document.getElementById("addStudentBtn");
const removeStudentBtn = document.getElementById("removeStudentBtn");
const clearLogBtn = document.getElementById("clearLogBtn");
const changeTitleBtn = document.getElementById("changeTitleBtn");
const closeAdminBtn = document.getElementById("closeAdminBtn");
const mainTitle = document.getElementById("mainTitle");

mainTitle.textContent = customTitle;

function renderStudents() {
  studentSelect.innerHTML = "";
  students.forEach(name => {
    let opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    studentSelect.appendChild(opt);
  });
}
renderStudents();

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("outStudents", JSON.stringify(outStudents));
  localStorage.setItem("logs", JSON.stringify(logs));
  localStorage.setItem("customTitle", mainTitle.textContent);
}

function renderOutList() {
  outList.innerHTML = "";
  if(outStudents.length > 0){
    instructions.textContent = "Click your name when you return.";
  } else {
    instructions.textContent = "";
  }
  outStudents.forEach(out => {
    let li = document.createElement("li");
    li.textContent = out.name + " (Left at " + out.leave + ")";
    li.addEventListener("click", () => {
      if(confirm("Are you " + out.name + "? Confirm to return.")){
        let idx = logs.findIndex(l => l.name === out.name && !l.return);
        if(idx > -1){
          logs[idx].return = new Date().toLocaleTimeString();
        }
        outStudents = outStudents.filter(s => s.name !== out.name);
        saveData();
        renderOutList();
      }
    });
    outList.appendChild(li);
  });
}
renderOutList();

leaveBtn.addEventListener("click", () => {
  if(outStudents.length >= 2){
    alert("Only 2 students can be out at once.");
    return;
  }
  const name = studentSelect.value;
  if(outStudents.some(s => s.name === name)){
    alert(name + " is already out.");
    return;
  }
  const leaveTime = new Date().toLocaleTimeString();
  outStudents.push({name: name, leave: leaveTime});
  logs.push({name: name, leave: leaveTime, return: null});
  saveData();
  renderOutList();
});

viewLogBtn.addEventListener("click", () => {
  logTableBody.innerHTML = "";
  logs.forEach(l => {
    let row = document.createElement("tr");
    row.innerHTML = `<td>${l.name}</td><td>${l.leave}</td><td>${l.return || ""}</td>`;
    logTableBody.appendChild(row);
  });
  logView.style.display = "block";
});

closeLogBtn.addEventListener("click", () => {
  logView.style.display = "none";
});

adminBtn.addEventListener("click", () => {
  const pw = prompt("Enter admin password:");
  if(pw === "2473"){
    adminPanel.style.display = "block";
  } else {
    alert("Incorrect password");
  }
});

addStudentBtn.addEventListener("click", () => {
  const newName = prompt("Enter new student name:");
  if(newName && !students.includes(newName)){
    students.push(newName);
    saveData();
    renderStudents();
    alert(newName + " added.");
  }
});

removeStudentBtn.addEventListener("click", () => {
  const name = prompt("Enter the name to remove:");
  if(name && students.includes(name)){
    students = students.filter(s => s !== name);
    outStudents = outStudents.filter(s => s.name !== name);
    logs = logs.filter(l => l.name !== name);
    saveData();
    renderStudents();
    renderOutList();
    alert(name + " removed.");
  }
});

clearLogBtn.addEventListener("click", () => {
  if(confirm("Clear all logs?")){
    logs = [];
    saveData();
    alert("Logs cleared.");
  }
});

changeTitleBtn.addEventListener("click", () => {
  const newTitle = prompt("Enter new title for the app:", mainTitle.textContent);
  if(newTitle){
    mainTitle.textContent = newTitle;
    saveData();
  }
});

closeAdminBtn.addEventListener("click", () => {
  adminPanel.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  renderOutList();
});
