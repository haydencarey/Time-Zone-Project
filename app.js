let locations = [];

window.addEventListener('load', function() {
    fetch("location.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            locations = data;
            //console.log(data.new_york.latitude)
            //console.log(data.new_york.longitude)

            // get reference to location dropdown
            let locationDropdown = document.getElementById("location-dropdown")
            let option = document.createElement('option');

            option.text = 'Choose location';
            locationDropdown.add(option);
            // Adding new options (locations) to select
            locations.forEach(function(location) {
                console.log(location);


                let option = document.createElement('option');
                option.text = location.name;
                option.id = location.id;
                option.value = location.id;
                locationDropdown.add(option);
            });

        });
})

// only change when an element's value is changed by the user (when the user picks from the dropdown)
document.getElementById("location-dropdown").addEventListener('change', function() {

    console.log(this.value);

    // get select location from json / array

    const found = locations.find(city => city.id === this.value)
    console.log(found)


    // populate input with selected object

    document.getElementById("input-lat").value = found.latitude;
    document.getElementById("input-long").value = found.longitude;

});

let inputTextLat;
let inputTextLong;
let hour;

document.getElementById("location-button").addEventListener('click', function() {

    inputTextLat = document.getElementById("input-lat").value
    inputTextLong = document.getElementById("input-long").value
    console.log(inputTextLat)
    console.log(inputTextLong)

    let API_url = `https://api.timezonedb.com/v2.1/get-time-zone?key=1ZDW2CLEKDWR&format=json&by=position&lat=${inputTextLat}&lng=${inputTextLong}`;

    // work process
    // choose city
    // whatever city name is selected, access JSON by calling back a function
    //store latitude and longitude in inputText, somewhere where my api link can use it
    // call the fetch API_url

    fetch(API_url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            hour = parseInt(data.formatted.slice(11, 13))
            timeZones = data;
            console.log(hour)
            let locationTime = document.getElementById('location-time');
            let locationCity = document.getElementById('location-city');
            let locationZone = document.getElementById('location-zone');
            locationTime.innerHTML = "Time:" + " " + timeZones.formatted;
            locationCity.innerHTML = "Where:" + " " + timeZones.zoneName;
            locationZone.innerHTML = "Time Zone:" + " " + timeZones.abbreviation;
            let awakeAsleep = document.getElementById('awakeAsleep');
            if (hour >= 8 && hour <= 17) {
                awakeAsleep.innerHTML = 'Awake and During Work Hours!'
            } else if (hour > 17 && hour < 23) {
                awakeAsleep.innerHTML = 'Awake, But Outside of Work Hours!'
            } else {
                awakeAsleep.innerHTML = 'Asleep!'
            }
            if (timeZones.status == "FAILED") {
                awakeAsleep.innerHTML = 'Location Not Found'
            }
        })

})

// p5 code!!
let timeZones;
let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
const options = {
    lat: 0,
    lng: 0,
    zoom: 1.4,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}
let dt;
let c1, c2;


function setup() {
    c1 = color(43, 47, 119);
    c2 = color(255, 201, 34);


    canvas = createCanvas(640, 640);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)

    console.log(location.id)
        // Only redraw the point when the map changes and not every frame.
    myMap.onChange(draw)
}

function draw() {

    if (hour >= 8 && hour <= 17) {
        fill(255, 201, 34)
    } else if (hour > 17 && hour < 23) {
        fill(189, 17, 89)
    } else {
        fill(43, 47, 119)
    }

    //console.log(hour)

    clear();
    // Every Frame, get the canvas position 
    // for the latitude and longitude of Nigeria
    // ellipse(mouseX, mouseY, 50, 50)

    if (timeZones) {
        // console.log("ready")
        // console.log(inputTextLat)
        // console.log(inputTextLong)
        // ellipse(11.396396, 5.076543, 20, 20)

        const world = myMap.latLngToPixel(inputTextLat, inputTextLong);
        // Using location position to draw an ellipse
        ellipse(world.x, world.y, 10, 10);


    } else {
        //   console.log("not ready yet")
    }

    if (mouseIsPressed) {
        if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
            // Store the current latitude and longitude of the mouse position
            const position = myMap.pixelToLatLng(mouseX, mouseY);

            console.log(position);
            console.log(mouseX, mouseY);

            // set value of textboxes
            document.getElementById("input-lat").value = position.lat;
            document.getElementById("input-long").value = position.lng;
        }
    }
    if (timeZones) {

        let dateValue = new Date(timeZones.formatted);
        let hour = dateValue.getHours();

        let hourX = map(hour, 0, 23, 0, 640);

        console.log('hour', hour);
        // rect(0, 0, width, 30)
        ellipse(hourX, 20, 30, 30)
            // setGradient(0, 0, windowWidth, 55, c1, c2, "X");
    }

}

// Next iteration of the project. To be continued.
// function setGradient(x, y, w, h, c1, c2, axis) {
//     // noFill();
//     if (axis == "Y") { // Top to bottom gradient
//         for (let i = y; i <= y + h; i++) {
//             var inter = map(i, y, y + h, 0, 1);
//             var c = lerpColor(c1, c2, inter);
//             stroke(c);
//             line(x, i, x + w, i);
//         }
//     } else if (axis == "X") { // Left to right gradient
//         for (let j = x; j <= x + w; j++) {
//             var inter2 = map(j, x, x + w, 0, 1);
//             var d = lerpColor(c1, c2, inter2);
//             stroke(d);
//             line(j, y, j, y + h);
//         }
//     }
// }