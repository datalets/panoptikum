from flask import Flask
from flask_api import FlaskAPI
from pandas_datapackage_reader import read_datapackage

from flask import (
    url_for, redirect,
    request, flash,
    render_template,
    send_from_directory,
)

try:
    from .util import *
except:
    from util import *

app = FlaskAPI(__name__)


# Create API endpoints

data = read_datapackage("data")

@app.route('/api/<resource>')
def api_dict(resource):
    return get_paginated(request.args, data[resource])

@app.route('/api/<resource>.json')
def api_json(resource):
    return get_paginated(request.args, data[resource], True)

@app.route('/api/<resource>/all.json')
def api_all_json(resource):
    return data[resource].to_json(orient='records')

# Static views

@app.route('/')
def send_home():
    return render_template('public/index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('images', path)

if __name__ == '__main__':
    app.run(debug=True)
