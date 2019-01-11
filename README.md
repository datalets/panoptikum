Projekt PANOPTIKUM
==================

1. Install pipenv
2. `pipenv --python 3`
3. `pipenv shell`
4. `pipenv sync`
5. `flask run`

# Image collection

Use the `convert.sh` script to prepare an `images` folder with consistent formats (JPEG) and resolutions (720p).

Then use `thumbs.sh` to generate thumbnails.

The scripts skip any files that are already present, and can be used for updates.

# Data refresh

To update the metadata, run this script from the pipenv shell:

`python collect.py`

This script expects a `data/WERKVERZEICHNIS.csv` which is the UTF-8 encoded conversion of the source Excel file.

It also checks that images are present in the `images` folder.

# TODO

- (Anzahl)
- Sort by year
- Jahren
- iPad

// MD512GP/A
// 8.4.1
