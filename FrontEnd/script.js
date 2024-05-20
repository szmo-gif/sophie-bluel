// scripts/fetch.js

// Fonction pour récupérer les projets depuis le backend
async function fetchProjects() {
  try {
    const response = await fetch('http://localhost:5678/api/works'); // Assurez-vous que c'est l'URL correcte
    if (!response.ok) {
      throw new Error('Erreur réseau: ' + response.statusText);
    }
    const projects = await response.json();
    displayProjects(projects);
    setupFilters(projects); // Ajouter cette ligne pour configurer les filtres
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

// Fonction pour configurer les filtres
function setupFilters(projects) {
  const categories = new Set(projects.map(project => project.category.name)); // Accédez à la propriété name
  const filterContainer = document.getElementById('filter-container');
  filterContainer.innerHTML = ''; // Vider les filtres avant d'ajouter les nouveaux

  // Ajouter un bouton pour afficher tous les projets
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('filter-button', 'active'); // Ajouter une classe CSS et active par défaut
  allButton.addEventListener('click', () => {
    displayProjects(projects);
    setActiveButton(allButton);
  });
  filterContainer.appendChild(allButton);

  // Créer un bouton pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('filter-button'); // Ajouter une classe CSS
    button.addEventListener('click', () => filterProjects(category, projects));
    filterContainer.appendChild(button);
  });
}

// Fonction pour filtrer les projets
function filterProjects(category, projects) {
  const filteredProjects = projects.filter(project => project.category.name === category); // Accédez à la propriété name
  displayProjects(filteredProjects);
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(button => {
    if (button.textContent === category) {
      setActiveButton(button);
    }
  });
}

// Fonction pour définir le bouton actif
function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
}

// Appeler la fonction fetchProjects lorsque la page est chargée
document.addEventListener('DOMContentLoaded', fetchProjects);
