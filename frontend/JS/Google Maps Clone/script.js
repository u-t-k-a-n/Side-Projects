mapboxgl.accessToken = 'pk.eyJ1IjoidXRrYW4iLCJhIjoiY2w1MTBmOHVpMDExMzNkbWFqanowOGJoayJ9.BlzmCc34ePTjo1u5npJZuw';

navigator.geolocation.getCurrentPosition(successLocation,errorLocation,{enableHighAccuracy:true});

function successLocation(position){
    console.log(position);
    setupMap([position.coords.longitude,position.coords.latitude]);
}

function errorLocation(){
    setupMap([-0.120850,51.507351]);
}

function setupMap(center){
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 15
    });
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });
    map.addControl(directions, 'top-left');
}

