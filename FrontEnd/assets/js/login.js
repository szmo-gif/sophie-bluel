"use strict";

async function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      document.getElementById('errorMessage').textContent = result.message || 'Erreur de connexion';
    } else {
      localStorage.setItem('token', result.token);
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Erreur:', error);
    document.getElementById('errorMessage').textContent = 'Une erreur est survenue. Veuillez réessayer.';
  }
};

document.getElementById('loginForm').addEventListener('submit', login);
