import os, csv
from csv import DictWriter

from stats import *

def list_files(dir):
    r = {}
    for root, dirs, files in os.walk(dir):
        if 'thumb' in root: continue
        for name in files:
            fn, ext = os.path.splitext(name)
            try:
                wn = int(fn.split('_')[0].split(' ')[0].split(',')[0].strip('.+jpg'))
            except:
                print('Invalid file: %s' % os.path.join(root, name))
                continue
            r[wn] = {
                'path': os.path.join(root, name).strip('./'),
                'thumb': os.path.join(root, 'thumb', name).strip('./'),
            }
    return r

def update_files(lf, filename='WERKVERZEICHNIS.csv', outputfile='images.csv'):
    with open(os.path.join('data',filename), 'r') as csvin:

        reader = csv.DictReader(csvin)
        fieldnames = reader.fieldnames

        if not 'path' in fieldnames: fieldnames.append('path')
        if not 'thumb' in fieldnames: fieldnames.append('thumb')

        fieldnames.append('Techniken')
        fieldnames.append('Motiven')
        fieldnames.append('Darstellungsformen')

        outputpath = os.path.join('data',outputfile)
        print("Writing to %s" % outputpath)

        with open(outputpath, 'w+') as csvout:
            writer = csv.DictWriter(csvout, fieldnames=fieldnames,
                delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()

            print('Scanning images, showing any missing below:')
            for r in reader:
                try:
                    imagerow = lf[int(r['Nummer'])]
                except:
                    print(r['Nummer'], end=' ')
                    continue

                r['path'] = imagerow['path']
                r['thumb'] = imagerow['thumb']

                # TODO: load image to determine dimensions

                r['Techniken'] = ' '.join([
                    r['Technik'],
                    r['Technik I'],
                    r['Technik II'],
                    r['Technik III'],
                    r['Technik IV'],
                ])

                r['Motiven'] = ' '.join([
                    r['Motiv I'],
                    r['Motiv II'],
                    r['Motiv III'],
                    r['Motiv IV'],
                ])

                r['Darstellungsformen'] = ' '.join([
                    r['Darstellungsform'],
                    r['Darstellungsform I'],
                ])

                r['Jahr'] = r['Jahr'].strip().strip('a')

                writer.writerow(r)

            print("--- Done.")




if __name__ == '__main__':
    lf = list_files('images')
    update_files(lf)
    update_stats()
