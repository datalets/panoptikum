import os

from pandas_datapackage_reader import read_datapackage

from util import *

def update_stats():
    data = read_datapackage("data")
    filters = data['filters']
    filename = os.path.join('data', filters._metadata['path'])
    images = data['images']

    # Concatenate columns
    # images['Technik'] = images.apply()

    # Apply stats
    images.fillna('', inplace=True)
    # print(images.head)
    filters.dropna(subset=['Code', 'Column'], inplace=True)
    # print(filters.head)

    filters['Count'] = filters.apply(
        lambda row: (
            row['Code'] == '.*' and len(
                images.loc[
                    images[row['Column']].str.len() > 0
                ]
            ) or len(
                images.loc[
                    images[row['Column']].str.match('^' + row['Code'] + '$', case=False)
                ]
            )
        ), axis = 1
    )

    print(filters.head(n=5))

    print("Writing to %s" % filename)
    filters.to_csv(filename, index=False)


if __name__ == '__main__':
    update_stats()
