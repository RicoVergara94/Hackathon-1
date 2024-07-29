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
const myLocationIcon = document.querySelector('.my_location_btn');
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

    myLocationIcon.addEventListener('click', e => {
      e.preventDefault();
      this._getPositionLive();
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
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              this._renderWorkoutMarker(lat, lon, amountValue);
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
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // console.log(lan, lon); // For testing, you can see the coords in the cons
          this._loadMap(lat, lon);
          L.circleMarker([lat, lon], {
            color: '#339af0',
            fillColor: '#339af0',
            fillOpacity: 1,
            radius: 8, // Adjust the radius for the solid center
          }).addTo(this.#map);
          L.circle([lat, lon], {
            color: '#4dabf7',
            fillColor: '#4dabf7',
            fillOpacity: 0.5,
            radius: 400, // Adjust the radius for the larger circle
          }).addTo(this.#map);
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
          alert(`${cityName} is not a Area. Enter a Area Name`);
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

    // L.circle([lat, lon], {
    // color: '#4dabf7',
    // fillColor: '#339af0',
    // fillOpacity: 0.8,
    // radius: 100,
    // }).addTo(this.#map);

    // this.#workouts.forEach(work => {
    // this._renderWorkoutMarker(work);
    // });
  }

  _renderWorkoutMarker(lat, lon, price) {
    const positions = [lat, lon];
    const coords = L.marker(positions)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 50,
          minWidth: 10,
          autoClose: false,
          closeOnClick: false,
          // className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${`$${price}`}`)
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
    <button class="phone-btn"><span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="call-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg></span></button>
  </div>
  <div class="ride_details">
    <span class="workout__value"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="call-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg> ${seatsValue}</span>
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
