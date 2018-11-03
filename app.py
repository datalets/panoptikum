from flask import Flask
from flask_api import FlaskAPI
from pandas_datapackage_reader import read_datapackage

from flask import (
    url_for, redirect,
    request, flash,
    render_template,
    send_from_directory,
)

from .util import *

app = FlaskAPI(__name__)

# API endpoints

dp_werke = read_datapackage("data", "WERKVERZEICHNIS")

@app.route('/api/works/')
def api_works(): return get_paginated(request.args, dp_werke)


dp_forms = read_datapackage("data", "form")

@app.route('/api/forms/')
def api_forms_dict(): return dp_forms.to_dict(orient='records')
@app.route('/api/forms/json')
def api_forms_json(): return dp_forms.to_json(orient='records')


dp_inhalt = read_datapackage("data", "inhalt")

@app.route('/api/inhalt/')
def api_inhalt_dict(): return dp_inhalt.to_dict(orient='records')
@app.route('/api/inhalt/json')
def api_inhalt_json(): return dp_inhalt.to_json(orient='records')


dp_themen = read_datapackage("data", "themen")

@app.route('/api/themen/')
def api_themen_dict(): return dp_themen.to_dict(orient='records')
@app.route('/api/themen/json')
def api_themen_json(): return dp_themen.to_json(orient='records')


dp_zeiten = read_datapackage("data", "zeiten")

@app.route('/api/zeiten/')
def api_zeiten_dict(): return dp_zeiten.to_dict(orient='records')
@app.route('/api/zeiten/json')
def api_zeiten_json(): return dp_zeiten.to_json(orient='records')

# Static views

@app.route('/')
def send_home():
    return render_template('public/index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


if __name__ == '__main__':
    app.run(debug=True)
