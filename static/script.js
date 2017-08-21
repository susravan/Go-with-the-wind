var filghtPath;
var map;
var marker1;
var marker2;
var bounds;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 33.4255, lng: -111.9400},
    mapTypeId: 'terrain'
  });
var start = String(document.getElementById('start'));
var end = String(document.getElementById('end'));
var obj;
bounds = new google.maps.LatLngBounds();
flightPath = new google.maps.Polyline({
    path: [{lat: 33.4255, lng: -111.9400}],
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
var pinColor = "FE7569";
var pinColorGreen = "00FF00";
var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));
var pinImageGreen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColorGreen,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));
var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    new google.maps.Size(40, 37),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 35));
marker1 = new google.maps.Marker({
      position: null,
      title: 'Origin',
      icon: pinImage,
      shadow: pinShadow
    });
marker2 = new google.maps.Marker({
      position: null,
      title: 'Destination',
      icon: pinImageGreen,
      shadow: pinShadow
    });

var onClickHandler = function() {
fetch("https://fast-tor-24142.herokuapp.com/q/"+getStart()+"&"+getDestination())
.then((resp) => resp.json())
.then(function(data) {
    start = getStart();
    end = getDestination();
    //console.log(data);
    polyL = data.polyline;
    console.log(polyL);
    route = decodePolyline(polyL);

    loc = new google.maps.LatLng(String(route[0][0]), String(route[0][1]));
    //console.log(String(route[0][0]) + String(route[0][1]));
    bounds.extend(loc);
    loc = new google.maps.LatLng(String(route[route.length-1][0]), String(route[route.length-1][1]));
    //console.log(String(route[route.length-1][0]) + String(route[route.length-1][1]));
    bounds.extend(loc);
    flightPath.setMap(null);
    marker1.setMap(null);
    marker2.setMap(null);
    marker1 = new google.maps.Marker({
          position: route[0],
          title: 'Origin',
          icon: pinImage,
          shadow: pinShadow
        });
    marker2 = new google.maps.Marker({
          position: route[route.length-1],
          title: 'Destination',
          icon: pinImageGreen,
          shadow: pinShadow
        });
    marker1.setMap(map);
    marker2.setMap(map);
    // directionsDisplay.setDirections(data.routes[0]);
    flightPath.setPath(route);
    flightPath.setMap(map);
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    // var newPos = new google.maps.LatLng(latlongParts[0], latlongParts[1])
    var index = (route.length/2).toFixed(0);
    var newPos = new google.maps.LatLng(route[index]);
    map.setOptions({
       center: newPos,
       zoom: 14
   });
    // ////console.log(route0);
    // //console.log(route1);
    // //console.log(route2);
    })
  .catch(function(error) {
    //console.log(error)
  });
  };
document.getElementById('directionsButton').addEventListener('click', onClickHandler);
}

function decodePolyline(encoded) {
        if (!encoded) {
            return [];
        }
	encoded=unescape(encoded)
        var poly = [];
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;

       while (index < len) {
            var b, shift = 0, result = 0;

           do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

           var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;

           shift = 0;
            result = 0;

           do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

           var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;

           var p = {
                lat: lat / 1e5,
                lng: lng / 1e5,
            };
            poly.push(p);
        }
        return poly;
    }
function getStart(){
  return String(document.getElementById('start').value);
}
function getDestination(){
  return String(document.getElementById('end').value)
}
