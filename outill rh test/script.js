let salaries = JSON.parse(localStorage.getItem("salariesRH")) || [];
let absences = JSON.parse(localStorage.getItem("absencesRH")) || [];
let evaluations = JSON.parse(localStorage.getItem("evaluationsRH")) || [];

const salarieForm = document.getElementById("salarieForm");
const absenceForm = document.getElementById("absenceForm");
const evaluationForm = document.getElementById("evaluationForm");

salarieForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const salarie = {
    id: Date.now(),
    nom: document.getElementById("nomSalarie").value.trim(),
    matricule: document.getElementById("matriculeSalarie").value.trim(),
    poste: document.getElementById("posteSalarie").value.trim(),
    departement: document.getElementById("departementSalarie").value.trim(),
    dateEmbauche: document.getElementById("dateEmbauche").value,
    statut: document.getElementById("statutSalarie").value
  };

  salaries.push(salarie);
  save();
  salarieForm.reset();
  render();
});

absenceForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const absence = {
    id: Date.now(),
    nom: document.getElementById("absenceNom").value.trim(),
    matricule: document.getElementById("absenceMatricule").value.trim(),
    type: document.getElementById("absenceType").value,
    debut: document.getElementById("absenceDebut").value,
    fin: document.getElementById("absenceFin").value,
    statut: document.getElementById("absenceStatut").value,
    commentaire: document.getElementById("absenceCommentaire").value.trim()
  };

  if (new Date(absence.fin) < new Date(absence.debut)) {
    alert("La date de fin ne peut pas être avant la date de début.");
    return;
  }

  absences.push(absence);
  save();
  absenceForm.reset();
  render();
});

evaluationForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const evaluation = {
    id: Date.now(),
    nom: document.getElementById("evalNom").value.trim(),
    matricule: document.getElementById("evalMatricule").value.trim(),
    date: document.getElementById("evalDate").value,
    responsable: document.getElementById("evalResponsable").value.trim(),
    note: Number(document.getElementById("evalNote").value),
    commentaire: document.getElementById("evalCommentaire").value.trim()
  };

  evaluations.push(evaluation);
  save();
  evaluationForm.reset();
  render();
});

function render() {
  renderSalaries();
  renderAbsences();
  renderEvaluations();
  updateDashboard();
}

function renderSalaries() {
  const table = document.getElementById("salariesTable");
  table.innerHTML = "";

  salaries.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.nom}</td>
        <td>${s.matricule}</td>
        <td>${s.poste}</td>
        <td>${s.departement || "-"}</td>
        <td>${s.statut}</td>
        <td><button class="delete" onclick="deleteSalarie(${s.id})">Supprimer</button></td>
      </tr>
    `;
  });
}

function renderAbsences() {
  const table = document.getElementById("absencesTable");
  table.innerHTML = "";

  absences.forEach(a => {
    table.innerHTML += `
      <tr>
        <td>${a.nom}</td>
        <td>${a.matricule}</td>
        <td>${a.type}</td>
        <td>${a.debut}</td>
        <td>${a.fin}</td>
        <td>${a.statut}</td>
        <td><button class="delete" onclick="deleteAbsence(${a.id})">Supprimer</button></td>
      </tr>
    `;
  });
}

function renderEvaluations() {
  const table = document.getElementById("evaluationsTable");
  table.innerHTML = "";

  evaluations.forEach(e => {
    table.innerHTML += `
      <tr>
        <td>${e.nom}</td>
        <td>${e.matricule}</td>
        <td>${e.date}</td>
        <td>${e.note}/5</td>
        <td>${e.responsable || "-"}</td>
        <td><button class="delete" onclick="deleteEvaluation(${e.id})">Supprimer</button></td>
      </tr>
    `;
  });
}

function updateDashboard() {
  document.getElementById("totalSalaries").textContent = salaries.length;
  document.getElementById("totalAbsences").textContent = absences.length;
  document.getElementById("totalEvaluations").textContent = evaluations.length;

  const moyenne = evaluations.length
    ? evaluations.reduce((total, e) => total + e.note, 0) / evaluations.length
    : 0;

  document.getElementById("moyenneNote").textContent = moyenne.toFixed(1);
}

function deleteSalarie(id) {
  if (!confirm("Supprimer ce salarié ?")) return;
  salaries = salaries.filter(s => s.id !== id);
  save();
  render();
}

function deleteAbsence(id) {
  if (!confirm("Supprimer cette absence ?")) return;
  absences = absences.filter(a => a.id !== id);
  save();
  render();
}

function deleteEvaluation(id) {
  if (!confirm("Supprimer cette évaluation ?")) return;
  evaluations = evaluations.filter(e => e.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem("salariesRH", JSON.stringify(salaries));
  localStorage.setItem("absencesRH", JSON.stringify(absences));
  localStorage.setItem("evaluationsRH", JSON.stringify(evaluations));
}

render();
