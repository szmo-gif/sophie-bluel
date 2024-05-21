const URL = 'http://localhost:5678/api/';
let projects = [];
let categories = [];

// Fonction pour récupérer les projets depuis le backend
/**
 * Fetches projects from the backend API and displays them on the frontend.
 *
 * @return {Promise<void>} - A promise that resolves when the projects are fetched and displayed.
 * @throws {Error} - If there is a network error while fetching the projects.
 */
async function fetchProjects() {
  try {
    const response = await fetch(URL + 'works');
    if (!response.ok) {
      throw new Error('Erreur réseau: ' + response.statusText);
    }
    projects = await response.json();

    displayProjects(projects);
    setupFilters(projects); // Ajouter cette ligne pour configurer les filtres
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// TODO : faire une fonction fetchCategories

function displayRender() {
  if (localStorage.getItem('token')) {
    displayAdmin();
  } else {
    setupFilters(projects /*mettre categories à la place*/);
  }
}

function displayAdmin() {
    // TODO : afficher la bar noire d'édition + le bouton modifier + changer login en  logout 
}

function logout () {
  localStorage.removeItem('token');
  displayRender();
}

// Fonction pour afficher les projets dans le DOM
/**
 * Displays projects in the project gallery.
 *
 * @param {Array} projects - An array of project objects.
 * @return {void} This function does not return anything.
 */
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
/**
 * Configures the filters based on the given projects.
 *
 * @param {Array} projects - An array of project objects.
 * @return {void} This function does not return anything.
 */
function setupFilters(projects) {
  const categories = new Set(projects.map(project => project.category.name)); // Accédez à la propriété name
  const filterContainer = document.getElementById('filter-container');
  filterContainer.innerHTML = ''; // Vider les filtres avant d'ajouter les nouveaux

  // Ajouter un bouton pour afficher tous les projets
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('filter-button', 'active');
  allButton.addEventListener('click', () => {
    displayProjects(projects);
    setActiveButton(allButton);
  });
  filterContainer.appendChild(allButton);

  // Créer un bouton pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('filter-button');
    button.addEventListener('click', () => filterProjects(category, projects));
    filterContainer.appendChild(button);
  });
}

// Fonction pour filtrer les projets
/**
 * Filters projects based on the given category and displays the filtered projects.
 *
 * @param {string} category - The category to filter the projects by.
 * @param {Array} projects - An array of project objects.
 * @return {void} This function does not return anything.
 */
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
/**
 * Sets the active button in a group of filter buttons.
 *
 * @param {HTMLElement} activeButton - The button to set as active.
 * @return {void} This function does not return a value.
 */
function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
}

// Appeler la fonction fetchProjects lorsque la page est chargée
document.addEventListener('DOMContentLoaded', fetchProjects);
