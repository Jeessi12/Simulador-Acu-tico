 // ── Tabs de tareas ──────────────────────────────────────────────────────────
    function switchTab(tab, btn) {
        document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.task-content').forEach(c => c.classList.remove('visible'));
        btn.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('visible');
    }

    // ── Filtro búsqueda de estudiantes ──────────────────────────────────────────
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            const filter = this.value.toLowerCase();
            document.querySelectorAll('.student-item').forEach(s => {
                s.style.display = s.textContent.toLowerCase().includes(filter) ? 'flex' : 'none';
            });
        });
    }

    // ── Modal selección de fondo ────────────────────────────────────────────────
    const modal        = document.getElementById('modalFondo');
    const inputNombre  = document.getElementById('inputNombreEspacio');
    const btnAbrir     = document.getElementById('btnAbrirModal');
    const btnCerrar    = document.getElementById('btnCerrarModal');
    const btnCancelar  = document.getElementById('btnCancelarModal');
    const btnConfirmar = document.getElementById('btnConfirmarFondo');

    function abrirModal() {
        if (!inputNombre) return;
        const nombre = inputNombre.value.trim();
        if (!nombre) {
            inputNombre.focus();
            inputNombre.style.outline = '2px solid #e74c3c';
            setTimeout(() => inputNombre.style.outline = '', 1500);
            return;
        }
        document.querySelectorAll('input[name="fondo_sel"]').forEach(r => r.checked = false);
        document.querySelectorAll('.fondo-item').forEach(i => i.classList.remove('selected'));
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => modal.querySelector('.modal-box').classList.add('modal-box--in'), 10);
    }

    function cerrarModal() {
        modal.querySelector('.modal-box').classList.remove('modal-box--in');
        setTimeout(() => { modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true'); }, 250);
    }

    btnAbrir?.addEventListener('click', abrirModal);
    btnCerrar?.addEventListener('click', cerrarModal);
    btnCancelar?.addEventListener('click', cerrarModal);
    modal?.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
    inputNombre?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); abrirModal(); } });

    document.querySelectorAll('input[name="fondo_sel"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.fondo-item').forEach(i => i.classList.remove('selected'));
            radio.closest('.fondo-item').classList.add('selected');
        });
    });

    btnConfirmar?.addEventListener('click', () => {
        const sel = document.querySelector('input[name="fondo_sel"]:checked');
        if (!sel) {
            const grid = document.querySelector('.fondos-grid');
            grid.classList.add('shake');
            setTimeout(() => grid.classList.remove('shake'), 500);
            return;
        }
        document.getElementById('hiddenNombre').value = inputNombre.value.trim();
        document.getElementById('hiddenImagen').value = sel.value;
        document.getElementById('formCrearEspacio').submit();
    });

  // ── Estilos base compartidos para los 3 modales ──────────────────────────────
const swalBase = {
    buttonsStyling: false,
    showCancelButton: true,
    title: '',          // ← vacío, el título va dentro del html
    customClass: {
        popup:         'swal2-ecosim-popup',
        confirmButton: 'swal2-ecosim-confirm',
        cancelButton:  'swal2-ecosim-cancel',
        htmlContainer: 'swal2-ecosim-html'
    }
};

function iconCircle(svg) {
    return `
        <div style="
            width:72px; height:72px;
            background:linear-gradient(145deg,#dff3ff,#b8e6ff);
            border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            margin:0 auto 16px;
            box-shadow:0 4px 18px rgba(45,156,219,0.2);
            border:2px solid rgba(45,156,219,0.15)">
            ${svg}
        </div>`;
}

function modalTitle(texto) {
    return `<p style="
        font-size:1.1rem; font-weight:600;
        color:#0f172a; margin:0 0 12px;
        line-height:1.3">${texto}</p>`;
}

function modalBody(nombre) {
    return `<p style="
        font-size:0.95rem; color:#334155;
        margin:0 0 4px; line-height:1.5">
        Estás por eliminar<br>
        <strong style="
            color:#0f172a; font-size:1rem;
            display:block; margin-top:6px">
            "${nombre}"
        </strong>
    </p>`;
}

function warnBox(texto) {
    return `
        <div style="
            display:flex; gap:10px; align-items:flex-start;
            background:#f0f9ff;
            border:1px solid rgba(45,156,219,0.2);
            border-radius:14px;
            padding:12px 14px;
            margin-top:14px; text-align:left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="#2d9cdb" stroke-width="2"
                 style="flex-shrink:0;margin-top:1px">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style="font-size:0.82rem;color:#475569;line-height:1.5">${texto}</span>
        </div>`;
}

const trashIcon = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"
    stroke="#1a6fa3" stroke-width="1.8">
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8
             a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
</svg>`;

// ── SweetAlert eliminar espacio (lista) ──────────────────────────────────────
document.querySelectorAll('.btn-delete-space').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const { id, nombre } = btn.dataset;
        Swal.fire({
            ...swalBase,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText:  'Cancelar',
            html: `
                ${iconCircle(trashIcon)}
                ${modalTitle('¿Eliminar espacio?')}
                ${modalBody(nombre)}
                ${warnBox('Las asignaciones de todos los miembros en este espacio también serán eliminadas permanentemente.')}
            `,
        }).then(r => { if (r.isConfirmed) document.getElementById(`deleteForm_${id}`).submit(); });
    });
});

// ── SweetAlert eliminar espacio (detalle) ────────────────────────────────────
const btnDetalle = document.getElementById('btnEliminarDetalle');
if (btnDetalle) {
    btnDetalle.addEventListener('click', () => {
        const nombre = btnDetalle.dataset.nombre;
        Swal.fire({
            ...swalBase,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText:  'Cancelar',
            html: `
                ${iconCircle(trashIcon)}
                ${modalTitle('¿Eliminar espacio?')}
                ${modalBody(nombre)}
                ${warnBox('Se eliminarán los miembros y todas sus asignaciones en este espacio permanentemente.')}
            `,
        }).then(r => { if (r.isConfirmed) document.getElementById('formEliminarDetalle').submit(); });
    });
}

// ── SweetAlert eliminar miembro ──────────────────────────────────────────────
const memberIcon = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"
    stroke="#1a6fa3" stroke-width="1.8">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="17" y1="11" x2="22" y2="16"/>
    <line x1="22" y1="11" x2="17" y2="16"/>
</svg>`;

document.querySelectorAll('.btn-remove-member').forEach(btn => {
    btn.addEventListener('click', () => {
        const { id, nombre } = btn.dataset;
        Swal.fire({
            ...swalBase,
            confirmButtonText: 'Sí, quitar',
            cancelButtonText:  'Cancelar',
            html: `
                ${iconCircle(memberIcon)}
                ${modalTitle('¿Quitar miembro?')}
                <p style="font-size:0.95rem;color:#334155;margin:0;line-height:1.5">
                    Estás por quitar a<br>
                    <strong style="color:#0f172a;font-size:1rem;display:block;margin-top:6px">
                        "${nombre}"
                    </strong>
                </p>
                ${warnBox('Sus asignaciones en este espacio también serán eliminadas.')}
            `,
        }).then(r => { if (r.isConfirmed) document.getElementById(`removeMemberForm_${id}`).submit(); });
    });
});

// Asignar simulaciones como tareas desde tarjetas tipo Classroom.
const assignModal = document.getElementById('assignSimulationModal');
const assignClose = document.getElementById('assignModalClose');
const assignTitle = document.getElementById('assignModalTitle');
const assignTag = document.getElementById('assignModalTag');
const assignDescription = document.getElementById('assignModalDescription');
const assignSimulationId = document.getElementById('assignSimulationId');
const assignStudentsList = document.getElementById('assignStudentsList');
const assignTaskForm = document.getElementById('assignTaskForm');

function closeAssignModal() {
    if (!assignModal) return;
    assignModal.hidden = true;
    assignTaskForm?.reset();
    if (assignStudentsList) assignStudentsList.hidden = true;
}

document.querySelectorAll('.teacher-sim-card').forEach(card => {
    card.addEventListener('click', () => {
        if (!assignModal) return;
        if (assignSimulationId) assignSimulationId.value = card.dataset.simId || '';
        if (assignTitle) assignTitle.textContent = card.dataset.simName || 'Asignar simulacion';
        if (assignTag) assignTag.textContent = card.dataset.simTag || 'Simulacion';
        if (assignDescription) assignDescription.textContent = card.dataset.simDescription || 'Selecciona a quienes se les asignara esta tarea.';
        assignModal.hidden = false;
    });
});

document.querySelectorAll('input[name="modo_asignacion"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (assignStudentsList) assignStudentsList.hidden = radio.value !== 'seleccionados' || !radio.checked;
    });
});

assignClose?.addEventListener('click', closeAssignModal);
assignModal?.addEventListener('click', event => {
    if (event.target === assignModal) closeAssignModal();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAssignModal();
});

assignTaskForm?.addEventListener('submit', event => {
    const mode = assignTaskForm.querySelector('input[name="modo_asignacion"]:checked')?.value;
    const selected = assignTaskForm.querySelectorAll('input[name="estudiantes_asignar[]"]:checked');
    if (mode === 'seleccionados' && selected.length === 0) {
        event.preventDefault();
        assignStudentsList?.classList.add('shake');
        setTimeout(() => assignStudentsList?.classList.remove('shake'), 450);
    }
});
