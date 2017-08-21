import requests
import json
import threading
import timeit
from decimal import Decimal
import main as temp

from geopy.distance import vincenty

WHEATHER_API_KEY = "bb1ebecae1f1624e5b0e885e8198730e"

# Threading classes


class WindData(threading.Thread):
    def __init__(self, lat_long_arr, dist_interval, threadID, threadName):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.threadName = threadName
        self.lat_long_arr = lat_long_arr
        self.dist_interval = dist_interval

    def run(self):
        #print "Starting " + self.threadName
        self.windData = getWindData(
            self.lat_long_arr, self.threadID, self.dist_interval)

    def get(self):
        return self.windData

# Returns the wind data by making calls to openweathermap API
# (https://openweathermap.org/api)


def getWindData(lat_long_arr, routeNum, dist_interval):
    windData = []
    count = 1
    if len(lat_long_arr) <= 1:
        return windData

    windForceObj = windForceClass(None)

    #print "This is ", count, " request"
    windData.append(getWindAt(lat_long_arr[0], windForceObj))

    j = 0
    while j < len(lat_long_arr) - 1:
        prev_lat_long = lat_long_arr[j]
        curr_lat_long = lat_long_arr[j + 1]
        mapDist = vincenty(prev_lat_long, curr_lat_long).miles

        # If the intermediate poly points are within the dist_interval that is
        # specified in CONSTANTS in main, skip that point
        while mapDist < dist_interval and j < len(lat_long_arr):
            curr_lat_long = lat_long_arr[j]
            windForceObj = windForceClass(None)
            windForceObj.coord = {
                "lat": curr_lat_long[0], "lon": curr_lat_long[1]};
            windForceObj.wind = windData[len(windData) - 1].wind
            windData.append(windForceObj)
            mapDist = vincenty(prev_lat_long, curr_lat_long).miles
            j += 1

        windForceObj = windForceClass(None)

        #print "This is ", count, " request"
        windData.append(getWindAt(curr_lat_long, windForceObj))
        count += 1
        windForceObj.dist = mapDist
        j += 1
    #print "length = ", len(windData)
    return windData

# Storing the json in objects


def getWindAt(curr_lat_long, windForceObj):
    #print str(curr_lat_long[0]), " and ", str(curr_lat_long[1])
    api_call_url = "http://api.openweathermap.org/data/2.5/weather?lat=" + \
        str(curr_lat_long[0]) + "&lon=" + \
        str(curr_lat_long[1]) + "&appid=" + WHEATHER_API_KEY
    windAPI_responseJSON = json.loads(requests.post(
        api_call_url, None).text, parse_float=Decimal)
    #print windAPI_responseJSON
    #print windAPI_responseJSON["coord"]["lat"], ",", windAPI_responseJSON["coord"]["lon"]
    #print windAPI_responseJSON["wind"]["speed"], ",", windAPI_responseJSON["wind"]["deg"]

    windForceObj.populateObj(windAPI_responseJSON)

    return windForceObj


class windForceClass:

    def __init__(self, input_json):
        self.coord = None
        self.wind = None
        self.dist = 0.

    def populateObj(self, input_json):
        self.coord = {"lat": Decimal(input_json["coord"]["lat"]), "lon": Decimal(
            input_json["coord"]["lon"])}
        self.wind = {"speed": input_json["wind"]
                     ["speed"], "deg": input_json["wind"]["deg"]}
        self.dist = 0.
