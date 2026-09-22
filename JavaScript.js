/* =============================================================
   Student Attendance Management - Version 1.4
   PART 1/7 : Storage keys, State, DOM refs, Helpers
   ============================================================= */

const STORAGE_KEYS = {
  TEACHERS:    'attendance_teachers',
  SESSION:     'attendance_session',
  THEME:       'attendance_theme',
  CLASSES:     'attendance_classes',
  CURRENT_CLASS: 'attendance_current_class',
  CLASS_DATA_PREFIX: 'attendance_classdata_'
};

let currentTeacher = null;
let currentClass = null;
let students = [];
let attendance = {};

// ---------- Auth screen DOM ----------
const authScreen    = document.getElementById('authScreen');
const classScreen   = document.getElementById('classScreen');
const mainApp       = document.getElementById('mainApp');

const signinTab    = document.getElementById('signinTab');
const signupTab    = document.getElementById('signupTab');
const signinForm   = document.getElementById('signinForm');
const signupForm   = document.getElementById('signupForm');
const gotoSignup   = document.getElementById('gotoSignup');
const gotoSignin   = document.getElementById('gotoSignin');

const signinUsername = document.getElementById('signinUsername');
const signinPassword = document.getElementById('signinPassword');
const signupName     = document.getElementById('signupName');
const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');
const signupConfirm  = document.getElementById('signupConfirm');

// ---------- Class screen DOM ----------
const classScreenTeacher  = document.getElementById('classScreenTeacher');
const classListContainer  = document.getElementById('classListContainer');
const createClassBtn      = document.getElementById('createClassBtn');
const joinClassBtn        = document.getElementById('joinClassBtn');
const classLogoutBtn      = document.getElementById('classLogoutBtn');

// ---------- Main app DOM ----------
const currentClassTitle  = document.getElementById('currentClassTitle');
const teacherGreeting    = document.getElementById('teacherGreeting');
const switchClassBtn     = document.getElementById('switchClassBtn');
const logoutBtn          = document.getElementById('logoutBtn');
const classCodeDisplay   = document.getElementById('classCodeDisplay');
const copyClassCodeBtn   = document.getElementById('copyClassCodeBtn');

const dashboardSection     = document.getElementById('dashboardSection');
const addStudentSection    = document.getElementById('addStudentSection');
const studentsSection      = document.getElementById('studentsSection');
const attendanceSection    = document.getElementById('attendanceSection');
const historySection       = document.getElementById('historySection');
const monthlySection       = document.getElementById('monthlySection');
const studentDetailSection = document.getElementById('studentDetailSection');
const reportsSection       = document.getElementById('reportsSection');
const membersSection       = document.getElementById('membersSection');

const totalStudentsEl        = document.getElementById('totalStudents');
const presentStudentsEl      = document.getElementById('presentStudents');
const absentStudentsEl       = document.getElementById('absentStudents');
const attendancePercentageEl = document.getElementById('attendancePercentage');
const currentDateEl          = document.getElementById('currentDate');

const addStudentBtn     = document.getElementById('addStudentBtn');
const markAttendanceBtn = document.getElementById('markAttendanceBtn');
const viewStudentsBtn   = document.getElementById('viewStudentsBtn');
const historyBtn        = document.getElementById('historyBtn');
const monthlyBtn        = document.getElementById('monthlyBtn');
const reportsBtn        = document.getElementById('reportsBtn');
const membersBtn        = document.getElementById('membersBtn');

const addStudentForm   = document.getElementById('addStudentForm');
const addStudentTitle  = document.getElementById('addStudentTitle');
const saveStudentBtn   = document.getElementById('saveStudentBtn');
const editingStudentId = document.getElementById('editingStudentId');
const studentNameInput = document.getElementById('studentName');
const fatherNameInput  = document.getElementById('fatherName');
const rollNumberInput  = document.getElementById('rollNumber');
const studentClassInput = document.getElementById('studentClass');
const phoneNumberInput = document.getElementById('phoneNumber');

const searchInput          = document.getElementById('searchInput');
const studentListContainer = document.getElementById('studentListContainer');

const attendanceDatePicker    = document.getElementById('attendanceDatePicker');
const attendanceListContainer = document.getElementById('attendanceListContainer');
const attendanceDateDisplay   = document.getElementById('attendanceDateDisplay');

const historyContainer = document.getElementById('historyContainer');

const monthPicker              = document.getElementById('monthPicker');
const monthlySummaryContainer  = document.getElementById('monthlySummaryContainer');
const monthlyStudentsContainer = document.getElementById('monthlyStudentsContainer');

const studentDetailContainer = document.getElementById('studentDetailContainer');

const reportMonthPicker     = document.getElementById('reportMonthPicker');
const exportMonthlyCsvBtn   = document.getElementById('exportMonthlyCsvBtn');
const exportAllCsvBtn       = document.getElementById('exportAllCsvBtn');
const exportStudentsCsvBtn  = document.getElementById('exportStudentsCsvBtn');
const printMonthlyReportBtn = document.getElementById('printMonthlyReportBtn');
const backupJsonBtn         = document.getElementById('backupJsonBtn');
const printArea             = document.getElementById('printArea');

const memberClassName      = document.getElementById('memberClassName');
const memberClassCode      = document.getElementById('memberClassCode');
const memberClassOwner     = document.getElementById('memberClassOwner');
const membersListContainer = document.getElementById('membersListContainer');
const shareCodeInput       = document.getElementById('shareCodeInput');
const shareCopyBtn         = document.getElementById('shareCopyBtn');
const ownerDangerZone      = document.getElementById('ownerDangerZone');
const deleteClassBtn       = document.getElementById('deleteClassBtn');

const themeToggle    = document.getElementById('themeToggle');
const toastContainer = document.getElementById('toastContainer');

const confirmModal     = document.getElementById('confirmModal');
const confirmTitle     = document.getElementById('confirmTitle');
const confirmMessage   = document.getElementById('confirmMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

const promptModal     = document.getElementById('promptModal');
const promptTitle     = document.getElementById('promptTitle');
const promptMessage   = document.getElementById('promptMessage');
const promptInput     = document.getElementById('promptInput');
const promptCancelBtn = document.getElementById('promptCancelBtn');
const promptConfirmBtn = document.getElementById('promptConfirmBtn');

// ==================================================
// HELPERS
// ==================================================

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateKey) {
  const [y, m, d] = dateKey.split('-');
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-');
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  if (sectionId === 'dashboardSection')  updateDashboardStats();
  if (sectionId === 'studentsSection')   renderStudentList(searchInput.value.trim());
  if (sectionId === 'attendanceSection') renderAttendanceList();
  if (sectionId === 'historySection')    renderHistory();
  if (sectionId === 'monthlySection')    renderMonthlySummary();
  if (sectionId === 'reportsSection')    initReportsSection();
  if (sectionId === 'membersSection')    renderMembersSection();
}

function applyTheme() {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
}

function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showPrompt({ title, message, placeholder = '', defaultValue = '' }) {
  return new Promise(resolve => {
    promptTitle.textContent = title;
    promptMessage.textContent = message;
    promptInput.placeholder = placeholder;
    promptInput.value = defaultValue;
    promptModal.classList.add('active');
    setTimeout(() => promptInput.focus(), 100);

    const cleanup = () => {
      promptModal.classList.remove('active');
      promptConfirmBtn.removeEventListener('click', onConfirm);
      promptCancelBtn.removeEventListener('click', onCancel);
      promptInput.removeEventListener('keydown', onKey);
    };
    const onConfirm = () => {
      const val = promptInput.value.trim();
      cleanup();
      resolve(val || null);
    };
    const onCancel = () => { cleanup(); resolve(null); };
    const onKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); onConfirm(); }
      if (e.key === 'Escape') { onCancel(); }
    };
    promptConfirmBtn.addEventListener('click', onConfirm);
    promptCancelBtn.addEventListener('click', onCancel);
    promptInput.addEventListener('keydown', onKey);
  });
}
/* =============================================================
   PART 2/7 : Authentication (Sign Up, Sign In, Session)
   ============================================================= */

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '|attendance_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getAllTeachers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS)) || [];
  } catch (e) {
    return [];
  }
}

function saveAllTeachers(arr) {
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(arr));
}

async function registerTeacher(name, username, password) {
  name = name.trim();
  username = username.trim().toLowerCase();
  password = password.trim();

  if (!name || !username || !password) {
    return { success: false, message: 'All fields are required' };
  }
  if (username.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters' };
  }
  if (password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters' };
  }
  if (/\s/.test(username)) {
    return { success: false, message: 'Username cannot contain spaces' };
  }

  const teachers = getAllTeachers();
  if (teachers.some(t => t.username === username)) {
    return { success: false, message: 'Username already exists' };
  }

  const passwordHash = await hashPassword(password);
  const teacher = {
    id: 't_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name,
    username: username,
    passwordHash: passwordHash,
    createdAt: new Date().toISOString()
  };
  teachers.push(teacher);
  saveAllTeachers(teachers);

  return { success: true, teacher };
}

async function loginTeacher(username, password) {
  username = username.trim().toLowerCase();
  password = password.trim();

  if (!username || !password) {
    return { success: false, message: 'Please enter username and password' };
  }

  const teachers = getAllTeachers();
  const teacher = teachers.find(t => t.username === username);
  if (!teacher) {
    return { success: false, message: 'Teacher not found. Please sign up first.' };
  }

  const hash = await hashPassword(password);
  if (hash !== teacher.passwordHash) {
    return { success: false, message: 'Incorrect password' };
  }

  return { success: true, teacher };
}

function switchAuthTab(tab) {
  if (tab === 'signin') {
    signinTab.classList.add('active');
    signupTab.classList.remove('active');
    signinForm.style.display = 'flex';
    signupForm.style.display = 'none';
  } else {
    signupTab.classList.add('active');
    signinTab.classList.remove('active');
    signupForm.style.display = 'flex';
    signinForm.style.display = 'none';
  }
}

function startSession(teacher) {
  currentTeacher = teacher;
  localStorage.setItem(STORAGE_KEYS.SESSION, teacher.id);
  enterAfterLogin();
}

async function restoreSession() {
  const teacherId = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!teacherId) return false;

  const teachers = getAllTeachers();
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return false;
  }
  currentTeacher = teacher;
  enterAfterLogin();
  return true;
}

function logoutTeacher(showMessage = true) {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_CLASS);
  currentTeacher = null;
  currentClass = null;
  students = [];
  attendance = {};

  mainApp.style.display = 'none';
  classScreen.style.display = 'none';
  authScreen.style.display = 'flex';
  signinForm.reset();
  signupForm.reset();
  switchAuthTab('signin');

  if (showMessage) showToast('Logged out successfully');
}
/* =============================================================
   PART 3/7 : Classes (Shared Class System)
   ============================================================= */

function getAllClasses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES)) || [];
  } catch (e) {
    return [];
  }
}

function saveAllClasses(arr) {
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(arr));
}

function getClassesForTeacher(teacherId) {
  return getAllClasses().filter(c =>
    c.ownerId === teacherId ||
    (c.members || []).some(m => m.id === teacherId)
  );
}

function findClassByCode(code) {
  code = code.trim().toUpperCase();
  return getAllClasses().find(c => c.code === code);
}

function createClass(name) {
  name = name.trim();
  if (!name) {
    showToast('Class name is required', 'error');
    return null;
  }

  let code;
  do {
    code = generateClassCode();
  } while (findClassByCode(code));

  const newClass = {
    id: 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name,
    code: code,
    ownerId: currentTeacher.id,
    ownerName: currentTeacher.name,
    members: [],
    createdAt: new Date().toISOString()
  };

  const classes = getAllClasses();
  classes.push(newClass);
  saveAllClasses(classes);

  saveClassData(newClass.id, { students: [], attendance: {} });

  return newClass;
}

function joinClassByCode(code) {
  code = code.trim().toUpperCase();
  const target = findClassByCode(code);
  if (!target) {
    return { success: false, message: 'Class code not found' };
  }
  if (target.ownerId === currentTeacher.id) {
    return { success: false, message: 'You already own this class' };
  }
  if ((target.members || []).some(m => m.id === currentTeacher.id)) {
    return { success: false, message: 'You are already a member of this class' };
  }

  const classes = getAllClasses();
  const idx = classes.findIndex(c => c.id === target.id);
  if (idx === -1) return { success: false, message: 'Class not found' };
  classes[idx].members.push({
    id: currentTeacher.id,
    name: currentTeacher.name,
    username: currentTeacher.username,
    joinedAt: new Date().toISOString()
  });
  saveAllClasses(classes);

  return { success: true, class: classes[idx] };
}

function getClassData(classId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_DATA_PREFIX + classId);
    if (!raw) return { students: [], attendance: {} };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.students)) parsed.students = [];
    if (typeof parsed.attendance !== 'object' || parsed.attendance === null) parsed.attendance = {};
    return parsed;
  } catch (e) {
    return { students: [], attendance: {} };
  }
}

function saveClassData(classId, data) {
  localStorage.setItem(STORAGE_KEYS.CLASS_DATA_PREFIX + classId, JSON.stringify(data));
}

function loadCurrentClassData() {
  if (!currentClass) return;
  const data = getClassData(currentClass.id);
  students = data.students;
  attendance = data.attendance;
}

function saveStudents() {
  if (!currentClass) return;
  const data = getClassData(currentClass.id);
  data.students = students;
  saveClassData(currentClass.id, data);
}

function saveAttendance() {
  if (!currentClass) return;
  const data = getClassData(currentClass.id);
  data.attendance = attendance;
  saveClassData(currentClass.id, data);
}

function refreshCurrentClassFromStorage() {
  if (!currentClass) return;
  const found = getAllClasses().find(c => c.id === currentClass.id);
  if (found) currentClass = found;
}

function showClassScreen() {
  authScreen.style.display = 'none';
  mainApp.style.display = 'none';
  classScreen.style.display = 'flex';
  classScreenTeacher.textContent = `👋 ${currentTeacher.name}`;
  renderClassList();
}

function renderClassList() {
  const classes = getClassesForTeacher(currentTeacher.id);

  if (classes.length === 0) {
    classListContainer.innerHTML = `
      <p class="empty-state">Abhi koi class nahi hai. Nayi class banayein ya class code se join karein.</p>
    `;
    return;
  }

  classListContainer.innerHTML = classes.map(c => {
    const isOwner = c.ownerId === currentTeacher.id;
    const data = getClassData(c.id);
    const studentCount = data.students.length;
    const memberCount = (c.members || []).length + 1;
    return `
      <div class="class-item" data-id="${c.id}">
        <div class="class-item-info">
          <span class="class-item-name">${escapeHtml(c.name)}</span>
          <span class="class-item-meta">
            Code: ${c.code} • ${studentCount} students • ${memberCount} teacher${memberCount > 1 ? 's' : ''}
          </span>
        </div>
        <span class="class-item-badge ${isOwner ? 'owner' : ''}">${isOwner ? 'Owner' : 'Member'}</span>
      </div>
    `;
  }).join('');

  classListContainer.querySelectorAll('.class-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const cls = getAllClasses().find(c => c.id === id);
      if (cls) enterClass(cls);
    });
  });
}

function enterClass(cls) {
  currentClass = cls;
  localStorage.setItem(STORAGE_KEYS.CURRENT_CLASS, cls.id);
  loadCurrentClassData();

  authScreen.style.display = 'none';
  classScreen.style.display = 'none';
  mainApp.style.display = 'block';

  currentClassTitle.textContent = cls.name;
  teacherGreeting.textContent = `👋 ${currentTeacher.name}`;
  classCodeDisplay.textContent = cls.code;

  updateDashboardStats();
  showSection('dashboardSection');
}

function leaveClass() {
  currentClass = null;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_CLASS);
  students = [];
  attendance = {};
  showClassScreen();
}

function enterAfterLogin() {
  const lastClassId = localStorage.getItem(STORAGE_KEYS.CURRENT_CLASS);
  const classes = getClassesForTeacher(currentTeacher.id);

  if (classes.length === 0) {
    showClassScreen();
    return;
  }

  if (lastClassId) {
    const found = classes.find(c => c.id === lastClassId);
    if (found) {
      enterClass(found);
      return;
    }
  }

  if (classes.length === 1) {
    enterClass(classes[0]);
  } else {
    showClassScreen();
  }
}
/* =============================================================
   PART 4/7 : Dashboard stats + Student CRUD (with Father Name)
   ============================================================= */

function updateDashboardStats() {
  const today = getTodayKey();
  const todayRecord = attendance[today] || {};

  const total = students.length;
  let present = 0, absent = 0;
  students.forEach(s => {
    const st = todayRecord[s.id];
    if (st === 'present') present++;
    else if (st === 'absent') absent++;
  });

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  totalStudentsEl.textContent = total;
  presentStudentsEl.textContent = present;
  absentStudentsEl.textContent = absent;
  attendancePercentageEl.textContent = percentage + '%';
  currentDateEl.textContent = formatDisplayDate(today);
}

// ---------- Add ----------
function addStudent(name, fatherName, roll, cls, phone) {
  if (!name.trim() || !fatherName.trim() || !roll.trim()) {
    showToast('Name, Father Name and Roll are required', 'error');
    return false;
  }
  if (students.some(s => s.roll.toLowerCase() === roll.trim().toLowerCase())) {
    showToast('Roll number already exists in this class', 'error');
    return false;
  }
  students.push({
    id: 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    fatherName: fatherName.trim(),
    roll: roll.trim(),
    class: cls.trim() || '',
    phone: phone.trim() || ''
  });
  saveStudents();
  showToast('Student added successfully');
  return true;
}

// ---------- Update ----------
function updateStudent(id, name, fatherName, roll, cls, phone) {
  const student = students.find(s => s.id === id);
  if (!student) return false;
  if (!name.trim() || !fatherName.trim() || !roll.trim()) {
    showToast('Name, Father Name and Roll are required', 'error');
    return false;
  }
  if (students.some(s => s.id !== id && s.roll.toLowerCase() === roll.trim().toLowerCase())) {
    showToast('Roll number already exists in this class', 'error');
    return false;
  }
  student.name = name.trim();
  student.fatherName = fatherName.trim();
  student.roll = roll.trim();
  student.class = cls.trim() || '';
  student.phone = phone.trim() || '';
  saveStudents();
  showToast('Student updated');
  return true;
}

// ---------- Delete ----------
function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  Object.keys(attendance).forEach(date => {
    if (attendance[date][id]) delete attendance[date][id];
    if (Object.keys(attendance[date]).length === 0) delete attendance[date];
  });
  saveStudents();
  saveAttendance();
  showToast('Student deleted');
  updateDashboardStats();
  if (studentsSection.classList.contains('active')) {
    renderStudentList(searchInput.value.trim());
  }
}
/* =============================================================
   PART 5/7 : Student List, Edit Form, Delete Confirmation
   ============================================================= */

function renderStudentList(filterText = '') {
  const today = getTodayKey();
  const todayRecord = attendance[today] || {};

  const filtered = students.filter(s => {
    const q = filterText.toLowerCase();
    return s.name.toLowerCase().includes(q) ||
           (s.fatherName || '').toLowerCase().includes(q) ||
           s.roll.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    studentListContainer.innerHTML = `<p class="empty-state">${
      students.length === 0 ? 'No students added yet.' : 'No students match your search.'
    }</p>`;
    return;
  }

  studentListContainer.innerHTML = filtered.map(student => {
    const status = todayRecord[student.id];
    let statusClass = 'status-unmarked';
    let statusText = 'Not marked';
    if (status === 'present') { statusClass = 'status-present'; statusText = 'Present'; }
    if (status === 'absent')  { statusClass = 'status-absent';  statusText = 'Absent'; }

    const fullName = student.fatherName
      ? `${escapeHtml(student.name)} ${escapeHtml(student.fatherName)}`
      : escapeHtml(student.name);

    return `
      <div class="student-card" data-id="${student.id}">
        <div class="student-info">
          <span class="student-name">${fullName}</span>
          <span class="student-status ${statusClass}">${statusText}</span>
        </div>
        <div class="student-meta">
          <span>Roll: ${escapeHtml(student.roll)}</span>
          ${student.class ? `<span>Section: ${escapeHtml(student.class)}</span>` : ''}
          ${student.phone ? `<span>📞 ${escapeHtml(student.phone)}</span>` : ''}
        </div>
        <div class="student-actions">
          <button class="btn btn-outline view-btn"   data-id="${student.id}">View</button>
          <button class="btn btn-outline edit-btn"   data-id="${student.id}">Edit</button>
          <button class="btn btn-danger  delete-btn" data-id="${student.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  studentListContainer.querySelectorAll('.view-btn').forEach(b =>
    b.addEventListener('click', e => openStudentDetail(e.currentTarget.dataset.id)));
  studentListContainer.querySelectorAll('.edit-btn').forEach(b =>
    b.addEventListener('click', e => startEditStudent(e.currentTarget.dataset.id)));
  studentListContainer.querySelectorAll('.delete-btn').forEach(b =>
    b.addEventListener('click', e => showDeleteConfirmation(e.currentTarget.dataset.id)));
}

function startEditStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  editingStudentId.value = student.id;
  studentNameInput.value = student.name;
  fatherNameInput.value = student.fatherName || '';
  rollNumberInput.value = student.roll;
  studentClassInput.value = student.class || '';
  phoneNumberInput.value = student.phone || '';
  addStudentTitle.textContent = 'Edit Student';
  saveStudentBtn.textContent = 'Update Student';
  showSection('addStudentSection');
}

function resetStudentForm() {
  editingStudentId.value = '';
  addStudentForm.reset();
  addStudentTitle.textContent = 'Add Student';
  saveStudentBtn.textContent = 'Save Student';
}

let pendingAction = null;

function showDeleteConfirmation(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  pendingAction = { type: 'delete', id };
  confirmTitle.textContent = 'Confirm Delete';
  const fullName = student.fatherName
    ? `${student.name} ${student.fatherName}`
    : student.name;
  confirmMessage.textContent = `Are you sure you want to delete ${fullName} (Roll ${student.roll})?`;
  confirmDeleteBtn.textContent = 'Delete';
  confirmDeleteBtn.classList.add('btn-danger');
  confirmDeleteBtn.classList.remove('btn-primary');
  confirmModal.classList.add('active');
}
/* =============================================================
   PART 6/7 : Attendance, History, Monthly, Student Detail, Members
   ============================================================= */

function renderAttendanceList() {
  const dateKey = attendanceDatePicker.value || getTodayKey();
  const record = attendance[dateKey] || {};
  attendanceDateDisplay.textContent = `Date: ${formatDisplayDate(dateKey)}`;

  if (students.length === 0) {
    attendanceListContainer.innerHTML = `<p class="empty-state">No students to mark. Add students first.</p>`;
    return;
  }

  attendanceListContainer.innerHTML = students.map(student => {
    const st = record[student.id];
    const presentSel = st === 'present' ? 'selected' : '';
    const absentSel  = st === 'absent'  ? 'selected' : '';

    const fullName = student.fatherName
      ? `${escapeHtml(student.name)} ${escapeHtml(student.fatherName)}`
      : escapeHtml(student.name);

    return `
      <div class="attendance-card" data-id="${student.id}">
        <div class="student-info">
          <span class="student-name">${fullName}</span>
          <span>Roll: ${escapeHtml(student.roll)}${student.class ? ' | ' + escapeHtml(student.class) : ''}</span>
        </div>
        <div class="attendance-buttons">
          <button class="attendance-btn present ${presentSel}"
                  data-id="${student.id}" data-status="present">Present</button>
          <button class="attendance-btn absent ${absentSel}"
                  data-id="${student.id}" data-status="absent">Absent</button>
        </div>
      </div>
    `;
  }).join('');

  attendanceListContainer.querySelectorAll('.attendance-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      markAttendance(e.currentTarget.dataset.id, e.currentTarget.dataset.status, dateKey);
    });
  });
}

function markAttendance(studentId, status, dateKey) {
  if (!dateKey) dateKey = getTodayKey();
  if (!attendance[dateKey]) attendance[dateKey] = {};

  if (attendance[dateKey][studentId] === status) {
    delete attendance[dateKey][studentId];
  } else {
    attendance[dateKey][studentId] = status;
  }
  if (Object.keys(attendance[dateKey]).length === 0) delete attendance[dateKey];

  saveAttendance();
  renderAttendanceList();
  updateDashboardStats();
  const student = students.find(s => s.id === studentId);
  if (student) showToast(`${student.name} marked ${status}`);
}

function renderHistory() {
  const dates = Object.keys(attendance)
    .filter(d => Object.keys(attendance[d]).length > 0)
    .sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) {
    historyContainer.innerHTML = `<p class="empty-state">No attendance records yet.</p>`;
    return;
  }

  historyContainer.innerHTML = dates.map(date => {
    const rec = attendance[date];
    let present = 0, absent = 0;
    Object.values(rec).forEach(v => {
      if (v === 'present') present++;
      if (v === 'absent')  absent++;
    });
    const total = present + absent;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return `
      <div class="history-card" data-date="${date}">
        <div class="history-date">${formatDisplayDate(date)}</div>
        <div class="history-stats">
          <span>✅ Present: ${present}</span>
          <span>❌ Absent: ${absent}</span>
          <span>📊 ${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  historyContainer.querySelectorAll('.history-card').forEach(card => {
    card.addEventListener('click', e => {
      attendanceDatePicker.value = e.currentTarget.dataset.date;
      showSection('attendanceSection');
      renderAttendanceList();
    });
  });
}

function renderMonthlySummary() {
  const monthKey = monthPicker.value || getTodayKey().slice(0, 7);
  monthPicker.value = monthKey;
  const monthDates = Object.keys(attendance).filter(d => d.startsWith(monthKey));

  if (students.length === 0) {
    monthlySummaryContainer.innerHTML = `<p class="empty-state">Add students to see monthly summary.</p>`;
    monthlyStudentsContainer.innerHTML = '';
    return;
  }

  let totalMarks = 0, totalPresent = 0, totalAbsent = 0;
  monthDates.forEach(date => {
    Object.values(attendance[date]).forEach(v => {
      totalMarks++;
      if (v === 'present') totalPresent++;
      if (v === 'absent')  totalAbsent++;
    });
  });
  const overallPct = totalMarks > 0 ? Math.round((totalPresent / totalMarks) * 100) : 0;

  monthlySummaryContainer.innerHTML = `
    <div class="summary-card">
      <div class="summary-row"><span>Month</span><strong>${formatMonthLabel(monthKey)}</strong></div>
      <div class="summary-row"><span>Working days recorded</span><strong>${monthDates.length}</strong></div>
      <div class="summary-row"><span>Total present marks</span><strong>${totalPresent}</strong></div>
      <div class="summary-row"><span>Total absent marks</span><strong>${totalAbsent}</strong></div>
      <div class="summary-row"><span>Overall attendance</span><strong>${overallPct}%</strong></div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${overallPct}%"></div>
      </div>
    </div>
  `;

  const rows = students.map(student => {
    let present = 0, absent = 0;
    monthDates.forEach(date => {
      const v = attendance[date][student.id];
      if (v === 'present') present++;
      if (v === 'absent')  absent++;
    });
    const total = present + absent;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { student, present, absent, total, pct };
  });

  monthlyStudentsContainer.innerHTML = rows.map(r => {
    const fullName = r.student.fatherName
      ? `${escapeHtml(r.student.name)} ${escapeHtml(r.student.fatherName)}`
      : escapeHtml(r.student.name);
    return `
      <div class="student-card">
        <div class="student-info">
          <span class="student-name">${fullName}</span>
          <span class="student-status ${
            r.pct >= 75 ? 'status-present' :
            r.pct >= 50 ? 'status-unmarked' : 'status-absent'
          }">${r.pct}%</span>
        </div>
        <div class="student-meta">
          <span>Roll: ${escapeHtml(r.student.roll)}</span>
          <span>Present: ${r.present}</span>
          <span>Absent: ${r.absent}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${r.pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function openStudentDetail(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  let totalPresent = 0, totalAbsent = 0;
  const history = [];
  Object.keys(attendance).sort((a, b) => b.localeCompare(a)).forEach(date => {
    const v = attendance[date][id];
    if (!v) return;
    if (v === 'present') totalPresent++;
    if (v === 'absent')  totalAbsent++;
    history.push({ date, status: v });
  });
  const total = totalPresent + totalAbsent;
  const pct = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

  const historyHtml = history.length === 0
    ? `<p class="empty-state">No attendance records yet.</p>`
    : history.map(h => `
        <div class="detail-history-item">
          <span>${formatDisplayDate(h.date)}</span>
          <span class="student-status ${
            h.status === 'present' ? 'status-present' : 'status-absent'
          }">${h.status === 'present' ? 'Present' : 'Absent'}</span>
        </div>
      `).join('');

  const fullName = student.fatherName
    ? `${escapeHtml(student.name)} ${escapeHtml(student.fatherName)}`
    : escapeHtml(student.name);

  studentDetailContainer.innerHTML = `
    <div class="detail-card">
      <div class="detail-name">${fullName}</div>
      <div class="detail-meta">
        <span>Father Name: ${escapeHtml(student.fatherName || '—')}</span>
        <span>Roll Number: ${escapeHtml(student.roll)}</span>
        ${student.class ? `<span>Section: ${escapeHtml(student.class)}</span>` : ''}
        ${student.phone ? `<span>📞 ${escapeHtml(student.phone)}</span>` : ''}
      </div>
      <div class="detail-stats">
        <div class="detail-stat"><div class="detail-stat-value">${totalPresent}</div><div class="detail-stat-label">Present</div></div>
        <div class="detail-stat"><div class="detail-stat-value">${totalAbsent}</div><div class="detail-stat-label">Absent</div></div>
        <div class="detail-stat"><div class="detail-stat-value">${pct}%</div><div class="detail-stat-label">Overall</div></div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <h3 class="subsection-title">Attendance History</h3>
    <div class="detail-card">${historyHtml}</div>
  `;

  showSection('studentDetailSection');
}

function renderMembersSection() {
  refreshCurrentClassFromStorage();
  if (!currentClass) return;

  memberClassName.textContent = currentClass.name;
  memberClassCode.textContent = currentClass.code;
  memberClassOwner.textContent = currentClass.ownerName;
  shareCodeInput.value = currentClass.code;

  const isOwner = currentClass.ownerId === currentTeacher.id;

  const ownerCard = `
    <div class="student-card">
      <div class="student-info">
        <span class="student-name">👑 ${escapeHtml(currentClass.ownerName)}</span>
        <span class="student-status status-present">Owner</span>
      </div>
      <div class="student-meta">
        <span>Joined class as creator</span>
      </div>
    </div>
  `;

  const membersHtml = (currentClass.members || []).map(m => `
    <div class="student-card">
      <div class="student-info">
        <span class="student-name">👨‍🏫 ${escapeHtml(m.name)}</span>
        <span class="student-status status-unmarked">Member</span>
      </div>
      <div class="student-meta">
        <span>@${escapeHtml(m.username)}</span>
        <span>Joined: ${new Date(m.joinedAt).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');

  const emptyMembersMsg = (currentClass.members || []).length === 0
    ? `<p class="empty-state">Abhi sirf aap hi is class mein hain. Class code share karke doosre teacher ko join karayein.</p>`
    : '';

  membersListContainer.innerHTML = ownerCard + membersHtml + emptyMembersMsg;

  ownerDangerZone.style.display = isOwner ? 'flex' : 'none';
}
/* =============================================================
   PART 7/7 : CSV utilities, Reports, Events, Init
   ============================================================= */

function csvCell(value) {
  if (value == null) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCSV(rows) {
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}

function downloadFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function initReportsSection() {
  if (!reportMonthPicker.value) {
    reportMonthPicker.value = getTodayKey().slice(0, 7);
  }
}

function exportMonthlyCSV() {
  if (students.length === 0) { showToast('No students to export', 'error'); return; }
  const monthKey = reportMonthPicker.value || getTodayKey().slice(0, 7);
  const monthDates = Object.keys(attendance).filter(d => d.startsWith(monthKey)).sort();
  if (monthDates.length === 0) { showToast('No attendance records for this month', 'error'); return; }

  const header = ['Student Name', 'Father Name', 'Roll', 'Section'];
  monthDates.forEach(d => header.push(d));
  header.push('Present', 'Absent', 'Percentage');

  const rows = [header];
  students.forEach(student => {
    const row = [
      student.name,
      student.fatherName || '',
      student.roll,
      student.class || ''
    ];
    let present = 0, absent = 0;
    monthDates.forEach(date => {
      const v = attendance[date][student.id];
      if (v === 'present') { row.push('P'); present++; }
      else if (v === 'absent') { row.push('A'); absent++; }
      else { row.push('-'); }
    });
    const total = present + absent;
    const pct = total > 0 ? Math.round((present / total) * 100) + '%' : '0%';
    row.push(present, absent, pct);
    rows.push(row);
  });
  rows.push([]);
  rows.push(['Legend: P = Present, A = Absent, - = Not marked']);
  rows.push([`Class: ${currentClass.name} (${currentClass.code})`]);
  rows.push([`Report: ${formatMonthLabel(monthKey)}`]);
  rows.push([`Teacher: ${currentTeacher.name}`]);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);

  downloadFile(`attendance_${currentClass.code}_${monthKey}.csv`, toCSV(rows));
  showToast('Monthly CSV exported');
}

function exportAllAttendanceCSV() {
  if (students.length === 0) { showToast('No students to export', 'error'); return; }
  const allDates = Object.keys(attendance).filter(d => Object.keys(attendance[d]).length > 0).sort();
  if (allDates.length === 0) { showToast('No attendance records yet', 'error'); return; }

  const rows = [['Date', 'Student Name', 'Father Name', 'Roll', 'Section', 'Status']];
  allDates.forEach(date => {
    students.forEach(student => {
      const status = attendance[date][student.id];
      if (status) {
        rows.push([
          date,
          student.name,
          student.fatherName || '',
          student.roll,
          student.class || '',
          status === 'present' ? 'Present' : 'Absent'
        ]);
      }
    });
  });
  downloadFile(`attendance_all_${currentClass.code}_${getTodayKey()}.csv`, toCSV(rows));
  showToast('All attendance CSV exported');
}

function exportStudentsCSV() {
  if (students.length === 0) { showToast('No students to export', 'error'); return; }
  const rows = [['Name', 'Father Name', 'Roll Number', 'Section', 'Phone']];
  students.forEach(s => rows.push([
    s.name,
    s.fatherName || '',
    s.roll,
    s.class || '',
    s.phone || ''
  ]));
  downloadFile(`students_${currentClass.code}_${getTodayKey()}.csv`, toCSV(rows));
  showToast('Students CSV exported');
}

function printMonthlyReport() {
  if (students.length === 0) { showToast('No students to print', 'error'); return; }
  const monthKey = reportMonthPicker.value || getTodayKey().slice(0, 7);
  const monthDates = Object.keys(attendance).filter(d => d.startsWith(monthKey)).sort();
  if (monthDates.length === 0) { showToast('No records for this month to print', 'error'); return; }

  const studentRows = students.map(student => {
    let present = 0, absent = 0;
    const dayStatuses = monthDates.map(date => {
      const v = attendance[date][student.id];
      if (v === 'present') { present++; return 'P'; }
      if (v === 'absent')  { absent++;  return 'A'; }
      return '-';
    });
    const total = present + absent;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { student, dayStatuses, present, absent, pct };
  });

  const totalPresent = studentRows.reduce((a, r) => a + r.present, 0);
  const totalAbsent  = studentRows.reduce((a, r) => a + r.absent, 0);
  const grandTotal   = totalPresent + totalAbsent;
  const overallPct   = grandTotal > 0 ? Math.round((totalPresent / grandTotal) * 100) : 0;

  const headerCols = monthDates.map(d => `<th>${d.slice(8)}</th>`).join('');
  const tableRows = studentRows.map(r => {
    const cells = r.dayStatuses.map(s => `<td class="center">${s}</td>`).join('');
    const cls = r.pct >= 75 ? 'pct-high' : r.pct >= 50 ? 'pct-mid' : 'pct-low';
    return `
      <tr>
        <td>${escapeHtml(r.student.name)}</td>
        <td>${escapeHtml(r.student.fatherName || '')}</td>
        <td>${escapeHtml(r.student.roll)}</td>
        <td>${escapeHtml(r.student.class || '')}</td>
        ${cells}
        <td class="center">${r.present}</td>
        <td class="center">${r.absent}</td>
        <td class="center ${cls}">${r.pct}%</td>
      </tr>
    `;
  }).join('');

  printArea.innerHTML = `
    <h1>Student Attendance Report</h1>
    <div class="print-subtitle">
      ${escapeHtml(currentClass.name)} (${currentClass.code}) — ${formatMonthLabel(monthKey)}
      — Teacher: ${escapeHtml(currentTeacher.name)}
      — Generated ${new Date().toLocaleDateString()}
    </div>
    <div class="print-summary">
      <div><strong>Students:</strong> ${students.length}</div>
      <div><strong>Days recorded:</strong> ${monthDates.length}</div>
      <div><strong>Present:</strong> ${totalPresent}</div>
      <div><strong>Absent:</strong> ${totalAbsent}</div>
      <div><strong>Overall:</strong> ${overallPct}%</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Father Name</th><th>Roll</th><th>Section</th>
          ${headerCols}
          <th>P</th><th>A</th><th>%</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="print-footer">
      Legend: P = Present, A = Absent, - = Not marked | Student Attendance Management v1.4
    </div>
  `;

  setTimeout(() => window.print(), 100);
  showToast('Opening print dialog...');
}

function backupDataJSON() {
  const backup = {
    app: 'Student Attendance',
    version: '1.4',
    classInfo: {
      id: currentClass.id,
      name: currentClass.name,
      code: currentClass.code,
      ownerName: currentClass.ownerName
    },
    teacher: {
      id: currentTeacher.id,
      name: currentTeacher.name,
      username: currentTeacher.username
    },
    exportedAt: new Date().toISOString(),
    students: students,
    attendance: attendance
  };
  const json = JSON.stringify(backup, null, 2);
  downloadFile(`attendance_backup_${currentClass.code}_${getTodayKey()}.json`, json, 'application/json');
  showToast('Backup file downloaded');
}

// ==================================================
// EVENT LISTENERS
// ==================================================

signinTab.addEventListener('click', () => switchAuthTab('signin'));
signupTab.addEventListener('click', () => switchAuthTab('signup'));
gotoSignup.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signup'); });
gotoSignin.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signin'); });

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = signupName.value;
  const username = signupUsername.value;
  const password = signupPassword.value;
  const confirm = signupConfirm.value;

  if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }

  const result = await registerTeacher(name, username, password);
  if (!result.success) { showToast(result.message, 'error'); return; }

  showToast('Account created! Please sign in.');
  signupForm.reset();
  switchAuthTab('signin');
  signinUsername.value = username.trim().toLowerCase();
});

signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = signinUsername.value;
  const password = signinPassword.value;

  const result = await loginTeacher(username, password);
  if (!result.success) { showToast(result.message, 'error'); return; }

  signinForm.reset();
  startSession(result.teacher);
  showToast(`Welcome back, ${result.teacher.name}!`);
});

createClassBtn.addEventListener('click', async () => {
  const name = await showPrompt({
    title: 'Create New Class',
    message: 'Class ka naam likhein (e.g. Class 10-A)',
    placeholder: 'e.g. Class 10-A'
  });
  if (!name) return;

  const newClass = createClass(name);
  if (!newClass) return;

  showToast(`Class created! Code: ${newClass.code}`);
  renderClassList();
});

joinClassBtn.addEventListener('click', async () => {
  const code = await showPrompt({
    title: 'Join Class',
    message: 'Doosre teacher se mila Class Code daalein (6 characters)',
    placeholder: 'e.g. 7X4K9P'
  });
  if (!code) return;

  const result = joinClassByCode(code);
  if (!result.success) { showToast(result.message, 'error'); return; }

  showToast(`Joined "${result.class.name}"`);
  renderClassList();
});

classLogoutBtn.addEventListener('click', () => {
  confirmTitle.textContent = 'Confirm Logout';
  confirmMessage.textContent = 'Logout karne par dobara sign in karna padega.';
  confirmDeleteBtn.textContent = 'Logout';
  confirmDeleteBtn.classList.remove('btn-danger');
  confirmDeleteBtn.classList.add('btn-primary');
  pendingAction = { type: 'logout' };
  confirmModal.classList.add('active');
});

switchClassBtn.addEventListener('click', () => {
  leaveClass();
});

logoutBtn.addEventListener('click', () => {
  confirmTitle.textContent = 'Confirm Logout';
  confirmMessage.textContent = 'Logout karne par dobara sign in karna padega. Data safe rahega.';
  confirmDeleteBtn.textContent = 'Logout';
  confirmDeleteBtn.classList.remove('btn-danger');
  confirmDeleteBtn.classList.add('btn-primary');
  pendingAction = { type: 'logout' };
  confirmModal.classList.add('active');
});

copyClassCodeBtn.addEventListener('click', () => {
  if (!currentClass) return;
  navigator.clipboard.writeText(currentClass.code).then(
    () => showToast('Class code copied!'),
    () => showToast('Copy failed', 'error')
  );
});

shareCopyBtn.addEventListener('click', () => {
  if (!currentClass) return;
  navigator.clipboard.writeText(currentClass.code).then(
    () => showToast('Class code copied!'),
    () => showToast('Copy failed', 'error')
  );
});

deleteClassBtn.addEventListener('click', () => {
  if (!currentClass) return;
  if (currentClass.ownerId !== currentTeacher.id) {
    showToast('Only the owner can delete this class', 'error');
    return;
  }
  confirmTitle.textContent = 'Delete Class?';
  confirmMessage.textContent =
    `Ye poora class "${currentClass.name}" students aur attendance ke saath hamesha ke liye delete ho jayega. Continue?`;
  confirmDeleteBtn.textContent = 'Delete Class';
  confirmDeleteBtn.classList.add('btn-danger');
  confirmDeleteBtn.classList.remove('btn-primary');
  pendingAction = { type: 'deleteClass' };
  confirmModal.classList.add('active');
});

confirmCancelBtn.addEventListener('click', () => {
  confirmModal.classList.remove('active');
  pendingAction = null;
});

confirmDeleteBtn.addEventListener('click', () => {
  if (pendingAction) {
    if (pendingAction.type === 'delete') {
      deleteStudent(pendingAction.id);
    } else if (pendingAction.type === 'logout') {
      confirmModal.classList.remove('active');
      pendingAction = null;
      logoutTeacher();
      return;
    } else if (pendingAction.type === 'deleteClass') {
      const classId = currentClass.id;
      const classes = getAllClasses().filter(c => c.id !== classId);
      saveAllClasses(classes);
      localStorage.removeItem(STORAGE_KEYS.CLASS_DATA_PREFIX + classId);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CLASS);
      currentClass = null;
      students = [];
      attendance = {};
      confirmModal.classList.remove('active');
      pendingAction = null;
      showToast('Class deleted');
      showClassScreen();
      return;
    }
  }
  pendingAction = null;
  confirmModal.classList.remove('active');
});

confirmModal.addEventListener('click', e => {
  if (e.target === confirmModal) {
    confirmModal.classList.remove('active');
    pendingAction = null;
  }
});

// Add/Edit form with Father Name
addStudentForm.addEventListener('submit', e => {
  e.preventDefault();
  const id         = editingStudentId.value;
  const name       = studentNameInput.value;
  const fatherName = fatherNameInput.value;
  const roll       = rollNumberInput.value;
  const cls        = studentClassInput.value;
  const phone      = phoneNumberInput.value;
  const ok = id ? updateStudent(id, name, fatherName, roll, cls, phone)
                : addStudent(name, fatherName, roll, cls, phone);
  if (ok) { resetStudentForm(); showSection('dashboardSection'); }
});

attendanceDatePicker.addEventListener('change', renderAttendanceList);
monthPicker.addEventListener('change', renderMonthlySummary);

exportMonthlyCsvBtn.addEventListener('click', exportMonthlyCSV);
exportAllCsvBtn.addEventListener('click', exportAllAttendanceCSV);
exportStudentsCsvBtn.addEventListener('click', exportStudentsCSV);
printMonthlyReportBtn.addEventListener('click', printMonthlyReport);
backupJsonBtn.addEventListener('click', backupDataJSON);

addStudentBtn.addEventListener('click', () => { resetStudentForm(); showSection('addStudentSection'); });
markAttendanceBtn.addEventListener('click', () => {
  attendanceDatePicker.value = getTodayKey();
  showSection('attendanceSection');
  renderAttendanceList();
});
viewStudentsBtn.addEventListener('click', () => {
  searchInput.value = '';
  showSection('studentsSection');
  renderStudentList('');
});
historyBtn.addEventListener('click', () => { showSection('historySection'); renderHistory(); });
monthlyBtn.addEventListener('click', () => {
  monthPicker.value = getTodayKey().slice(0, 7);
  showSection('monthlySection');
  renderMonthlySummary();
});
reportsBtn.addEventListener('click', () => showSection('reportsSection'));
membersBtn.addEventListener('click', () => showSection('membersSection'));

document.querySelectorAll('.back-btn').forEach(btn =>
  btn.addEventListener('click', () => showSection(btn.dataset.back)));

searchInput.addEventListener('input', e => renderStudentList(e.target.value.trim()));

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  localStorage.setItem(STORAGE_KEYS.THEME, dark ? 'dark' : 'light');
  themeToggle.textContent = dark ? '☀️' : '🌙';
});

// ==================================================
// INIT
// ==================================================

async function init() {
  applyTheme();

  const today = getTodayKey();
  attendanceDatePicker.value = today;
  monthPicker.value = today.slice(0, 7);
  reportMonthPicker.value = today.slice(0, 7);

  const restored = await restoreSession();
  if (!restored) {
    authScreen.style.display = 'flex';
    classScreen.style.display = 'none';
    mainApp.style.display = 'none';
    switchAuthTab('signin');
  }
}

init();
