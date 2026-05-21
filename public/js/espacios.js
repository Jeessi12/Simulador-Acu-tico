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

    // ── SweetAlert eliminar espacio (lista) ─────────────────────────────────────
    document.querySelectorAll('.btn-delete-space').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            const { id, nombre } = btn.dataset;
            Swal.fire({
                title: '¿Eliminar espacio?',
                html: `<p style="font-size:1rem">Estás por eliminar <strong>"${nombre}"</strong></p>
                       <p style="color:#1a3f9a">⚠️ Se eliminarán también todas las asignaciones</p>`,
                icon: 'warning', iconColor: '#1a73e8', buttonsStyling: false, showCancelButton: true,
                confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
                customClass: { popup:'swal2-custom-popup', confirmButton:'swal2-custom-confirm',
                               cancelButton:'swal2-custom-cancel', title:'swal2-custom-title',
                               htmlContainer:'swal2-custom-html' }
            }).then(r => { if (r.isConfirmed) document.getElementById(`deleteForm_${id}`).submit(); });
        });
    });

    // ── SweetAlert eliminar espacio (detalle) ───────────────────────────────────
    const btnDetalle = document.getElementById('btnEliminarDetalle');
    if (btnDetalle) {
        btnDetalle.addEventListener('click', () => {
            const nombre = btnDetalle.dataset.nombre;
            Swal.fire({
                title: '¿Eliminar espacio?',
                html: `<p style="font-size:1rem">Estás por eliminar <strong>"${nombre}"</strong></p>
                       <p style="color:#1a3f9a">⚠️ Se eliminarán miembros y asignaciones</p>`,
                icon: 'warning', iconColor: '#006eff', buttonsStyling: false, showCancelButton: true,
                confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
                customClass: { popup:'swal2-custom-popup', confirmButton:'swal2-custom-confirm',
                               cancelButton:'swal2-custom-cancel', title:'swal2-custom-title',
                               htmlContainer:'swal2-custom-html' }
            }).then(r => { if (r.isConfirmed) document.getElementById('formEliminarDetalle').submit(); });
        });
    }

    // ── SweetAlert eliminar miembro ─────────────────────────────────────────────
    document.querySelectorAll('.btn-remove-member').forEach(btn => {
        btn.addEventListener('click', () => {
            const { id, nombre } = btn.dataset;
            Swal.fire({
                title: '¿Quitar miembro?',
                html: `<p style="font-size:1rem">Estás por quitar a <strong>"${nombre}"</strong> del espacio</p>
                       <p style="color:#1a3f9a">⚠️ También se eliminarán sus asignaciones en este espacio</p>`,
                icon: 'warning', iconColor: '#004eb4', buttonsStyling: false, showCancelButton: true,
                confirmButtonText: 'Sí, quitar', cancelButtonText: 'Cancelar',
                customClass: { popup:'swal2-custom-popup', confirmButton:'swal2-custom-confirm',
                               cancelButton:'swal2-custom-cancel', title:'swal2-custom-title',
                               htmlContainer:'swal2-custom-html' }
            }).then(r => { if (r.isConfirmed) document.getElementById(`removeMemberForm_${id}`).submit(); });
        });
    });