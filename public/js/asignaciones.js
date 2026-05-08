
document.addEventListener('DOMContentLoaded', function() {

    const simulacionBtns = document.querySelectorAll('.btn-simular');
    const verTodoBtn = document.getElementById('verTodoBtn');
    const tareaCheckboxes = document.querySelectorAll('.tarea-checkbox input');
    const tareaAcciones = document.querySelectorAll('.tarea-accion');

    function showModal(title, message, type = 'info') {
       
        const existingModal = document.getElementById('customModal');
        if (existingModal) existingModal.remove();
        
        let icon = '';
        let iconColor = '';
        switch(type) {
            case 'success':
                icon = 'fas fa-check-circle';
                iconColor = '#2ecc71';
                break;
            case 'error':
                icon = 'fas fa-exclamation-circle';
                iconColor = '#e74c3c';
                break;
            default:
                icon = 'fas fa-info-circle';
                iconColor = '#1e6f9f';
        }
        
        const modalHTML = `
            <div id="customModal" class="custom-modal-overlay">
                <div class="custom-modal-container">
                    <button class="custom-modal-close" id="closeCustomModal"><i class="fas fa-times"></i></button>
                    <div class="custom-modal-icon" style="color: ${iconColor}">
                        <i class="${icon}"></i>
                    </div>
                    <h3 class="custom-modal-title">${title}</h3>
                    <p class="custom-modal-message">${message}</p>
                    <button class="custom-modal-btn" id="confirmCustomModal">Aceptar</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        
        if (!document.querySelector('#customModalStyles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'customModalStyles';
            modalStyles.textContent = `
                .custom-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; animation: modalFadeIn 0.3s ease;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(8px); }
                }
                .custom-modal-container {
                    background: white; border-radius: 28px; max-width: 400px;
                    width: 90%; padding: 30px; text-align: center;
                    animation: modalSlideUp 0.3s ease;
                    position: relative;
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-modal-close {
                    position: absolute; top: 15px; right: 15px;
                    background: rgba(0,0,0,0.1); border: none;
                    width: 30px; height: 30px; border-radius: 50%;
                    cursor: pointer; font-size: 0.9rem;
                }
                .custom-modal-icon { font-size: 3rem; margin-bottom: 15px; }
                .custom-modal-title { font-size: 1.5rem; color: #0a2b4e; margin-bottom: 10px; }
                .custom-modal-message { color: #4a627a; margin-bottom: 25px; line-height: 1.5; }
                .custom-modal-btn {
                    background: #1e6f9f; color: white; border: none;
                    padding: 10px 30px; border-radius: 40px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s ease;
                }
                .custom-modal-btn:hover { background: #0a4b70; transform: scale(1.02); }
            `;
            document.head.appendChild(modalStyles);
        }
        
        const modal = document.getElementById('customModal');
        const closeBtn = document.getElementById('closeCustomModal');
        const confirmBtn = document.getElementById('confirmCustomModal');
        
        function closeModal() {
            modal.style.animation = 'modalFadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
        
        closeBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', function() {
            const detail = { title, message, type };
            const evt = new CustomEvent('modalConfirm', { detail });
            document.dispatchEvent(evt);
            closeModal();
        });
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    

    simulacionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const simulacionNombre = this.dataset.simulacionNombre;
            const simulacionId = this.dataset.simulacionId;
            // Al confirmar el modal se redirige a la página de simulador con el id correspondiente
            const onConfirmSim = function() {
                window.location.href = `simulador.php?id=${encodeURIComponent(simulacionId)}`;
            };
            document.addEventListener('modalConfirm', onConfirmSim, { once: true });
            showModal('Iniciar Simulación', `¿Deseas comenzar la simulación de "${simulacionNombre}"?`, 'info');

        
        });
    });
    
  
    
   
    if (verTodoBtn) {
        verTodoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('Todas las tareas', 'Aquí se mostrarán todas tus simulaciones asignadas, incluyendo las completadas y en progreso.', 'info');
        });
    }
    
   
    

    tareaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const tareaItem = this.closest('.tarea-item');
            const tareaNombre = tareaItem.querySelector('.tarea-nombre').textContent;
            if (this.checked) {
                showModal('¡Felicidades!', `Has completado la simulación "${tareaNombre}". Sigue así.`, 'success');
            }
        });
    });
    
    tareaAcciones.forEach(btn => {
        btn.addEventListener('click', function() {
            const tareaItem = this.closest('.tarea-item');
            const tareaNombre = tareaItem.querySelector('.tarea-nombre').textContent;
            const simulacionId = this.dataset.simulacionId;
            const onConfirmTarea = function() {
                window.location.href = `simulador.php?id=${encodeURIComponent(simulacionId)}`;
            };
            document.addEventListener('modalConfirm', onConfirmTarea, { once: true });
            showModal('Continuar simulación', `Redirigiendo a la simulación de "${tareaNombre}"...`, 'info');
            
        });
    });
    
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
  
    // Bubble animation moved to ../JS/burbujas.js — duplicate implementation removed.
});