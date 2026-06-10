let absences = JSON.parse(localStorage.getItem("absencesRH")) || [];

const form = document.getElementById("absenceForm");
const table = document.getElementById("absenceTable");
const searchInput = document.getElementById("searchInput");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const absence = {
    id: Date.now(),
    nom: document.getElementById("nom").value.trim(),
    matricule: document.getElementById("matricule").value.trim(),
    type: document.getElementById("type").value,
    dateDebut: document.getElementById("dateDebut").value,
    dateFin: document.getElementById("dateFin").value,
    statut: document.getElementById("statut").value,
    commentaire: document.getElementById("commentaire").value.trim()
  };

  if (new Date(absence.dateFin) < new Date(absence.dateDebut)) {
    alert("La date de fin ne peut pas être avant la date de début.");
    return;
  }

  absences.push(absence);
  save();
  form.reset();
  render();
});

searchInput.addEventListener("input", render);

function calculateDays(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = d2 - d1;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function badgeClass(statut) {
  return statut.toLowerCase().replace(" ", "-");
}

function render() {
  const q = searchInput.value.toLowerCase();
  table.innerHTML = "";

  const filtered = absences.filter(a =>
    a.nom.toLowerCase().includes(q) ||
    a.matricule.toLowerCase().includes(q) ||
    a.type.toLowerCase().includes(q)
  );

  filtered.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.nom}</td>
      <td>${a.matricule}</td>
      <td>${a.type}</td>
      <td>${a.dateDebut}</td>
      <td>${a.dateFin}</td>
      <td>${calculateDays(a.dateDebut, a.dateFin)}</td>
      <td><span class="badge ${badgeClass(a.statut)}">${a.statut}</span></td>
      <td>${a.commentaire || "-"}</td>
      <td><button class="delete" onclick="deleteAbsence(${a.id})">Supprimer</button></td>
    `;
    table.appendChild(tr);
  });

  updateStats();
}

function updateStats() {
  document.getElementById("total").textContent = absences.length;
  document.getElementById("validees").textContent = absences.filter(a => a.statut === "Validée").length;
  document.getElementById("attente").textContent = absences.filter(a => a.statut === "En attente").length;
  document.getElementById("refusees").textContent = absences.filter(a => a.statut === "Refusée").length;
}

function deleteAbsence(id) {
  if (!confirm("Supprimer cette absence ?")) return;
  absences = absences.filter(a => a.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem("absencesRH", JSON.stringify(absences));
}

function exportCSV() {
  if (absences.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }

  const headers = ["Nom", "Matricule", "Type", "Date début", "Date fin", "Jours", "Statut", "Commentaire"];
  const rows = absences.map(a => [
    a.nom,
    a.matricule,
    a.type,
    a.dateDebut,
    a.dateFin,
    calculateDays(a.dateDebut, a.dateFin),
    a.statut,
    a.commentaire
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "absences-rh.csv";
  link.click();
  URL.revokeObjectURL(url);
}

render();
