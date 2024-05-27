const URL = 'http://localhost:5678/api/';
let projects = [];
let categories = [];

// Fonction pour récupérer les projets depuis le backend
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
async function fetchCategories() {
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
function populateCategorySelect() {
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
function displayRender() {
  if (localStorage.getItem('token')) {
    displayAdmin();
  } else {
    setupFilters(categories);
  }
}

// Fonction pour afficher l'interface administrateur
function displayAdmin() {
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
function logout(event) {
  event.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'index.html'; // Rediriger vers la page d'accueil en mode visiteur
}

// Fonction pour rediriger vers la page de connexion
function redirectToLogin(event) {
  window.location.href = 'login.html';
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

// Fonction pour afficher les projets dans le modal
function displayProjectsInModal() {
  const modalGallery = document.querySelector('.modal-gallery');
  modalGallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux projets

  projects.forEach(project => {
    const projectFigure = document.createElement('figure');
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

// Fonction pour ouvrir le modal de gestion des projets
function openProjectModal(event) {
  event.preventDefault();
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    displayProjectsInModal();
    projectModal.style.display = 'block';
  }
}

// Fonction pour fermer le modal de gestion des projets
function closeProjectModal(event) {
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    projectModal.style.display = 'none';
  }
}

// Fonction pour ouvrir le modal d'ajout de photo
function openAddPhotoModal() {
  const addPhotoModal = document.getElementById('add-photo-modal');
  const projectModal = document.getElementById('project-modal');
  if (addPhotoModal) {
    projectModal.style.display = 'none'; // Fermer le modal de gestion des projets
    addPhotoModal.style.display = 'block'; // Ouvrir le modal d'ajout de photo
  }
}

// Fonction pour fermer le modal d'ajout de photo
function closeAddPhotoModal() {
  const addPhotoModal = document.getElementById('add-photo-modal');
  const projectModal = document.getElementById('project-modal');
  if (addPhotoModal) {
    addPhotoModal.style.display = 'none'; // Fermer le modal d'ajout de photo
    projectModal.style.display = 'block'; // Réouvrir le modal de gestion des projets
  }
}

// Fonction pour ajouter un projet
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
