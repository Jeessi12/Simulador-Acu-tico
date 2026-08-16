document.addEventListener('DOMContentLoaded', () => {
    const main    = document.getElementById('main-content');
    const sidebar = document.querySelector('.sidebar');
    let currentFilter = 'recibidos';
    let currentPage   = 1;
    let currentSearch = '';

    loadContent(currentFilter, currentPage, currentSearch);

    // ── Filtros del sidebar ───────────────────────────────────────────────────
    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-filtro]');
        if (!link) return;
        e.preventDefault();
        currentFilter = link.dataset.filtro;
        currentPage   = 1;
        currentSearch = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        link.parentElement.classList.add('active');
        loadContent(currentFilter, currentPage, currentSearch);
        history.pushState(null, '', `?filtro=${currentFilter}`);
    });

    // ── Búsqueda con debounce ─────────────────────────────────────────────────
    let searchTimer;
    main.addEventListener('input', (e) => {
        if (e.target.id === 'searchInput') {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentSearch = e.target.value.trim();
                currentPage   = 1;
                loadContent(currentFilter, currentPage, currentSearch);
            }, 300);
        }
    });

    // ── Paginación ────────────────────────────────────────────────────────────
    main.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.page-btn');
        if (pageBtn) {
            e.preventDefault();
            currentPage = parseInt(pageBtn.dataset.page);
            loadContent(currentFilter, currentPage, currentSearch);
            return;
        }

        // ── Aceptar invitación ────────────────────────────────────────────────
        const btnAceptar = e.target.closest('.btn-aceptar-inv');
        if (btnAceptar) {
            const idNotif   = btnAceptar.dataset.notif;
            const idEspacio = btnAceptar.dataset.espacio;
            responderInvitacion('aceptar', idNotif, idEspacio);
            return;
        }

        // ── Rechazar invitación ───────────────────────────────────────────────
        const btnRechazar = e.target.closest('.btn-rechazar-inv');
        if (btnRechazar) {
            const idNotif   = btnRechazar.dataset.notif;
            const idEspacio = btnRechazar.dataset.espacio;
            responderInvitacion('rechazar', idNotif, idEspacio);
            return;
        }
    });

    // ── Acciones masivas ──────────────────────────────────────────────────────
    main.addEventListener('submit', (e) => {
        const form = e.target.closest('#notifForm');
        if (!form) return;
        e.preventDefault();
        const formData = new FormData(form);
        fetch('../views/notificaciones_lista.php', { method: 'POST', body: formData })
            .then(r => r.text())
            .then(() => loadContent(currentFilter, currentPage, currentSearch));
    });
});

// ── Cargar lista de notificaciones ────────────────────────────────────────────
function loadContent(filtro, pagina, search) {
    const main = document.getElementById('main-content');
    const url  = `../views/notificaciones_lista.php?filtro=${filtro}&pagina=${pagina}&search=${encodeURIComponent(search)}`;

    fetch(url)
        .then(r => r.text())
        .then(html => {
            main.innerHTML = `
                <div class="header">
                    <div class="header-actions">
                        ${filtro !== 'papelera' ? `
                            <button type="button" class="btn-accion" id="marcarLeidasBtn"><i class="fas fa-check-double"></i> Marcar leídas</button>
                            <button type="button" class="btn-accion" id="destacarBtn"><i class="fas fa-star"></i> Destacar</button>
                            <button type="button" class="btn-accion" id="archivarBtn"><i class="fas fa-archive"></i> Archivar</button>
                            <button type="button" class="btn-accion" id="eliminarBtn"><i class="fas fa-trash"></i> Eliminar</button>
                        ` : `
                            <button type="button" class="btn-accion" id="restaurarBtn"><i class="fas fa-undo"></i> Restaurar</button>
                        `}
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Buscar..." value="${search}">
                    </div>
                </div>
                <div class="list-container">
                    <form id="notifForm" method="post">
                        <input type="hidden" name="filtro" value="${filtro}">
                        <div class="list">
                            <div class="row header-row">
                                <span class="checkbox-cell"><input type="checkbox" id="headerCheckbox"></span>
                                <span>De</span>
                                <span>Asunto</span>
                                <span class="date-cell">Fecha</span>
                            </div>
                            ${html}
                        </div>
                    </form>
                </div>
            `;
            attachActionEvents(filtro);
            attachHeaderCheckbox();
        });
}

// ── Checkbox "seleccionar todo" ───────────────────────────────────────────────
function attachHeaderCheckbox() {
    const headerCb = document.getElementById('headerCheckbox');
    if (!headerCb) return;
    headerCb.addEventListener('change', () => {
        document.querySelectorAll('.notif-checkbox').forEach(cb => {
            cb.checked = headerCb.checked;
        });
    });
}

// ── Acciones de formulario masivas ────────────────────────────────────────────
function attachActionEvents(filtro) {
    const form = document.getElementById('notifForm');
    if (!form) return;

    const submitAction = (action) => {
        const checkboxes = form.querySelectorAll('.notif-checkbox:checked');
        if (checkboxes.length === 0) {
            showToast('Selecciona al menos una notificación.', 'warn');
            return;
        }
        const input = document.createElement('input');
        input.type  = 'hidden';
        input.name  = action;
        input.value = '1';
        form.appendChild(input);
        form.submit();
    };

    document.getElementById('marcarLeidasBtn')?.addEventListener('click', () => submitAction('marcar_leidas'));
    document.getElementById('destacarBtn')?.addEventListener('click',     () => submitAction('marcar_destacadas'));
    document.getElementById('archivarBtn')?.addEventListener('click',     () => submitAction('archivar'));
    document.getElementById('eliminarBtn')?.addEventListener('click',     () => submitAction('eliminar'));
    document.getElementById('restaurarBtn')?.addEventListener('click',    () => submitAction('restaurar'));
}

// ── Responder invitación ──────────────────────────────────────────────────────
function responderInvitacion(accion, idNotif, idEspacio) {
    const fd = new FormData();
    fd.append('id_notif',       idNotif);
    fd.append('id_espacio_inv', idEspacio);
    fd.append(accion === 'aceptar' ? 'aceptar_invitacion' : 'rechazar_invitacion', '1');

    // Feedback visual inmediato en el botón
    const row = document.querySelector(`.row[data-id="${idNotif}"]`);
    if (row) {
        const acciones = row.querySelector('.inv-actions');
        if (acciones) {
            acciones.innerHTML = `<span class="inv-cargando"><i class="fas fa-spinner fa-spin"></i> Procesando...</span>`;
        }
    }

    fetch('../views/notificaciones_lista.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => {
            if (data.ok) {
                const msg   = accion === 'aceptar' ? '¡Te uniste al espacio!' : 'Invitación rechazada.';
                const tipo  = accion === 'aceptar' ? 'success' : 'info';
                showToast(msg, tipo);
                setTimeout(() => loadContent('recibidos', 1, ''), 800);
            } else {
                showToast(data.message || 'No fue posible procesar la invitación.', 'error');
                setTimeout(() => loadContent('recibidos', 1, ''), 800);
            }
        })
        .catch(() => showToast('Error al procesar la invitación.', 'error'));
}

// ── Toast liviano (sin dependencia de SweetAlert) ─────────────────────────────
function showToast(msg, tipo = 'info') {
    let toast = document.getElementById('notif-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'notif-toast';
        document.body.appendChild(toast);
    }
    const colores = {
        success: '#34a853',
        error:   '#ea4335',
        warn:    '#fbbc04',
        info:    '#3d8fd1',
    };
    toast.style.cssText = `
        position:fixed; bottom:28px; right:28px; z-index:99999;
        background:${colores[tipo] ?? colores.info}; color:#fff;
        padding:14px 24px; border-radius:14px;
        font-family:'Poppins',sans-serif; font-size:14px; font-weight:500;
        box-shadow:0 8px 24px rgba(0,0,0,0.18);
        transition:opacity .3s ease; opacity:1;
    `;
    toast.textContent = msg;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}
