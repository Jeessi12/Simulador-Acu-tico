document.addEventListener('DOMContentLoaded', function () {
    // ===== Botón "Seleccionar todos" =====
    const lista = document.getElementById('lista-estudiantes');
    if (!lista) return;

    const contenedor = lista.parentElement;
    const btnSeleccionar = document.createElement('button');
    btnSeleccionar.type = 'button';
    btnSeleccionar.textContent = '☑️ Seleccionar todos';
    btnSeleccionar.className = 'boton-seleccionar-todos';
    btnSeleccionar.style.cssText = 'margin-bottom: 8px; padding: 5px 12px; background: #e1f5fe; border: 1px solid #4fc3f7; border-radius: 8px; cursor: pointer; font-size: 0.85rem;';
    contenedor.insertBefore(btnSeleccionar, lista);

    let todosMarcados = false;
    btnSeleccionar.addEventListener('click', function () {
        const checks = lista.querySelectorAll('input[type="checkbox"]');
        todosMarcados = !todosMarcados;
        checks.forEach(ch => ch.checked = todosMarcados);
        btnSeleccionar.textContent = todosMarcados ? '✅ Desmarcar todos' : '☑️ Seleccionar todos';
    });

    // ===== Confirmación antes de asignar =====
    const form = document.getElementById('form-asignar');
    form.addEventListener('submit', function (e) {
        const seleccionados = form.querySelectorAll('input[name="estudiantes[]"]:checked');
        const simulacion = form.querySelector('#simulacion');

        if (seleccionados.length === 0) {
            e.preventDefault();
            alert('Selecciona al menos un estudiante.');
            return;
        }
        if (simulacion.value === '') {
            e.preventDefault();
            alert('Elige una simulación.');
            return;
        }
        if (!confirm(`¿Asignar esta simulación a ${seleccionados.length} estudiante(s)?`)) {
            e.preventDefault();
        }
    });
});