document.addEventListener('DOMContentLoaded', () => {
    const setupModal = (triggerSelector, modalId) => {
        const trigger = document.querySelector(triggerSelector);
        const modal = document.getElementById(modalId);

        if (trigger && modal) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Record current scroll position
                const scrollY = window.scrollY;
                
                modal.showModal();
                
                // LOCK SCROLL: Prevent background scrolling
                document.body.style.overflow = 'hidden';

                // Restore scroll if the browser tried to jump
                window.scrollTo(0, scrollY);
                
                const closeBtn = modal.querySelector('button, .modal-close');
                if (closeBtn) {
                    closeBtn.focus({ preventScroll: true });
                }
            });
        }
    };

    // Re-initialize modals
    setupModal('#experience .view-all', 'modal-experience');
    setupModal('#certifications .view-all', 'modal-certifications');
    setupModal('#tech-stack .view-all', 'modal-tech-stack');
    setupModal('#projects .view-all', 'modal-projects');

    const modals = document.querySelectorAll('dialog');
    modals.forEach(modal => {
        // UNLOCK SCROLL: When clicking the backdrop
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
                document.body.style.overflow = '';
            }
        });

        // UNLOCK SCROLL: When clicking any close button inside the modal
        const closeBtns = modal.querySelectorAll('.modal-close, [onclick*="close()"]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.style.overflow = '';
            });
        });

        // UNLOCK SCROLL: Handle the "Esc" key close event
        modal.addEventListener('cancel', () => {
            document.body.style.overflow = '';
        });
    });
});