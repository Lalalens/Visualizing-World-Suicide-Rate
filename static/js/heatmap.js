let myMap = L.map("map", {
  center: [0, 0],
  zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/Water_Hydrant_WCORP_070_WA_GDA2020_Public.geojson";

let url = "http://127.0.0.1:5000/data";

d3.json(url).then(function(response) {
  console.log(response);

  features = response.features;
  let heatArray = [];

  // Extract the suicide rates for each country and store them in an array for further processing
  let suicideRates = features.map((feature) => feature.properties["suicide rate (per 100k)"]);

  // Sort the suicideRates array in ascending order
  let sortedSuicideRates = suicideRates.slice().sort((a, b) => a - b);

  // Get the top five and lowest five suicide rates
  let topFiveSuicideRates = sortedSuicideRates.slice(-5); // Last five elements (highest)
  let lowestFiveSuicideRates = sortedSuicideRates.slice(0, 5); // First five elements (lowest)

  // Loop through each feature to extract the coordinates and check if it belongs to the top or lowest five countries
  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    let suicideRate = features[i].properties["suicide rate (per 100k)"];

    // Set a default radius for the heatmap points
    let radius = 10;

 // Check if the suicide rate matches the top five or lowest five rates, and adjust the radius accordingly
 if (topFiveSuicideRates.includes(suicideRate)) {
  radius = 20; // Set a larger radius to highlight top countries
} else if (lowestFiveSuicideRates.includes(suicideRate)) {
  radius = 5; // Set a smaller radius to highlight lowest countries
}

if (location) {
  heatArray.push([location.coordinates[1], location.coordinates[0], radius]);
}
}

// Create a heatmap layer using the heatArray with customized radii and add it to the map
let heat = L.heatLayer(heatArray, {
radius: 10, // Default radius for other countries
}).addTo(myMap);
});