document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main-content');
    const sidebar = document.querySelector('.sidebar');
    let currentFilter = 'recibidos';
    let currentPage = 1;
    let currentSearch = '';

    loadContent(currentFilter, currentPage, currentSearch);

    // Filtros del sidebar
    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-filtro]');
        if (!link) return;
        e.preventDefault();
        currentFilter = link.dataset.filtro;
        currentPage = 1;
        currentSearch = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        link.parentElement.classList.add('active');
        loadContent(currentFilter, currentPage, currentSearch);
        history.pushState(null, '', `?filtro=${currentFilter}`);
    });

    // Búsqueda con debounce
    let searchTimer;
    main.addEventListener('input', (e) => {
        if (e.target.id === 'searchInput') {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentSearch = e.target.value.trim();
                currentPage = 1;
                loadContent(currentFilter, currentPage, currentSearch);
            }, 300);
        }
    });

    // Paginación
    main.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.page-btn');
        if (pageBtn) {
            e.preventDefault();
            currentPage = parseInt(pageBtn.dataset.page);
            loadContent(currentFilter, currentPage, currentSearch);
        }
    });

    // Formulario de acciones (marcar leídas, etc.)
    main.addEventListener('submit', (e) => {
        const form = e.target.closest('#notifForm');
        if (!form) return;
        e.preventDefault();
        const formData = new FormData(form);
        fetch('../views/notificaciones_lista.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(() => {
            loadContent(currentFilter, currentPage, currentSearch);
        });
    });
});

function loadContent(filtro, pagina, search) {
    const main = document.getElementById('main-content');
    const url = `../views/notificaciones_lista.php?filtro=${filtro}&pagina=${pagina}&search=${encodeURIComponent(search)}`;
    fetch(url)
    .then(response => response.text())
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
    });
}

function attachActionEvents(filtro) {
    const form = document.getElementById('notifForm');
    if (!form) return;

    const submitAction = (action) => {
        const checkboxes = form.querySelectorAll('.notif-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Selecciona al menos una notificación.');
            return;
        }
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = action;
        input.value = '1';
        form.appendChild(input);
        form.submit();
    };

    document.getElementById('marcarLeidasBtn')?.addEventListener('click', () => submitAction('marcar_leidas'));
    document.getElementById('destacarBtn')?.addEventListener('click', () => submitAction('marcar_destacadas'));
    document.getElementById('archivarBtn')?.addEventListener('click', () => submitAction('archivar'));
    document.getElementById('eliminarBtn')?.addEventListener('click', () => submitAction('eliminar'));
    document.getElementById('restaurarBtn')?.addEventListener('click', () => submitAction('restaurar'));
}
