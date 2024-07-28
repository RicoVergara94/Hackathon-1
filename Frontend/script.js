'use strict';

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const rides = document.querySelector('.rides');
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const rideButton = document.querySelector('.add-ride-btn');
const addRideForm = document.getElementById('add-ride-form');
const returnButton = document.querySelector('.form-return-btn');
const submitRideButton = document.querySelector('.add-form-btn');
var startPoint = document.getElementById('startPoint');
var endPoint = document.getElementById('endPoint');
var miles = document.getElementById('miles');
var seats = document.getElementById('seats');
var amount = document.getElementById('amount');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    //get positon
    this._getPosition();
    this.#map = null; // Initialize the map variable

    searchForm.addEventListener('submit', e => {
      // e.preventDefault(); // Prevent the form from submitting normally
      const query = searchBar.value; // Get the value from the search bar
      console.log('Search query:', query);
      this._geocodeCity(query); // Arrow function preserves the context of `this`
    });

    rideButton.addEventListener('click', e => {
      e.preventDefault();
      console.log('button clicked');
      addRideForm.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });

    returnButton.addEventListener('click', e => {
      e.preventDefault();

      addRideForm.classList.add('hidden');
    });

    submitRideButton.addEventListener('click', e => {
      e.preventDefault();
      var startPointValue = startPoint.value;
      var endPointValue = endPoint.value;
      var milesValue = miles.value;
      var seatsValue = seats.value;
      var amountValue = amount.value;

      this._renderRide(
        startPointValue,
        endPointValue,
        milesValue,
        seatsValue,
        amountValue
      );

      addRideForm.classList.add('hidden');
    });

    // Get data from local storage
    this._getLocalStorage();
  }

  _getPosition() {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the form from submitting normally

      const query = searchBar.value; // Get the value from the search bar

      // Example: Log the query to the console
      console.log('Search query:', query);
      this._geocodeCity(query);
    });
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        position => {
          const lan = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log(lan, lon); // For testing, you can see the coords in the console
          this._loadMap(lan, lon);
        },
        function () {
          alert('Could not get your position');
        }
      );
  }

  _geocodeCity(cityName) {
    fetch(
      `https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`
    )
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          this._loadMap(lat, lon);
        } else {
          console.error('City not found');
        }
      })
      .catch(error => console.error('Error:', error));
  }

  // _handleCoordinates(lat, lon) {
  // Handle the coordinates here, for example, updating the map
  // console.log('Latitude:', lat);
  // console.log('Longitude:', lon);
  // }

  _loadMap(lat, lon) {
    const coords = [lat, lon];

    if (this.#map) {
      this.#map.setView(coords, 13);
    } else {
      // Initialize the map if it doesn't exist
      this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    }
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _renderWorkoutMarker(lat, lon) {
    const coords = L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderRide(
    startPointValue,
    endPointValue,
    milesValue,
    seatsValue,
    amountValue
  ) {
    let html = `
  <li class="workout workout--running" data-id="1234567890">
    <div class="main">
      <img src="images/laura-jones.jpg" class="user-profile-pic" />
      <h2 class="workout__title1">${startPointValue}</h2>
      <h2 class="workout__title1">${endPointValue}</h2>
    </div>
    <div class="workout__details">
      <span class="workout__value">${milesValue}</span>
      <span class="workout__unit">Miles</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">&</span>
      <span class="workout__value">${seatsValue}</span>
      <span class="workout__unit">seats</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">60</span>
      <span class="workout__unit">mph</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">$</span>
      <span class="workout__value">${amountValue}</span>
    </div>
  </li>
`;
    rides.insertAdjacentHTML('afterbegin', html);
  }

  _moveToPopup(e) {
    // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:
    if (!this.#map) return;

    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
}

const app = new App();
