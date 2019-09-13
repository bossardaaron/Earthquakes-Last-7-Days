var Url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create a map object
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 4
// });
    
function getColor(d) {
 return d > 5? '#641E16' :
       d > 4? '#A93226' :
       d > 3  ? '#E67E22' :
       d > 2  ? '#F7DC6F' :
       d > 1   ? '#82E0AA' :
                  '#EAFAF1';
}
   
d3.json(Url, function(data) { 
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

function style(feature) {
  var mag = feature.properties.mag; 
  var color_value=getColor(mag)

  return {radius:mag*2,
    color: "#000",
    fillColor:color_value,
    fillOpacity: 1,
    weight: 1,
    opacity: 0}
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style(feature));
    },

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and satellite layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
    
// var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
//     maxZoom: 15,
//     subdomains:['mt0','mt1','mt2','mt3']
//   });
    
    
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    // "Satellite":satellite, 
    "Street Map": streetmap,
  };
  
                                
// Create overlay object to hold our overlay layer
  var overlayMap = {
    "Earthquakes": earthquakes,
  };
                                
      // Create map, give it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      55, -120
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
    //layers: earthquakes
  });
                              
               
      L.control.layers(baseMaps, overlayMap).addTo(myMap);
                          
                                
      var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,  1, 2, 3, 4, 5],
        labels = [];
    // loop through our magnitudes and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+0.01 ) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);
};