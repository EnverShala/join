/*
** sidebar header implementation
*/

document.addEventListener('DOMContentLoaded', () => {
    const desktopModal = document.querySelector('#sub-menu-modal-desktop');
    const mobileModal = document.querySelector('#sub-menu-modal-mobile');
    const openModalButtons = document.querySelectorAll('.openModalHeader');

    if ((desktopModal || mobileModal) && openModalButtons.length > 0) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Überprüfen, welcher Header (Desktop oder Mobile) verwendet wird
                const modal = button.closest('.desktop-header') ? desktopModal : mobileModal;

                if (modal.open) {
                    modal.close(); // Wenn das Modal bereits geöffnet ist, schließe es
                } else {
                    modal.show(); // Wenn das Modal geschlossen ist, öffne es
                }
            });
        });

        // Modal schließen, wenn man außerhalb des Modals klickt
        [desktopModal, mobileModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        modal.close();
                    }
                });
            }
        });
    } else {
        console.error('Modal oder Open Buttons nicht im DOM gefunden.');
    }
});
