document.addEventListener('DOMContentLoaded', () => {
    // Experience modal
    const viewAllExperience = document.querySelector('#experience .view-all');
    const modalExperience = document.getElementById('modal-experience');
    viewAllExperience.addEventListener('click', (e) => {
        e.preventDefault();
        modalExperience.showModal();
    });

    // Certifications modal
    const viewAllCertifications = document.querySelector('#certifications .view-all');
    const modalCertifications = document.getElementById('modal-certifications');
    viewAllCertifications.addEventListener('click', (e) => {
        e.preventDefault();
        modalCertifications.showModal();
    });

    // Tech Stack modal
    const viewAllTechStack = document.querySelector('#tech-stack .view-all');
    const modalTechStack = document.getElementById('modal-tech-stack');
    viewAllTechStack.addEventListener('click', (e) => {
        e.preventDefault();
        modalTechStack.showModal();
    });

    // Projects modal
    const viewAllProjects = document.querySelector('#projects .view-all');
    const modalProjects = document.getElementById('modal-projects');
    viewAllProjects.addEventListener('click', (e) => {
        e.preventDefault();
        modalProjects.showModal();
    });
});