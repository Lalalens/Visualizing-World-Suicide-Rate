let baseURL = "/data";

d3.json(baseURL).then(function(data) {
  // Create a new marker cluster group.
  let markers = L.markerClusterGroup();

  // Loop through the data.
  for (let i = 0; i < data.features.length; i++) {
    // Set the data location property to a variable.
    let location = data.features[i].geometry;

    // Check for the location property.
    if (location) {
      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([parseFloat(location.coordinates[1]), parseFloat(location.coordinates[0])])
        .bindPopup("<b>" + data.features[i].properties.name + "</b><br>Suicide rate (per 100k): " 
          + data.features[i].properties['suicide rate (per 100k)'] 
          + "<br>GDP: " + data.features[i].properties.GDP));
    }
  }

  // Add our marker cluster layer to the map.
  map.addLayer(markers);
});
