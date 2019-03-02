import os

from pandas_datapackage_reader import read_datapackage

from util import *

def update_stats(filename = os.path.join('data', 'filterstats.csv')):
    data = read_datapackage("data")
    filters = data['filters']
    images = data['images']

    # Concatenate columns
    # images['Technik'] = images.apply()

    # Apply stats
    images.fillna('', inplace=True)
    # print(images.head)
    filters.dropna(subset=['Code', 'Column'], inplace=True)
    # print(filters.head)

    filters['Count'] = filters.apply(
        lambda row: len(
            images.loc[
                images[row['Column']].str.contains(row['Code'])
            ]
        ), axis = 1
    )

    print(filters.head(n=5))

    print("Writing to %s" % filename)
    filters.to_csv(filename, index=False)


if __name__ == '__main__':
    update_stats()
