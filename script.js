const admins = [
  { username: 'yassine khamer', password: 'yassine666kh', role: 'Administrateur' },
  { username: 'mehdi karim', password: 'mehdi777kh', role: 'Administrateur' },
  { username: 'abdllilah el arjioui', password: 'abdo888kh', role: 'Administrateur' }
];

const defaultEmployees = [
  ['EMP-001', 'Yassine Amrani', 'BK123456', '0600000001', 'Technicien maintenance', 'Chantier Pro', 'Site Tanger', 'CDI', 'Actif'],
  ['EMP-002', 'Sara Bennani', 'CD789012', '0600000002', 'Superviseur HSE', 'Chantier Pro', 'Site Jorf', 'CDD', 'Actif'],
  ['EMP-003', 'Mehdi El Fassi', 'EF345678', '0600000003', 'Soudeur', 'Indus Maint', 'Site Safi', 'Intérim', 'Absent'],
  ['EMP-004', 'Imane Ait Lahcen', 'GH901234', '0600000004', 'Assistante RH', 'Chantier Pro', 'Siège Casa', 'CDI', 'Actif'],
  ['EMP-005', 'Karim Ouali', 'IJ567890', '0600000005', 'Chef chantier', 'Indus Maint', 'Site Tanger', 'CDI', 'Actif'],
  ['EMP-006', 'Nadia Rami', 'KL123789', '0600000006', 'Magasinière EPI', 'Chantier Pro', 'Site Jorf', 'CDD', 'Retard']
];

const employeeStorageKey = 'rhEmployees';
let employees = loadEmployees();

const tbody = document.querySelector('#employeeTable tbody');
const searchInput = document.querySelector('#searchInput');
const modal = document.querySelector('#employeeModal');
const employeeForm = document.querySelector('#employeeForm');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const currentUser = document.querySelector('#currentUser');
const logoutBtn = document.querySelector('#logoutBtn');

function loadEmployees() {
  const saved = localStorage.getItem(employeeStorageKey);
  if (!saved) return [...defaultEmployees];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...defaultEmployees];
  } catch (error) {
    return [...defaultEmployees];
  }
}

function saveEmployees() {
  localStorage.setItem(employeeStorageKey, JSON.stringify(employees));
}

function getVisibleEmployees() {
  const query = searchInput.value.toLowerCase().trim();
  return employees
    .map((employee, index) => ({ employee, index }))
    .filter(({ employee }) => employee.join(' ').toLowerCase().includes(query));
}

function updateStats() {
  const total = employees.length;
  const active = employees.filter((employee) => employee[8] === 'Actif').length;
  const absent = employees.filter((employee) => employee[8] === 'Absent' || employee[8] === 'Retard').length;
  const interim = employees.filter((employee) => employee[7] === 'Intérim').length;

  document.querySelector('#totalCount').textContent = total;
  document.querySelector('#presentCount').textContent = active;
  document.querySelector('#absentCount').textContent = absent;
  document.querySelector('#interimCount').textContent = interim;
  document.querySelector('#totalNote').textContent = `${total} salarié${total > 1 ? 's' : ''} dans l'effectif`;
}

function normalizeLogin(value) {
  return value.trim().toLowerCase();
}

function unlockSite(user) {
  localStorage.setItem('rhAdminSession', JSON.stringify({
    username: user.username,
    role: user.role
  }));
  currentUser.textContent = `${user.username} - ${user.role}`;
  document.body.classList.remove('locked');
  setTimeout(() => {
    if (window.Chart && Chart.instances) {
      Object.values(Chart.instances).forEach((chart) => chart.resize());
    }
  }, 80);
}

function lockSite() {
  localStorage.removeItem('rhAdminSession');
  document.body.classList.add('locked');
}

function restoreSession() {
  const saved = localStorage.getItem('rhAdminSession');
  if (!saved) return;

  try {
    const session = JSON.parse(saved);
    const user = admins.find((admin) => admin.username === session.username);
    if (user) unlockSite(user);
  } catch (error) {
    lockSite();
  }
}

function renderEmployees(rows = getVisibleEmployees()) {
  tbody.innerHTML = rows.map(({ employee, index }) => {
    const statusClass = employee[8] === 'Actif' ? 'ok' : 'late';
    return `
      <tr>
        <td>${employee[0]}</td>
        <td>${employee[1]}</td>
        <td>${employee[2]}</td>
        <td>${employee[3]}</td>
        <td>${employee[4]}</td>
        <td>${employee[5]}</td>
        <td>${employee[6]}</td>
        <td><span class="badge">${employee[7]}</span></td>
        <td class="${statusClass}">${employee[8]}</td>
        <td><button class="danger-btn" type="button" data-delete-index="${index}">Supprimer</button></td>
      </tr>
    `;
  }).join('');
  updateStats();
}

searchInput.addEventListener('input', () => {
  renderEmployees();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = normalizeLogin(document.querySelector('#username').value);
  const password = document.querySelector('#password').value;
  const user = admins.find((admin) => admin.username === username && admin.password === password);

  if (!user) {
    loginError.textContent = 'Nom utilisateur ou mot de passe incorrect.';
    return;
  }

  loginError.textContent = '';
  loginForm.reset();
  unlockSite(user);
});

logoutBtn.addEventListener('click', lockSite);

document.querySelector('#openEmployeeModal').addEventListener('click', () => modal.showModal());
document.querySelector('#closeEmployeeModal').addEventListener('click', () => modal.close());

employeeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const employee = [
    document.querySelector('#employeeMatricule').value.trim(),
    document.querySelector('#employeeName').value.trim(),
    document.querySelector('#employeeCin').value.trim(),
    document.querySelector('#employeePhone').value.trim(),
    document.querySelector('#employeeJob').value.trim(),
    document.querySelector('#employeeCompany').value.trim(),
    document.querySelector('#employeeSite').value.trim(),
    document.querySelector('#employeeContract').value,
    document.querySelector('#employeeStatus').value
  ];

  const matriculeExists = employees.some((row) => row[0].toLowerCase() === employee[0].toLowerCase());
  if (matriculeExists) {
    alert('Ce matricule existe deja dans l effectif.');
    return;
  }

  employees.push(employee);
  saveEmployees();
  searchInput.value = '';
  employeeForm.reset();
  modal.close();
  renderEmployees();
});

tbody.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-index]');
  if (!deleteButton) return;

  const index = Number(deleteButton.dataset.deleteIndex);
  const employee = employees[index];
  if (!employee) return;

  employees.splice(index, 1);
  saveEmployees();
  searchInput.value = '';
  renderEmployees();
});

document.querySelector('#exportBtn').addEventListener('click', () => {
  const csv = [
    ['Matricule', 'Nom', 'CIN', 'Téléphone', 'Fonction', 'Société', 'Chantier', 'Contrat', 'Statut'],
    ...employees
  ].map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rapport-rh-salaries.csv';
  link.click();
  URL.revokeObjectURL(url);
});

renderEmployees();
restoreSession();

new Chart(document.querySelector('#siteChart'), {
  type: 'bar',
  data: {
    labels: ['Tanger', 'Jorf', 'Safi', 'Casa', 'Rabat'],
    datasets: [{
      label: 'Effectif',
      data: [74, 58, 43, 39, 34],
      backgroundColor: ['#1d4ed8', '#0f8f9d', '#16803c', '#d97706', '#c2410c']
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  }
});

new Chart(document.querySelector('#scoreChart'), {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Score moyen',
      data: [3.6, 3.8, 3.7, 4.1, 4.0, 4.3],
      borderColor: '#1d4ed8',
      backgroundColor: 'rgba(29, 78, 216, .12)',
      fill: true,
      tension: .35
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 5 } }
  }
});
