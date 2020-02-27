Projekt PANOPTIKUM
==================

This is a web application that converts CSV files to an API with search and filtering. It has been used to create a digital collection of artworks, but could be used for essentially any data that is described using a [Data Package](http://frictionlessdata.io/specs/data-package/#specification). Find out more on the [Open Knowledge Blog](https://blog.okfn.org/2019/05/09/panoptikum-exploring-new-ways-to-categorize-a-collection-of-various-unusual-and-unique-objects/).

Made with [Frictionless Data](https://frictionlessdata.io), [Flask](http://flask.pocoo.org/), [Bootstrap](https://getbootstrap.com) and [PhotoSwipe](https://photoswipe.com/).

# Deployment

1. Install pipenv
2. `pipenv --python 3`
3. `pipenv shell`
4. `pipenv sync`
5. `flask run`

```
sudo apt-get install python3.6 python3-numpy
virtualenv --system-site-packages -p python3.6 env
```

# Data refresh

To update the metadata, we run this script from the pipenv shell:

`python collect.py`

This script expects a `data/WERKVERZEICHNIS.csv` which is the UTF-8 encoded conversion of the source Excel file. It creates (or refreshes) a Data Package specification by inferring schema from the data using [Data Package Pipelines](https://github.com/frictionlessdata/datapackage-pipelines).

The script also checks that images are present in the `images` folder. You may want to prepare the images first, if this is part of your use case. Otherwise, look at the source code to fit the process to your data.

# Image collection

The `convert` utility from [ImageMagick](https://imagemagick.org/) is required for this process.

Use the `convert.sh` script to prepare an `images` folder with consistent formats (JPEG) and resolutions (720p).

Then use `thumbs.sh` to generate thumbnails.

The scripts skip any files that are already present, and can be used for updates.

# Running

In development, use:

`env FLASK_DEBUG=1 flask run`

In production, something like:

`gunicorn --log-level=info -w 4 -b :8000 app:app`
