'use strict';

function displayUserInfo(userInfo) {
  document.getElementById('user-name').innerText = userInfo.name;
}

document.getElementById('login-button').addEventListener('click', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Call login API

  getUserInfo(username); // Fetch user info after successful login
});

document
  .getElementById('register-button')
  .addEventListener('click', async e => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Call register API
  });

async function registerUser() {
  try {
    // event.preventDefault();
    const port = 3000;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('confirm-password').value;
    const warningDiv = document.getElementById('passwordWarning');

    if (password !== password2) {
      warningDiv.style.display = 'block';
    } else {
      warningDiv.style.display = 'none';
    }
    const user = {
      username,
      password,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    console.log(username);
    console.log(password);
    const response = await fetch(
      `http://localhost:${port}/api/auth/register`,
      options
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    // const userInfo = await response.json();
    // console.log(userInfo);

    // displayUserInfo(userInfo);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}

document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('register-modal').classList.remove('hidden');
});

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;

  constructor() {
    // Get user's position
    this._getPosition();

    // Attach event handlers
    document
      .querySelector('.form')
      .addEventListener('submit', this._newMarker.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    document.querySelector('.form').classList.remove('hidden');
    document.querySelector('.form__input--distance').focus();
  }

  _hideForm() {
    // Empty inputs
    document
      .querySelectorAll('.form__input')
      .forEach(input => (input.value = ''));

    document.querySelector('.form').style.display = 'none';
    document.querySelector('.form').classList.add('hidden');
    setTimeout(
      () => (document.querySelector('.form').style.display = 'grid'),
      1000
    );
  }

  _newMarker(e) {
    e.preventDefault();

    // Get data from form
    const { lat, lng } = this.#mapEvent.latlng;

    // Add new marker to the map
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent('New Marker')
      .openPopup();

    // Hide form + clear input fields
    this._hideForm();
  }
}

const app = new App();

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Perform login logic here, such as sending the username and password to the server
  // For this example, we'll assume login is always successful

  // If login is successful, redirect to map.html
  window.location.href = 'map.html';
}

function toggleForm(formType) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (formType === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  } else {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }
}

function register() {
  // Handle registration logic here
  alert('Registering...');
}

async function handleLogin(username) {
  try {
    // event.preventDefault();
    const port = 3000;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = {
      username,
      password,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    const response = await fetch(
      `http://localhost:${port}/api/auth/login`,
      options
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    // const userInfo = await response.json();
    // console.log(userInfo);

    // displayUserInfo(userInfo);

    // Store the user ID in local storage or session storage

    const data = await response.json();
    localStorage.setItem('userId', data.userId);
    console.log(`this is user_id ${data.userId}`);
    alert('Login successful');

    window.location.href = 'map.html';
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}
