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
var startPoint = document.getElementById('startingPoint');
var endPoint = document.getElementById('destination');
var time = document.getElementById('departureTime');
var seats = document.getElementById('availableSeats');
var amount = document.getElementById('payment');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    //get positon
    this._getPositionLive();

    this.#map = null; // Initialize the map variable

    searchForm.addEventListener('submit', e => {
      e.preventDefault(); // Prevent the form from submitting normally
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
      var timeValue = time.value;
      var seatsValue = seats.value;
      var amountValue = amount.value;

      this._renderRide(
        startPointValue,
        endPointValue,
        timeValue,
        seatsValue,
        amountValue
      );

      addRideForm.classList.add('hidden');

      const _getCord = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const lan = position.coords.latitude;
              const lon = position.coords.longitude;
              this._renderWorkoutMarker(lan, lon);
            },
            function () {
              alert('Could not get your position');
            }
          );
        }
      };

      _getCord();

      // Call the async function

      // const { latitude, longitude } = this._getPositionLive();
      // console.log(latitude, longitude);
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

  _getPositionLive() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        position => {
          const lan = position.coords.latitude;
          const lon = position.coords.longitude;
          // console.log(lan, lon); // For testing, you can see the coords in the cons
          this._loadMap(lan, lon);
          return lan, lon;
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

    // this.#workouts.forEach(work => {
    // this._renderWorkoutMarker(work);
    // });
  }

  _renderWorkoutMarker(lat, lon) {
    const positions = [lat, lon];
    const coords = L.marker(positions)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          // className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${'Hello World'}`)
      .openPopup();
  }

  _renderRide(
    startPointValue,
    endPointValue,
    timeValue,
    seatsValue,
    amountValue
  ) {
    let html = `
<li class="ride-info workout--running" data-id="1234567890">
  <div class="ride__main_info">
    <img src="images/laura-jones.jpg" class="user-profile-pic" />
    <h2 class="workout__title1">${startPointValue}</h2>
    <img src="images/road.svg" class="road-svg" />
    <h2 class="workout__title2">${endPointValue}</h2>
  </div>
  <div class="ride_details ride-2-info">
    <span class="workout__value">${timeValue}</span>
    <button class="phone-btn"><span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="call-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg></span></button>
  </div>
  <div class="ride_details">
    <span class="workout__value">${seatsValue}</span>
  </div>
  <div class="ride_details">
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
