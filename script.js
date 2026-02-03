document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Object for Projects
    const projectData = {
    'pawpedia': {
        title: "PawPedia Website",
        tech: ["HTML", "CSS", "JavaScript"],
        description: "PawPedia was created as a digital encyclopedia for pet enthusiasts. It helps users identify breeds and provides essential medical and dietary care information.",
        image: "Assets/pawpedia.jpg",
        screenshots: ["Assets/p1.jpg", "Assets/p2.jpg", "Assets/p3.jpg"],
        contributions: "I served as the Lead Frontend Developer, focusing on the UI design in Figma and implementing the responsive CSS architecture.",
        link: "https://github.com/Ishkihu/Pawpedia.git"
    },
    'cos-record': {
        title: "COS Student Record Program",
        tech: ["Java", "MySQL"],
        description: "A centralized system for the College of Science to manage student data, reducing manual paperwork and improving data retrieval speeds.",
        image: "Assets/cos-record.jpg",
        screenshots: ["Assets/c1.jpg", "Assets/c2.jpg"],
        contributions: "Collaborated with a backend teammate to design the database schema and built the Java Swing interface for the administrative dashboard.",
        link: "https://github.com/Kiel-Andrew/COS-Student-Record-Program.git"
    }
};

// Populate function (Call this inside your setupModal trigger)
function populateProjectDetail(projectId) {
    const data = projectData[projectId];
    
    document.getElementById('detail-title').innerText = data.title;
    document.getElementById('detail-desc').innerText = data.description;
    document.getElementById('detail-img').src = data.image;
    document.getElementById('detail-contributions').innerText = data.contributions;
    document.getElementById('detail-link').href = data.link;

    // Inset Tech Stack
    const techContainer = document.getElementById('detail-tech');
    techContainer.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');

    // Inset Gallery Screenshots
    const gallery = document.getElementById('detail-gallery');
    gallery.innerHTML = data.screenshots.map(src => `<img src="${src}" class="gallery-item">`).join('');
}

// Gallery Scroll Function
function moveGallery(direction) {
    const wrapper = document.getElementById('detail-gallery');
    const scrollAmount = 300; 
    wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

    // 2. Your Original setupModal Function
    const setupModal = (triggerSelector, modalId, isProject = false) => {
        const triggers = document.querySelectorAll(triggerSelector);
        const modal = document.getElementById(modalId);

        if (triggers.length > 0 && modal) {
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // If it's a project, populate the data first
                    if (isProject) {
                        const projectId = trigger.getAttribute('data-project');
                        const data = projectData[projectId];
                        
                        document.getElementById('detail-title').innerText = data.title;
                        document.getElementById('detail-desc').innerText = data.description;
                        document.getElementById('detail-img').src = data.image;
                        document.getElementById('detail-link').href = data.link;
                        
                        const techContainer = document.getElementById('detail-tech');
                        techContainer.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');
                    }

                    const scrollY = window.scrollY;
                    modal.showModal();
                    document.body.style.overflow = 'hidden';
                    window.scrollTo(0, scrollY);
                    
                    const closeBtn = modal.querySelector('button, .modal-close');
                    if (closeBtn) closeBtn.focus({ preventScroll: true });
                });
            });
        }
    };

    // 3. Initialize your existing modals
    setupModal('#experience .view-all', 'modal-experience');
    setupModal('#certifications .view-all', 'modal-certifications');
    setupModal('#tech-stack .view-all', 'modal-tech-stack');
    setupModal('#projects .view-all', 'modal-projects');

    // 4. Initialize the Project Detail Modals (The New Part)
    setupModal('.project-trigger', 'modal-project-detail', true);

    // 5. Your Backdrop/Close Button Logic (Keep your existing loop here)
    const modals = document.querySelectorAll('dialog');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
                document.body.style.overflow = '';
            }
        });

        const closeBtns = modal.querySelectorAll('.modal-close, [onclick*="close()"]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.style.overflow = '';
            });
        });

        modal.addEventListener('cancel', () => {
            document.body.style.overflow = '';
        });
    });
});