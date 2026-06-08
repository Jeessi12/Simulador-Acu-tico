/**
 * Admin Panel - Blue EcoSim
 * Funcionalidades adicionales
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Panel cargado correctamente');
    
    // Efecto hover en stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});