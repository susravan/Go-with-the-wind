#!usr/bin/python
from flask import Flask, jsonify, render_template
import sys
sys.path.append('static')
from main import getOptimalRoute

app = Flask(__name__,static_folder='static')


@app.route('/', methods=['GET'])
def baseHtml():
    #return app.send_static_file('index.html')
    return render_template('index.html')
@app.route('/q/<string:r>', methods=['GET'])
def index(r):
    [start, destination] = r.split('&')
    polyL = getOptimalRoute(start, destination)
    return jsonify({"points": [start, destination], "distance": "25", "windText": "Wind will oppose you for 50 % of ride", "climate": "sunny", "polyline": polyL})

if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='0.0.0.0', port=8000)
