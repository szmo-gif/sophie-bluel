const URL = 'http://localhost:5678/api/';
let projects = [];
let categories = [];

// Fonction pour récupérer les projets depuis le backend
/**
 * Fetches projects from the backend API and displays them on the page.
 * If the user is in visitor mode, it also sets up filters for the projects.
 *
 * @return {Promise<void>} A promise that resolves when the projects are fetched and displayed.
 * @throws {Error} If there is a network error while fetching the projects.
 */
async function fetchProjects() {
  try {
    const response = await fetch(URL + 'works');
    if (!response.ok) {
      throw new Error('Erreur réseau: ' + response.statusText);
    }
    projects = await response.json();
    displayProjects(projects);
    if (!localStorage.getItem('token')) {
      setupFilters(projects); // Configurer les filtres seulement en mode visiteur
    }
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// Fonction pour récupérer les catégories depuis le backend
/**
 * Fetches categories from the backend API and populates the category select element.
 *
 * @return {Promise<void>} A promise that resolves when the categories are fetched and the select element is populated.
 * @throws {Error} If there is a network error while fetching the categories.
 */
async function fetchCategories(){
  try {
    const response = await fetch(URL + 'categories');
    if (!response.ok) {
      throw new Error('Erreur réseau: ' + response.statusText);
    }
    categories = await response.json();
    populateCategorySelect();
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// Fonction pour peupler le sélecteur de catégories
/**
 * Populates the category select element with options based on the categories array.
 *
 * @return {void} This function does not return a value.
 */
const populateCategorySelect = () =>{
  const categorySelect = document.getElementById('photo-category');
  categorySelect.innerHTML = ''; // Vider le sélecteur avant d'ajouter les nouvelles catégories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Fonction pour vérifier l'état de connexion et afficher l'interface appropriée
const displayRender =() =>{
  if (localStorage.getItem('token')) {
    displayAdmin();
  } else {
    setupFilters(categories);
  }
}

// Fonction pour afficher l'interface administrateur
/**
 * Displays the admin interface by showing the black edit bar, changing the login button to logout,
 * displaying the edit button, displaying the projects, and hiding the filter container.
 *
 * @return {void} This function does not return anything.
 */
const displayAdmin = () =>{
  // Afficher la barre noire d'édition
  const adminBar = document.getElementById('admin-bar');
  if (adminBar) {
    adminBar.style.display = 'flex';
  }

  // Changer le bouton login en logout
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.textContent = 'logout';
    loginButton.removeEventListener('click', redirectToLogin);
    loginButton.addEventListener('click', logout);
    loginButton.href = '#';
  }

  // Afficher le bouton "modifier"
  const editButton = document.getElementById('edit-button');
  if (editButton) {
    editButton.style.display = 'inline';
    editButton.addEventListener('click', openProjectModal);
  }

  displayProjects(projects);

  // Masquer le conteneur des filtres
  const filterContainer = document.getElementById('filter-container');
  if (filterContainer) {
    filterContainer.style.display = 'none';
  }
}

// Fonction pour gérer la déconnexion
/**
 * Logs out the user by removing the token from local storage and redirecting to the home page in visitor mode.
 *
 * @param {Event} event - The event object triggered by the logout button click.
 * @return {void} This function does not return anything.
 */
const logout = (event) => {
  event.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'index.html'; // Rediriger vers la page d'accueil en mode visiteur
}

// Fonction pour rediriger vers la page de connexion
/**
 * Redirects the user to the login page.
 *
 * @param {Event} event - The event object triggered by the user action.
 * @return {void} This function does not return anything.
 */
const redirectToLogin = () => {
  window.location.href = 'login.html';
}

// Fonction pour afficher les projets dans le DOM
/**
 * Displays the given projects in the project gallery.
 *
 * @param {Array} projects - An array of project objects.
 * @return {void} This function does not return anything.
 */
const displayProjects = (projects) => {
  const projectGallery = document.getElementById('projects-gallery');
  projectGallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux projets

  projects.forEach(project => {
    const projectFigure = document.createElement('li', 'figure');
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

// Fonction pour afficher les projets dans le modal
/**
 * Displays the projects in the modal gallery.
 *
 * @return {void} This function does not return anything.
 */
const displayProjectsInModal = () => {
  const modalGallery = document.querySelector('.modal-gallery');
  modalGallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux projets

  projects.forEach(project => {
    const projectFigure = document.createElement('li', 'figure');
    const projectImage = document.createElement('img');
    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');
    deleteIcon.addEventListener('click', () => deleteProject(project.id));

    projectFigure.appendChild(projectImage);
    projectFigure.appendChild(deleteIcon);
    modalGallery.appendChild(projectFigure);
  });
}

// Fonction pour configurer les filtres
/**
 * Sets up filters for projects based on their categories.
 *
 * @param {Array} projects - An array of project objects.
 * @return {void} This function does not return anything.
 */
const setupFilters = (projects) => {
  const categories = new Set(projects.map(project => project.category.name)); // Accédez à la propriété name
  const filterContainer = document.getElementById('filter-container');
  filterContainer.innerHTML = ''; // Vider les filtres avant d'ajouter les nouveaux

  // Ajouter un bouton pour afficher tous les projets
  const allButton = document.createElement('li', 'button');
  allButton.textContent = 'Tous';
  allButton.classList.add('filter-button', 'active');
  allButton.addEventListener('click', () => {
    displayProjects(projects);
    setActiveButton(allButton);
  });
  filterContainer.appendChild(allButton);

  // Créer un bouton pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement('li', 'button');
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
const filterProjects = (category, projects) => {
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
 * Sets the active button among a group of filter buttons.
 *
 * @param {HTMLElement} activeButton - The button to be set as active.
 * @return {void} This function does not return anything.
 */
const setActiveButton = (activeButton) => {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
}

// Fonction pour ouvrir le modal de gestion des projets
/**
 * Opens the project modal and displays the projects in it.
 *
 * @param {Event} event - The event object triggered by the button click.
 * @return {void} This function does not return anything.
 */
const openProjectModal = (event) => {
  event.preventDefault();
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    displayProjectsInModal();
    projectModal.style.display = 'block';
  }
}

// Fonction pour fermer le modal de gestion des projets
/**
 * Closes the project modal by setting its display style to 'none'.
 *
 * @param {Event} event - The event object triggered by the closing action.
 * @return {void} This function does not return anything.
 */
const closeProjectModal = () => {
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    projectModal.style.display = 'none';
  }
}

// Fonction pour ouvrir le modal d'ajout de photo
/**
 * Opens the add photo modal by hiding the project modal and displaying the add photo modal.
 *
 * @return {void} This function does not return anything.
 */
const openAddPhotoModal =() => {
  const addPhotoModal = document.getElementById('add-photo-modal');
  const projectModal = document.getElementById('project-modal');
  if (addPhotoModal) {
    projectModal.style.display = 'none'; // Fermer le modal de gestion des projets
    addPhotoModal.style.display = 'block'; // Ouvrir le modal d'ajout de photo
  }
}

// Fonction pour fermer le modal d'ajout de photo
/**
 * Closes the add photo modal by hiding the modal and displaying the project modal.
 *
 * @return {void} This function does not return anything.
 */
const closeAddPhotoModal = () => {
  const addPhotoModal = document.getElementById('add-photo-modal');
  const projectModal = document.getElementById('project-modal');
  if (addPhotoModal) {
    addPhotoModal.style.display = 'none'; // Fermer le modal d'ajout de photo
    projectModal.style.display = 'block'; // Réouvrir le modal de gestion des projets
  }
}

// Fonction pour ajouter un projet
/**
 * Asynchronously adds a new project to the server using the provided form data.
 *
 * @param {Event} event - The event object triggered by the form submission.
 * @return {Promise<void>} A Promise that resolves when the project is successfully added,
 * or rejects with an error if there was a problem with the fetch request.
 */
async function addProject(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newProject = {
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    category: {
      id: formData.get('category')
    }
  };
  try {
    const response = await fetch(URL + 'works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error('Erreur spécifiée: ' + response.statusText);
    }
    const project = await response.json();
    projects.push(project);
    displayProjects(projects);
    closeAddPhotoModal();
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// Fonction pour supprimer un projet
/**
 * Asynchronously deletes a project from the server.
 *
 * @param {string} projectId - The ID of the project to be deleted.
 * @return {Promise<void>} A Promise that resolves when the project is successfully deleted,
 * or rejects with an error if there was a problem with the fetch request.
 */
async function deleteProject(projectId) {
  try {
    const response = await fetch(`${URL}works/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Erreur spécifiée: ' + response.statusText);
    }
    // Supprimer le projet du tableau de projets
    projects = projects.filter(project => project.id !== projectId);
    // Mettre à jour l'affichage des projets
    displayProjects(projects);
    displayProjectsInModal();
  } catch (error) {
    console.error('Il y a eu un problème avec votre requête fetch: ', error);
  }
}

// Ajouter les écouteurs d'événements
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProjects();
  await fetchCategories();
  displayRender();

  // Écouteurs pour les boutons du modal d'ajout de photo
  const openAddPhotoModalButton = document.getElementById('open-add-photo-modal');
  const closeAddPhotoModalButton = document.querySelector('#add-photo-modal .close-button');
  
  openAddPhotoModalButton.addEventListener('click', openAddPhotoModal);
  closeAddPhotoModalButton.addEventListener('click', closeAddPhotoModal);

  window.addEventListener('click', (event) => {
    const addPhotoModal = document.getElementById('add-photo-modal');
    if (event.target === addPhotoModal) {
      closeAddPhotoModal();
    }
  });

  // Écouteur pour le formulaire d'ajout de photo
  const addPhotoForm = document.getElementById('add-photo-form');
  addPhotoForm.addEventListener('submit', addProject);
});

// Ajouter un écouteur d'événement pour fermer le modal principal lorsque l'utilisateur clique sur la croix
document.querySelector('#project-modal .close-button').addEventListener('click', closeProjectModal);

// Ajouter un écouteur d'événement pour fermer le modal principal lorsque l'utilisateur clique en dehors du contenu du modal
window.addEventListener('click', (event) => {
  const projectModal = document.getElementById('project-modal');
  if (event.target === projectModal) {
    projectModal.style.display = 'none';
  }
});
