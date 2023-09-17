// API base URL
// Run Flask server first: python flash_server.py
let api_url = 'http://127.0.0.1:5000/api/v1.0/country_actor_networth_geojson';
// let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/';

// Performing a GET request to the query URL/
d3.json(api_url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    // console.log(data.features);
});

function createFeatures(Actors_info) {

    // Defining a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the origin country related actor networth information.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.Country}</h3><hr>
      <p><b>Average_Networth: </b>${Math.round(feature.properties.Average_networth)}<br/>
      <b>Top_Actors: </b>${feature.properties.Top_actors}<br/>
      <b>Top_Actors_Networth:</b>${feature.properties.Top_actors_networth}<br/>
      <b>Max_networth: </b>${Math.round(feature.properties.Max_networth)}<br/>
      <b>Min_networth: </b>${Math.round(feature.properties.Min_networth)}<br/>
      <b>Median_networth: </b>${Math.round(feature.properties.Median_networth)}<br/>
      <b>Total_actors: </b>${feature.properties.Total_actors}</p>`
      );
      layer.on('mouseover', function (e) {
        this.openPopup();
      });
      layer.on('mouseout', function (e) {
        this.closePopup();
      });
    }

  // Creating a GeoJSON layer that contains the features array on the Actors object.
  // Running the onEachFeature function once for each piece of data in the array.
  let networth = L.geoJSON(Actors_info, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      colour = markerColour(feature.properties.Country);
      
      var geojsonMarkerOptions = {
        radius: markerSize(feature.properties.Average_networth),
        fillColor: colour,
        color: colour,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      pointer = L.circleMarker(latlng, geojsonMarkerOptions);
      // console.log(latlng,geojsonMarkerOptions);
      return pointer;
    }
  });
  // Sending networth layer to the createMap function
  createMap(networth);
}

// A function to determine the marker size based on the average networth for each country
function markerSize(Average_networth) {
    return (Average_networth*2/10000000);
  }
// A function to determine the marker colour based on each country 
function markerColour(Country){
  for( var i =0; i < 50; i++){
    if(Country[i]){
      colour = getRandomColor()
    };
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ){
        color += letters[Math.round(Math.random() * 15)];
      };
      return color;
    };    
  return colour;
  };
};  

  //createMap function
  function createMap(networth) {
    // Creating the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Creating layer groups:for networth markers.
    let average_networth = L.layerGroup(networth);
    console.log(networth);

    // Creating a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Creating an overlay object.
    let overlayMaps = {
      "Average Actors Networth": networth
   };
  
    // Defining a map object.
    let myMap = L.map("map", {
      center: [28, 2],
      zoom: 2.497,
      layers: [street, networth]
    });
  
    // Passing map layers to layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
   }).addTo(myMap);

  } 


