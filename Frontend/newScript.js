// Define the user credentials
const user = {
  username: 'John Doe',
  password: 'securepassword',
};

// Define the options for the fetch request
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(user), // Convert the user object to a JSON string
};

// Make the fetch request
fetch('http://localhost:3000/auth/login', options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    console.log('Response:', data); // Handle the response data
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
