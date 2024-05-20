// scripts/script.js

// Fonction pour récupérer les projets depuis le backend
async function fetchProjects() {
  try {
    const response = await fetch('http://localhost:5678/api/works'); // Remplacez par l'URL de votre backend
    if (!response.ok) {
      throw new Error('Erreur réseau: ' + response.statusText);
    }
    const projects = await response.json();
    displayProjects(projects);
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// Fonction pour afficher les projets dans le DOM
function displayProjects(projects) {
  const projectGallery = document.getElementById('projects-gallery');
  projectGallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux projets

  projects.forEach(project => {
    const projectFigure = document.createElement('figure');
    const projectImage = document.createElement('img');
    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;

    const projectCaption = document.createElement('figcaption');
    projectCaption.textContent = project.title;

    projectFigure.appendChild(projectImage);
    projectFigure.appendChild(projectCaption);
    projectGallery.appendChild(projectFigure);
  });
}

// Appeler la fonction fetchProjects lorsque la page est chargée
document.addEventListener('DOMContentLoaded', fetchProjects);
