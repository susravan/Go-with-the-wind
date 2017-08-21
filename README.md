# Go with the wind

### Description
A single-page web application to guide bicyclists on an optimized route to the destination. Route suggestions are based on least energy spent against wind and altitude.

### Details
* Used Google Maps API for altitudes at different points along a path between source and destination. This altitude information is used to calculate energy spent against altitude.

* With the Open Weather Map API, energy spent against wind is calculated.

* Deployed a Flask server on Heroku to serve as backend server for energy calculations and API calls.

### URL
https://fast-tor-24142.herokuapp.com/
