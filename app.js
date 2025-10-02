
const studentSelect = document.getElementById('studentSelect');
const leaveBtn = document.getElementById('leaveBtn');
const outList = document.getElementById('outList');
const viewLogBtn = document.getElementById('viewLogBtn');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const addStudentBtn = document.getElementById('addStudentBtn');
const removeStudentBtn = document.getElementById('removeStudentBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const editTitleBtn = document.getElementById('editTitleBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const logPanel = document.getElementById('logPanel');
const logList = document.getElementById('logList');
const closeLogBtn = document.getElementById('closeLogBtn');
const pageTitle = document.getElementById('pageTitle');

let students = JSON.parse(localStorage.getItem('students')) || ['Alice','Bob','Charlie'];
let outStudents = JSON.parse(localStorage.getItem('outStudents')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];

function save(){ localStorage.setItem('students', JSON.stringify(students)); localStorage.setItem('outStudents', JSON.stringify(outStudents)); localStorage.setItem('logs', JSON.stringify(logs)); localStorage.setItem('pageTitle', pageTitle.textContent); }

function renderStudents(){ studentSelect.innerHTML = students.map(s=>`<option value="${s}">${s}</option>`).join(''); }
function renderOut(){ if(outStudents.length===0){ outList.textContent='No one is out'; return; } outList.innerHTML = outStudents.map(n=>`<button class="btn outBtn" onclick="attemptReturn('${n}')">${n}</button>`).join(' '); }

leaveBtn.onclick = ()=>{
    const name = studentSelect.value;
    if(!name) return;

    if(outStudents.includes(name)){
        alert(name+' is already out');
        return;
    }

    if(outStudents.length >= 2){  // <-- limit check
        alert('Only 2 students can be out at the same time.');
        return;
    }

    const t = new Date().toLocaleTimeString();
    outStudents.push(name);
    logs.push({name, leave: t, return: null});
    save();
    renderOut();
};

window.attemptReturn = function(name){ if(confirm('Are you '+name+'? Confirm to return.')){ const t=new Date().toLocaleTimeString(); const entry = logs.find(l=>l.name===name && !l.return); if(entry) entry.return=t; outStudents = outStudents.filter(n=>n!==name); save(); renderOut(); } };

viewLogBtn.onclick = ()=>{ logList.innerHTML = logs.map(l=>`<li>${l.name} left at ${l.leave}${l.return? ', returned at '+l.return: ''}</li>`).join(''); logPanel.classList.remove('hidden'); };
closeLogBtn.onclick = ()=> logPanel.classList.add('hidden');

adminBtn.onclick = ()=>{ const pw = prompt('Enter admin password:'); if(pw==='2473'){ adminPanel.classList.remove('hidden'); } else alert('Incorrect password'); };
closeAdminBtn.onclick = ()=> adminPanel.classList.add('hidden');

addStudentBtn.onclick = ()=>{ const name = prompt('New student name:'); if(name && !students.includes(name)){ students.push(name); save(); renderStudents(); } };
removeStudentBtn.onclick = ()=>{ const name = prompt('Name to remove:'); students = students.filter(s=>s!==name); outStudents = outStudents.filter(s=>s!==name); logs = logs.filter(l=>l.name!==name); save(); renderStudents(); renderOut(); };
clearLogBtn.onclick = ()=>{ if(confirm('Clear all logs?')){ logs=[]; outStudents=[]; save(); renderOut(); } };
editTitleBtn.onclick = ()=>{ const t = prompt('Enter new title:', pageTitle.textContent); if(t){ pageTitle.textContent = t; save(); } };

window.onload = ()=>{ const stored = localStorage.getItem('pageTitle'); if(stored) pageTitle.textContent=stored; renderStudents(); renderOut(); };
