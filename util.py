import re

def regex_filter(regex, val):
    if val:
        mo = re.search(regex,val)
        if mo:
            return True
        return False
    return False


def get_random(dp_werke):
    df = dp_werke.copy()
    return df.sample(30).to_json(orient='records')

def get_paginated(args, dp_werke, as_json=False):
    df = dp_werke.copy()
    for f in df:
        val = args.get('o_' + f, None)
        # print(f, df[f].dtype.name)
        if val is not None:
            df = df.dropna(subset=[f])
            dfname = df[f].dtype.name.lower()
            if 'object' in dfname:
                for v in val.split(','):
                    val = re.sub(r'[«»"()]', '.', v) #substitutes special chars with .
                    df = df.loc[df[f].str.contains(val, regex=True, case=False, na=False)]
            elif 'int' in dfname:
                try:
                    val = int(val)
                    df = df.loc[df[f] == val]
                    # print(f, val)
                except:
                    pass

    with_sort = args.get('sort', None)
    if with_sort is not None:
        is_asc = True
        if with_sort.startswith('-'):
            with_sort = with_sort.strip('-')
            is_asc = False
        df = df.sort_values(with_sort, ascending=is_asc)

    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    total = len(df)
    pages = round(total / per_page)
    offset = (page - 1) * per_page
    dprange = df[offset : offset + per_page]
    if as_json:
        return dprange.to_json(orient='records')
    return {
        # 'items': dprange.to_dict(orient='records'),
        'page': page, 'pages': pages, 'total': total,
        # 'has_next': ppp.has_next, 'has_prev': ppp.has_prev
    }
