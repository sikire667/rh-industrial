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

const defaultProjects = [
  ['PRJ-001', 'Maintenance convoyeurs', 'OCP', 'Site Jorf', 'Karim Ouali', '2026-01-15', 'En cours'],
  ['PRJ-002', 'Arrêt technique fours', 'Indus Maint', 'Site Safi', 'Sara Bennani', '2026-03-01', 'Planifié'],
  ['PRJ-003', 'Renfort chantier Tanger', 'Chantier Pro', 'Site Tanger', 'Yassine Amrani', '2026-02-10', 'En cours']
];

const defaultCities = ['Site Jorf', 'Site Safi', 'Site Tanger', 'Casablanca', 'Rabat'];

const employeeStorageKey = 'rhEmployees';
const projectStorageKey = 'rhProjects';
const cityStorageKey = 'rhCities';
const chartStorageKey = 'rhChartData';
const defaultChartData = {
  sites: {
    labels: ['Tanger', 'Jorf', 'Safi', 'Casa', 'Rabat'],
    values: [74, 58, 43, 39, 34]
  },
  scores: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    values: [3.6, 3.8, 3.7, 4.1, 4.0, 4.3]
  }
};
let employees = loadEmployees();
let projects = loadProjects();
let cities = loadCities();
let chartData = loadChartData();
let siteChart;
let scoreChart;

const tbody = document.querySelector('#employeeTable tbody');
const projectTbody = document.querySelector('#projectTable tbody');
const cityTbody = document.querySelector('#cityTable tbody');
const searchInput = document.querySelector('#searchInput');
const modal = document.querySelector('#employeeModal');
const projectModal = document.querySelector('#projectModal');
const employeeForm = document.querySelector('#employeeForm');
const projectForm = document.querySelector('#projectForm');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const currentUser = document.querySelector('#currentUser');
const logoutBtn = document.querySelector('#logoutBtn');
const siteInputs = document.querySelector('#siteInputs');
const scoreInputs = document.querySelector('#scoreInputs');
const applyChartsBtn = document.querySelector('#applyChartsBtn');
const resetChartsBtn = document.querySelector('#resetChartsBtn');
const cityNameInput = document.querySelector('#cityName');
const addCityBtn = document.querySelector('#addCityBtn');
const pageTitle = document.querySelector('#pageTitle');
const navLinks = document.querySelectorAll('[data-page-link]');
const pageSections = document.querySelectorAll('.page-section');
const modulePages = document.querySelector('#modulePages');

const pageTitles = {
  dashboard: 'Tableau de bord RH',
  salaries: 'Gestion des salariés',
  projets: 'Gestion des projets',
  villes: 'Gestion des villes et sites',
  absences: 'Gestion des absences',
  pointage: 'Gestion du pointage',
  documents: 'Gestion documentaire',
  evaluations: 'Gestion des évaluations',
  formations: 'Gestion des formations',
  epi: 'Gestion des EPI',
  rapports: 'Rapports et courbes RH'
};

const modulePageNames = ['absences', 'pointage', 'documents', 'evaluations', 'formations', 'epi'];

function showPage(pageName) {
  const page = pageTitles[pageName] ? pageName : 'dashboard';

  pageSections.forEach((section) => {
    const isActive = section.dataset.page === page;
    section.classList.toggle('is-active', isActive);
    section.hidden = !isActive;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.pageLink === page);
  });

  modulePages.classList.toggle('is-active', modulePageNames.includes(page));
  pageTitle.textContent = pageTitles[page];

  if (location.hash !== `#${page}`) {
    history.replaceState(null, '', `#${page}`);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(updateCharts, 80);
}

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

function loadProjects() {
  const saved = localStorage.getItem(projectStorageKey);
  if (!saved) return [...defaultProjects];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...defaultProjects];
  } catch (error) {
    return [...defaultProjects];
  }
}

function saveProjects() {
  localStorage.setItem(projectStorageKey, JSON.stringify(projects));
}

function loadCities() {
  const saved = localStorage.getItem(cityStorageKey);
  if (!saved) return [...defaultCities];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...defaultCities];
  } catch (error) {
    return [...defaultCities];
  }
}

function saveCities() {
  localStorage.setItem(cityStorageKey, JSON.stringify(cities));
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadChartData() {
  const saved = localStorage.getItem(chartStorageKey);
  if (!saved) return cloneData(defaultChartData);

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.sites || !parsed.scores) return cloneData(defaultChartData);
    return parsed;
  } catch (error) {
    return cloneData(defaultChartData);
  }
}

function saveChartData() {
  localStorage.setItem(chartStorageKey, JSON.stringify(chartData));
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
  const activeProjects = projects.filter((project) => project[6] !== 'Terminé').length;

  document.querySelector('#totalCount').textContent = total;
  document.querySelector('#presentCount').textContent = active;
  document.querySelector('#absentCount').textContent = absent;
  document.querySelector('#interimCount').textContent = interim;
  document.querySelector('#projectCount').textContent = projects.length;
  document.querySelector('#cityCount').textContent = cities.length;
  document.querySelector('#totalNote').textContent = `${total} salarié${total > 1 ? 's' : ''} dans l'effectif`;
  document.querySelector('#projectNote').textContent = `${activeProjects} projet${activeProjects > 1 ? 's' : ''} actif${activeProjects > 1 ? 's' : ''}`;
  document.querySelector('#cityNote').textContent = `${cities.length} ville${cities.length > 1 ? 's' : ''} / site${cities.length > 1 ? 's' : ''}`;
}

function renderChartInputs() {
  siteInputs.innerHTML = chartData.sites.labels.map((label, index) => `
    <label>Ville ${index + 1}
      <input class="chart-label" data-chart="sites" data-index="${index}" type="text" value="${label}">
      <input class="chart-value" data-chart="sites" data-index="${index}" type="number" min="0" step="1" value="${chartData.sites.values[index]}">
    </label>
  `).join('');

  scoreInputs.innerHTML = chartData.scores.labels.map((label, index) => `
    <label>${label}
      <input class="chart-value" data-chart="scores" data-index="${index}" type="number" min="1" max="5" step="0.1" value="${chartData.scores.values[index]}">
    </label>
  `).join('');
}

function applyChartInputs() {
  document.querySelectorAll('.chart-label').forEach((input) => {
    const chart = input.dataset.chart;
    const index = Number(input.dataset.index);
    const value = input.value.trim();
    if (!value) return;

    if (chart === 'sites') {
      chartData.sites.labels[index] = value;
      if (!cities.includes(value)) {
        cities.push(value);
        saveCities();
        renderCities();
        renderProjectSiteOptions();
      }
    }
  });

  document.querySelectorAll('.chart-value').forEach((input) => {
    const chart = input.dataset.chart;
    const index = Number(input.dataset.index);
    const value = Number(input.value);
    if (!Number.isFinite(value)) return;

    if (chart === 'sites') {
      chartData.sites.values[index] = Math.max(0, Math.round(value));
    }

    if (chart === 'scores') {
      chartData.scores.values[index] = Math.min(5, Math.max(1, Number(value.toFixed(1))));
    }
  });

  saveChartData();
  renderChartInputs();
  updateCharts();
}

function updateCharts() {
  if (siteChart) {
    siteChart.data.labels = chartData.sites.labels;
    siteChart.data.datasets[0].data = chartData.sites.values;
    siteChart.update();
  }

  if (scoreChart) {
    scoreChart.data.labels = chartData.scores.labels;
    scoreChart.data.datasets[0].data = chartData.scores.values;
    scoreChart.update();
  }

  if (!window.Chart) {
    drawFallbackCharts();
  }
}

function prepareCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width || canvas.parentElement.clientWidth || 520));
  const height = 260;
  canvas.width = width;
  canvas.height = height;
  return { ctx: canvas.getContext('2d'), width, height };
}

function drawFallbackBarChart() {
  const canvas = document.querySelector('#siteChart');
  if (!canvas) return;

  const { ctx, width, height } = prepareCanvas(canvas);
  const padding = 42;
  const values = chartData.sites.values;
  const labels = chartData.sites.labels;
  const max = Math.max(...values, 1);
  const barWidth = (width - padding * 2) / values.length * .64;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#d9e3ee';
  ctx.beginPath();
  ctx.moveTo(padding, 22);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - 18, height - padding);
  ctx.stroke();

  values.forEach((value, index) => {
    const x = padding + index * ((width - padding * 2) / values.length) + 14;
    const barHeight = (value / max) * (height - padding - 42);
    const y = height - padding - barHeight;
    ctx.fillStyle = ['#1d4ed8', '#0f8f9d', '#16803c', '#d97706', '#c2410c'][index] || '#1d4ed8';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#152033';
    ctx.font = '12px Segoe UI, Arial';
    ctx.fillText(String(value), x + 4, y - 7);
    ctx.fillStyle = '#66758a';
    ctx.fillText(labels[index], x - 4, height - 16);
  });
}

function drawFallbackLineChart() {
  const canvas = document.querySelector('#scoreChart');
  if (!canvas) return;

  const { ctx, width, height } = prepareCanvas(canvas);
  const padding = 42;
  const values = chartData.scores.values;
  const labels = chartData.scores.labels;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding - 28;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#d9e3ee';
  ctx.beginPath();
  ctx.moveTo(padding, 22);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - 18, height - padding);
  ctx.stroke();

  const points = values.map((value, index) => ({
    x: padding + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: height - padding - ((value - 1) / 4) * plotHeight
  }));

  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8';
    ctx.stroke();
    ctx.fillStyle = '#152033';
    ctx.font = '12px Segoe UI, Arial';
    ctx.fillText(String(values[index]), point.x - 8, point.y - 12);
    ctx.fillStyle = '#66758a';
    ctx.fillText(labels[index], point.x - 10, height - 16);
  });
}

function drawFallbackCharts() {
  drawFallbackBarChart();
  drawFallbackLineChart();
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
        <td><button class="danger-btn" type="button" data-delete-index="${index}">Supprimer</button></td>
        <td>${employee[2]}</td>
        <td>${employee[3]}</td>
        <td>${employee[4]}</td>
        <td>${employee[5]}</td>
        <td>${employee[6]}</td>
        <td><span class="badge">${employee[7]}</span></td>
        <td class="${statusClass}">${employee[8]}</td>
      </tr>
    `;
  }).join('');
  updateStats();
}

function renderProjects() {
  projectTbody.innerHTML = projects.map((project, index) => {
    const statusClass = project[6] === 'Terminé' ? 'ok' : project[6] === 'Suspendu' ? 'late' : 'project-active';
    return `
      <tr>
        <td>${project[0]}</td>
        <td>${project[1]}</td>
        <td><button class="danger-btn" type="button" data-delete-project="${index}">Supprimer</button></td>
        <td>${project[2]}</td>
        <td>${project[3]}</td>
        <td>${project[4]}</td>
        <td>${project[5] || '-'}</td>
        <td class="${statusClass}">${project[6]}</td>
      </tr>
    `;
  }).join('');
  updateStats();
}

function renderProjectSiteOptions() {
  const selected = document.querySelector('#projectSite').value;
  document.querySelector('#projectSite').innerHTML = cities
    .map((city) => `<option value="${city}">${city}</option>`)
    .join('');

  if (cities.includes(selected)) {
    document.querySelector('#projectSite').value = selected;
  }
}

function renderCities() {
  cityTbody.innerHTML = cities.map((city, index) => `
    <tr>
      <td><input class="city-edit" data-city-index="${index}" value="${city}"></td>
      <td><button class="save-btn" type="button" data-save-city="${index}">Enregistrer</button></td>
      <td><button class="danger-btn" type="button" data-delete-city="${index}">Supprimer</button></td>
    </tr>
  `).join('');
  updateStats();
}

function renameCity(index, newName) {
  const oldName = cities[index];
  if (!oldName || !newName) return;

  cities[index] = newName;
  projects = projects.map((project) => project[3] === oldName ? [...project.slice(0, 3), newName, ...project.slice(4)] : project);
  chartData.sites.labels = chartData.sites.labels.map((label) => label === oldName ? newName : label);
  saveCities();
  saveProjects();
  saveChartData();
  renderCities();
  renderProjects();
  renderProjectSiteOptions();
  renderChartInputs();
  updateCharts();
}

searchInput.addEventListener('input', () => {
  renderEmployees();
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showPage(link.dataset.pageLink);
  });
});

window.addEventListener('hashchange', () => {
  showPage(location.hash.replace('#', '') || 'dashboard');
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
document.querySelector('#openProjectModal').addEventListener('click', () => projectModal.showModal());
document.querySelector('#closeProjectModal').addEventListener('click', () => projectModal.close());

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

projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const project = [
    document.querySelector('#projectCode').value.trim(),
    document.querySelector('#projectName').value.trim(),
    document.querySelector('#projectClient').value.trim(),
    document.querySelector('#projectSite').value.trim(),
    document.querySelector('#projectManager').value.trim(),
    document.querySelector('#projectStart').value,
    document.querySelector('#projectStatus').value
  ];

  const projectExists = projects.some((row) => row[0].toLowerCase() === project[0].toLowerCase());
  if (projectExists) {
    alert('Ce code projet existe deja.');
    return;
  }

  projects.push(project);
  saveProjects();
  projectForm.reset();
  projectModal.close();
  renderProjects();
});

projectTbody.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-project]');
  if (!deleteButton) return;

  const index = Number(deleteButton.dataset.deleteProject);
  if (!projects[index]) return;

  projects.splice(index, 1);
  saveProjects();
  renderProjects();
});

addCityBtn.addEventListener('click', () => {
  const city = cityNameInput.value.trim();
  if (!city) return;

  const exists = cities.some((item) => item.toLowerCase() === city.toLowerCase());
  if (exists) {
    alert('Cette ville existe deja.');
    return;
  }

  cities.push(city);
  saveCities();
  cityNameInput.value = '';
  renderCities();
  renderProjectSiteOptions();
});

cityNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addCityBtn.click();
  }
});

cityTbody.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save-city]');
  const deleteButton = event.target.closest('[data-delete-city]');

  if (saveButton) {
    const index = Number(saveButton.dataset.saveCity);
    const input = cityTbody.querySelector(`[data-city-index="${index}"]`);
    renameCity(index, input.value.trim());
    return;
  }

  if (deleteButton) {
    const index = Number(deleteButton.dataset.deleteCity);
    if (!cities[index]) return;

    const city = cities[index];
    cities.splice(index, 1);
    projects = projects.map((project) => project[3] === city ? [...project.slice(0, 3), '', ...project.slice(4)] : project);
    chartData.sites.labels = chartData.sites.labels.filter((label) => label !== city);
    chartData.sites.values = chartData.sites.values.slice(0, chartData.sites.labels.length);
    saveCities();
    saveProjects();
    saveChartData();
    renderCities();
    renderProjects();
    renderProjectSiteOptions();
    renderChartInputs();
    updateCharts();
  }
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

applyChartsBtn.addEventListener('click', applyChartInputs);

resetChartsBtn.addEventListener('click', () => {
  chartData = cloneData(defaultChartData);
  saveChartData();
  renderChartInputs();
  updateCharts();
});

renderEmployees();
renderProjectSiteOptions();
renderProjects();
renderCities();
renderChartInputs();
restoreSession();
showPage(location.hash.replace('#', '') || 'dashboard');

if (window.Chart) {
  siteChart = new Chart(document.querySelector('#siteChart'), {
    type: 'bar',
    data: {
      labels: chartData.sites.labels,
      datasets: [{
        label: 'Effectif',
        data: chartData.sites.values,
        backgroundColor: ['#1d4ed8', '#0f8f9d', '#16803c', '#d97706', '#c2410c']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });

  scoreChart = new Chart(document.querySelector('#scoreChart'), {
    type: 'line',
    data: {
      labels: chartData.scores.labels,
      datasets: [{
        label: 'Score moyen',
        data: chartData.scores.values,
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
} else {
  drawFallbackCharts();
  window.addEventListener('resize', drawFallbackCharts);
}
