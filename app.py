from flask import Flask
from flask_api import FlaskAPI
from pandas_datapackage_reader import read_datapackage

from flask import (
    url_for, redirect,
    request, flash,
    render_template,
    send_from_directory,
)

app = FlaskAPI(__name__)

# From local data folder
dp_werke = read_datapackage("data", "WERKVERZEICHNIS")
# print(dp_werke.columns)
# datastore = dp_werke.to_dict(orient='index')

dp_motive = read_datapackage("data", "MOTIVE")

def get_paginated():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    total = len(dp_werke)
    pages = round(total / per_page)
    offset = (page - 1) * per_page
    ppp = dp_werke[offset : offset + per_page].to_dict(orient='records')
    return {
        'items': ppp,
        'page': page, 'pages': pages, 'total': total,
        # 'has_next': ppp.has_next, 'has_prev': ppp.has_prev
    }

@app.route('/client/<path:path>')
def send_client(path):
    return send_from_directory('templates/public', path)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/motive/')
def motive():
    return dp_motive.to_dict(orient='records')

@app.route('/works/')
def works(offset=0, per_page=20):
    return get_paginated()

if __name__ == '__main__':
    app.run(debug=True)
