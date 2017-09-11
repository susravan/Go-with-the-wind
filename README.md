# Go with the wind

This project is developed as part of SWHacks conducted on March 2017. This single page web-app gives the best bike route from the given source location to destination taking the effects of wind and elevation along the path. The base paths and elevation data are taken from Google Maps API, wind speed data is taken from OpenWeatherMap API.

For each part of the path taken from base paths, the extra work done by the cyclist against the wind and elevation is calculated and integrated for the whole path. This extra energy calculations are compared for the three paths and the the optimal path is recommended to the user.

**Technologies used:** Flask, Python 2.7, Javascript
