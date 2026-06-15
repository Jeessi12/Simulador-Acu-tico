/**
 * Admin Panel - Blue EcoSim
 * Funcionalidades: gráficos, cierre de alertas, efectos hover
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Panel cargado correctamente');

    // 1. Efecto hover en tarjetas de estadísticas
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // 2. Eliminar automáticamente las alertas después de 5 segundos
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        setTimeout(() => {
            alerts.forEach(alert => {
                alert.style.transition = 'opacity 0.5s ease';
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert.parentNode) alert.remove();
                }, 500);
            });
        }, 5000);
    }

    // 3. Añadir tooltips a los botones de acción (opcional)
    const btns = document.querySelectorAll('.btn-cambiar, .btn-eliminar, .btn-mini');
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // 4. Confirmación personalizada para acciones peligrosas (ya usan confirm nativo, pero se puede mejorar)
    const deleteForms = document.querySelectorAll('form[onsubmit*="confirm"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // La confirmación nativa ya está en el atributo onsubmit, no interferir
        });
    });

    // 5. Gráfico de usuarios (si existe el canvas)
    const userChartCanvas = document.getElementById('userChart');
    if (userChartCanvas && typeof Chart !== 'undefined') {
        // El gráfico ya se inicializa desde PHP, pero si quieres reiniciarlo o agregar interactividad
        // lo puedes hacer aquí. De momento lo dejamos como está.
    }

    // 6. Scroll suave para anclas internas (si las hubiera)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});