import os, csv
from csv import DictWriter

def list_files(dir):
    r = {}
    for root, dirs, files in os.walk(dir):
        if 'thumb' in root: continue
        for name in files:
            fn, ext = os.path.splitext(name)
            try:
                wn = int(fn.split('_')[0].split(' ')[0].split(',')[0].strip('.+jpg'))
            except:
                print('Invalid filename: %s' % name)
                continue
            r[wn] = {
                'path': os.path.join(root, name).strip('./'),
                'thumb': os.path.join(root, 'thumb', name).strip('./'),
            }
    return r

if __name__ == '__main__':
    lf = list_files('images')
    with open(os.path.join('data','WERKVERZEICHNIS.csv'), 'r') as csvin:

        reader = csv.DictReader(csvin)
        fieldnames = reader.fieldnames
        if not 'path' in fieldnames: fieldnames.append('path')
        if not 'thumb' in fieldnames: fieldnames.append('thumb')

        with open(os.path.join('data','images.csv'), 'w+') as csvout:
            writer = csv.DictWriter(csvout, fieldnames=fieldnames,
                delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()

            for r in reader:
                try:
                    imagerow = lf[int(r['Nummer'])]
                except:
                    print('Missing image:', r['Nummer'])
                    continue
                r['path'] = imagerow['path']
                r['thumb'] = imagerow['thumb']

                r['Technik+'] = ' '.join(
                    r['Technik I'],
                    r['Technik II'],
                    r['Technik III'],
                    r['Technik IV'],
                )

                r['Motiv'] = ' '.join(
                    r['Motiv I'],
                    r['Motiv II'],
                    r['Motiv III'],
                    r['Motiv IV'],
                )

                r['Darstellungsformen'] = ' '.join(
                    r['Darstellungsformen'],
                    r['Darstellungsformen I'],
                )

                writer.writerow(r)
