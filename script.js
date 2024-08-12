let map;
let locationProvider;

/* Filter that returns between 1 and 50 vehicles.
If more than 50, paging will kick in, and it will be harder to spot duplicated requests */

// Our example
const vehicleFilter = 'attributes.driver_environment = "PRODUCTION" AND attributes.driver_city = "LDN" AND (attributes.driver_id = "4575" OR attributes.driver_id = "5876" OR attributes.driver_id = "2475" OR attributes.driver_id = "3067" OR attributes.driver_id = "5856" OR attributes.driver_id = "3026" OR attributes.driver_id = "5732" OR attributes.driver_id = "5795" OR attributes.driver_id = "1165" OR attributes.driver_id = "5246" OR attributes.driver_id = "5903" OR attributes.driver_id = "5673" OR attributes.driver_id = "5770" OR attributes.driver_id = "463" OR attributes.driver_id = "4504" OR attributes.driver_id = "4476" OR attributes.driver_id = "5700" OR attributes.driver_id = "5428" OR attributes.driver_id = "4600" OR attributes.driver_id = "5797" OR attributes.driver_id = "3874" OR attributes.driver_id = "5308" OR attributes.driver_id = "3471" OR attributes.driver_id = "3914" OR attributes.driver_id = "3948" OR attributes.driver_id = "2682" OR attributes.driver_id = "598" OR attributes.driver_id = "5381" OR attributes.driver_id = "4531" OR attributes.driver_id = "5930" OR attributes.driver_id = "5414" OR attributes.driver_id = "5683" OR attributes.driver_id = "5486")';

// const vehicleFilter = '';

async function authTokenFetcher() {
  return {
    /* Provide your auth token */
    token: config.authToken,
    expiresInSeconds: 3600,
  }
}

async function initMap() {
  await google.maps.importLibrary("journeySharing");

  locationProvider = new google.maps.journeySharing.FleetEngineDeliveryFleetLocationProvider({
    projectId: config.projectId,
    authTokenFetcher,
    locationRestriction: null,
    deliveryVehicleFilter: null,
    pollingIntervalMillis: 10000,
  });

  locationProvider.addListener('update',(response)=>{
    console.log(new Date().toISOString(), response.deliveryVehicles.length);
  });
  
  map = new google.maps.journeySharing.JourneySharingMapView({
    element: document.getElementById('map'), 
    locationProviders: [locationProvider],
    mapOptions: {
      zoom: 12,
      center: {lat: 51.5074, lng: -0.1278},
    }
  });

  locationProvider.deliveryVehicleFilter = vehicleFilter;
  locationProvider.locationRestriction = google.maps.LatLngBounds.MAX_BOUNDS;
}

document.querySelector('#triggerSequence').addEventListener('click', ()=>{
  locationProvider.deliveryVehicleFilter = null;
  locationProvider.locationRestriction = null;
  
  locationProvider.deliveryVehicleFilter = vehicleFilter;
  locationProvider.locationRestriction = google.maps.LatLngBounds.MAX_BOUNDS;
});

initMap();
