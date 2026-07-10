document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión general
    const role = localStorage.getItem('juntos_user_role');
    const name = localStorage.getItem('juntos_user_name');
    const email = localStorage.getItem('juntos_user_email');

    // Si no hay sesión, redirigir al login
    if (!role || !name) {
        window.location.href = 'index.html';
        return;
    }

    // Check specific role to prevent access
    const pathname = window.location.pathname;
    if (pathname.includes('estudiante.html') && role !== 'estudiante') {
        window.location.href = 'index.html';
        return;
    } else if (pathname.includes('docente.html') && role !== 'docente') {
        window.location.href = 'index.html';
        return;
    }

    // Configurar header
    const headerUserName = document.getElementById('header-user-name');
    const headerUserRole = document.getElementById('header-user-role');

    if (headerUserName) headerUserName.textContent = name;
    if (headerUserRole) headerUserRole.textContent = role;

    // Lógica de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Lógica de navegación en el menú lateral
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const mainTitle = document.getElementById('main-title');
    const mainDesc = document.getElementById('main-desc');
    const mainContentArea = document.getElementById('main-content-area');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover 'active' de todos
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar 'active' al clickeado
            this.classList.add('active');

            const sectionName = this.textContent.trim();
            const target = this.dataset.target;

            // Integración con demo adaptativa
            if ((window.renderTeacherSection && window.renderTeacherSection(target, sectionName, mainContentArea, mainTitle, mainDesc)) || (window.renderDemoSection && window.renderDemoSection(target, sectionName, mainContentArea, mainTitle, mainDesc))) {
                return; // Demo handled rendering
            }

            // Fallback for placeholder view
            if (mainTitle) mainTitle.textContent = sectionName;
            if (mainDesc) mainDesc.textContent = `Estás en la sección: ${sectionName}`;

            if (mainContentArea) {
                mainContentArea.innerHTML = `
                    <div class="placeholder-view">
                        <h2>${sectionName}</h2>
                        <p>Esta sección está en desarrollo para la demo.</p>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 20px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                `;
            }
        });
    });

    // Automatically trigger section on load
    if (window.renderDemoSection || window.renderTeacherSection) {
        const activeItem = Array.from(menuItems).find(i => i.classList.contains('active'));
        const inicioItem = Array.from(menuItems).find(i => i.dataset.target === 'inicio');
        const dashboardItem = Array.from(menuItems).find(i => i.dataset.target === 'dashboard');

        const defaultItem = activeItem || inicioItem || dashboardItem || menuItems[0];

        if (defaultItem) {
            defaultItem.click();
        }
    }
});
