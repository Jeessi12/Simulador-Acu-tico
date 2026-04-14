let notifications = [
  { id: 1, from: "Docente bachillerato", subject: "Nueva actividad: simulación sobre estrellas de mar", unread: true, destacado: false, archivado: false, importante: true, spam: false, fecha: new Date(2025, 3, 2, 10, 30) },
  { id: 2, from: "Sistema Ecosistemas", subject: "Actualización del módulo de arrecifes completada", unread: false, destacado: true, archivado: false, importante: false, spam: false, fecha: new Date(2025, 3, 1, 15, 20) },
  { id: 3, from: "Admin Marino", subject: "Revisión de simulación pendiente", unread: true, destacado: false, archivado: false, importante: true, spam: false, fecha: new Date(2025, 2, 30, 9, 0) },
  { id: 4, from: "Profesor Coral", subject: "Nueva especie añadida al ecosistema", unread: false, destacado: false, archivado: false, importante: false, spam: false, fecha: new Date(2025, 2, 28, 14, 45) },
  { id: 5, from: "Oferta Educativa", subject: "Curso de biología marina disponible", unread: true, destacado: false, archivado: false, importante: false, spam: true, fecha: new Date(2025, 2, 25, 11, 0) }
];

let currentFilter = "recibidos";
let currentPage = 1;
let itemsPerPage = 5;
let selectedIds = new Set();
let searchTerm = "";

// Elementos DOM
const notificationList = document.getElementById("notificationList");
const refreshBtn = document.getElementById("refresh");
const markReadBtn = document.getElementById("markReadBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const selectAllBtn = document.getElementById("selectAllBtn");
const searchInput = document.getElementById("searchInput");
const headerCheckbox = document.getElementById("headerCheckbox");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const emptyState = document.getElementById("emptyState");

function filterNotifications() {
  let filtered = [...notifications];
  
  // Filtro por categoría
  switch(currentFilter) {
    case "recibidos":
      filtered = filtered.filter(n => !n.eliminado && !n.archivado);
      break;
    case "destacados":
      filtered = filtered.filter(n => n.destacado && !n.eliminado);
      break;
    case "no-leidos":
      filtered = filtered.filter(n => n.unread && !n.eliminado && !n.archivado);
      break;
    case "papelera":
      filtered = filtered.filter(n => n.eliminado);
      break;
    case "archivados":
      filtered = filtered.filter(n => n.archivado && !n.eliminado);
      break;
    case "importantes":
      filtered = filtered.filter(n => n.importante && !n.eliminado);
      break;
    case "spam":
      filtered = filtered.filter(n => n.spam && !n.eliminado);
      break;
    default:
      filtered = filtered.filter(n => !n.eliminado);
  }
  
  if (searchTerm) {
    filtered = filtered.filter(n => 
      n.from.toLowerCase().includes(searchTerm) || 
      n.subject.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
}

function updateCounters() {
  const recibidos = notifications.filter(n => !n.eliminado && !n.archivado).length;
  const destacados = notifications.filter(n => n.destacado && !n.eliminado).length;
  const noLeidos = notifications.filter(n => n.unread && !n.eliminado && !n.archivado).length;
  
  document.getElementById("recibidosCount").textContent = recibidos || "";
  document.getElementById("destacadosCount").textContent = destacados || "";
  document.getElementById("noLeidosCount").textContent = noLeidos || "";
}


function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Justo ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString();
}

function renderNotifications() {
  const filtered = filterNotifications();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  

  if (paginated.length === 0) {
    notificationList.style.display = "none";
    emptyState.style.display = "block";
    document.getElementById("pagination").style.display = "none";
    return;
  }
  
  notificationList.style.display = "block";
  emptyState.style.display = "none";
  document.getElementById("pagination").style.display = "flex";
  
  notificationList.innerHTML = `
    <div class="row header-row">
      <span class="checkbox-cell"><input type="checkbox" id="headerCheckboxDynamic"></span>
      <span>De</span>
      <span>Asunto</span>
      <span class="date-cell">Fecha</span>
    </div>
  `;
  
  paginated.forEach((notif, index) => {
    const row = document.createElement("div");
    row.className = `row ${notif.unread ? 'unread' : ''}`;
    row.style.animationDelay = `${index * 0.05}s`;
    row.dataset.id = notif.id;
    
    row.innerHTML = `
      <span class="checkbox-cell"><input type="checkbox" class="notif-checkbox" ${selectedIds.has(notif.id) ? 'checked' : ''}></span>
      <span class="from-cell"><i class="fas fa-user-circle"></i> ${escapeHtml(notif.from)}</span>
      <span class="subject-cell">${escapeHtml(notif.subject)}</span>
      <span class="date-cell"><i class="far fa-clock"></i> ${formatDate(notif.fecha)}</span>
    `;
    
    notificationList.appendChild(row);
  });
  

  attachCheckboxEvents();

  const headerCheckboxDynamic = document.getElementById("headerCheckboxDynamic");
  if (headerCheckboxDynamic) {
    headerCheckboxDynamic.checked = selectedIds.size === paginated.length && paginated.length > 0;
    headerCheckboxDynamic.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        paginated.forEach(n => selectedIds.add(n.id));
      } else {
        paginated.forEach(n => selectedIds.delete(n.id));
      }
      renderNotifications();
    });
  }
  

  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function attachCheckboxEvents() {
  document.querySelectorAll(".notif-checkbox").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const row = cb.closest(".row");
      const id = parseInt(row.dataset.id);
      if (cb.checked) {
        selectedIds.add(id);
      } else {
        selectedIds.delete(id);
      }
      renderNotifications();
    });
  });
}

function refreshNotifications() {
  const newNotif = {
    id: Date.now(),
    from: "Sistema Marino",
    subject: "Nueva simulación disponible: Ecosistema de arrecifes",
    unread: true,
    destacado: false,
    archivado: false,
    importante: false,
    spam: false,
    fecha: new Date()
  };
  notifications.unshift(newNotif);
  selectedIds.clear();
  currentPage = 1;
  updateCounters();
  renderNotifications();
  
  // Animación de feedback
  refreshBtn.style.transform = "rotate(180deg)";
  setTimeout(() => { refreshBtn.style.transform = ""; }, 300);
}

function markSelectedAsRead() {
  selectedIds.forEach(id => {
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.unread = false;
  });
  selectedIds.clear();
  updateCounters();
  renderNotifications();
}

function deleteSelected() {
  selectedIds.forEach(id => {
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.eliminado = true;
  });
  selectedIds.clear();
  updateCounters();
  renderNotifications();
}

function selectAll() {
  const filtered = filterNotifications();
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  
  if (selectedIds.size === paginated.length && paginated.length > 0) {
    selectedIds.clear();
  } else {
    paginated.forEach(n => selectedIds.add(n.id));
  }
  renderNotifications();
}

const sidebarItems = document.querySelectorAll(".sidebar li:not(.more-container)");
sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".sidebar .active")?.classList.remove("active");
    item.classList.add("active");
    
    const filter = item.getAttribute("data-filter") || "recibidos";
    currentFilter = filter;
    currentPage = 1;
    selectedIds.clear();
    renderNotifications();
  });
});

// Dropdown items
document.querySelectorAll(".dropdown li").forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    const filter = item.getAttribute("data-filter");
    currentFilter = filter;
    currentPage = 1;
    selectedIds.clear();
    renderNotifications();
    document.querySelector(".dropdown").classList.remove("show");
    

    document.querySelector(".sidebar .active")?.classList.remove("active");
  });
});


const moreBtn = document.getElementById("moreBtn");
const dropdown = document.getElementById("dropdownMenu");

moreBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});


searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  currentPage = 1;
  renderNotifications();
});


prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderNotifications();
  }
});

nextPageBtn.addEventListener("click", () => {
  const filtered = filterNotifications();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderNotifications();
  }
});

refreshBtn.addEventListener("click", refreshNotifications);
markReadBtn.addEventListener("click", markSelectedAsRead);
deleteSelectedBtn.addEventListener("click", deleteSelected);
selectAllBtn.addEventListener("click", selectAll);

// Inicialización
updateCounters();
renderNotifications();