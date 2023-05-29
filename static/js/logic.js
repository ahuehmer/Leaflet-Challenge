// Store Url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Send data.features to createFeatures function
    createFeatures(data.features);
});

// Function running for each feature of the earthquake data
function createFeatures(earthquakeData) {

    // Popup for each earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location : ${feature.properties.place}</h3><hr><p> Date and Time: ${new Date(feature.properties.time)}</p><hr><p> Magnitude: ${feature.properties.mag}</p><hr><p> Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Function for markers 
    function Markers(feature, latlng) {
            // Set colors for markers 
            let color = "";
            if (feature.geometry.coordinates[2] > 90) {
                color = "darkred";
            }
            else if (feature.geometry.coordinates[2] > 70) {
                color = "red";
            }
            else if (feature.geometry.coordinates[2] > 50) {
                color = "pink";
            }
            else if (feature.geometry.coordinates[2] > 30) {
                color = "orange";
            }
            else if (feature.geometry.coordinates[2] > 10) {
                color = "lightgreen";
            }
            else {
                color = "green";
            }

            // Add circle markers to the map
            return L.circleMarker(latlng, {
                fillOpacity: 0.75,
                color: "black",
                fillColor: color,
                // Adjust the radius based on magnitude 
                radius: feature.properties.mag * 5
            })
        }
    
    // Create a GeoJSON layer that contains the features array on the earthquakeData object as well as the markers
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: Markers
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

// Function to create map
function createMap(earthquakes) {

    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control
    // Pass it our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

// Call the function to create the legend     
createLegend();

// Function to create legend 
function createLegend() {

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10, 10, 30, 50, 70, 90];
    let colors = ["green", "lightgreen", "orange", "pink", "red", "darkred"];
    let labels = [];

      // Loop through the limits and generate a label with a colored square for each interval
      for (let i = 0; i < limits.length; i++) {
        labels.push(
          '<li style="background-color: ' +
            colors[i] +
            '">&nbsp;</li> ' +
            limits[i] +
            (limits[i + 1] ? "&ndash;" + (limits[i + 1]) + "<br>" : "+")
        );
      }

      div.innerHTML += "<ul style='list-style-type: none; padding-left: 0;'>" + labels.join("") + "</ul>";

      // Add CSS styling for the legend background
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";

      return div;
    };

  // Add  legend to the map
  legend.addTo(myMap);

  };

};
