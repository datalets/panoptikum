def regex_filter(regex, val):
    if val:
        mo = re.search(regex,val)
        if mo:
            return True
        return False
    return False

def get_paginated(args, dp_werke, as_json=False):
    df = dp_werke.copy()
    for f in df:
        val = args.get('o_' + f, None)
        # print(f, df[f].dtype.name)
        if val is not None:
            df = df.dropna(subset=[f])
            if 'object' in df[f].dtype.name:
                for v in val.split(','):
                    val = r'\b%s\b' % v
                    # print(f, val)
                    df = df.loc[df[f].str.contains(val, regex=True)]
                    # df = df[df[f].apply(regex_filter, regex, val)]
            elif 'int' in df[f].dtype.name:
                try:
                    val = int(val)
                    df = df.loc[df[f] == val]
                except:
                    pass

    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    total = len(df)
    pages = round(total / per_page)
    offset = (page - 1) * per_page
    dprange = df[offset : offset + per_page]
    if as_json:
        return dprange.to_json(orient='records')
    return {
        'items': dprange.to_dict(orient='records'),
        'page': page, 'pages': pages, 'total': total,
        # 'has_next': ppp.has_next, 'has_prev': ppp.has_prev
    }
