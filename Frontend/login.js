'use strict';

function displayUserInfo(userInfo) {
  document.getElementById('user-name').innerText = userInfo.name;
}

document.getElementById('login-button').addEventListener('click', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // getUserInfo(username); // Fetch user info after successful login
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
    window.location.href = 'map.html';
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}

document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('register-modal').classList.remove('hidden');
});

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
