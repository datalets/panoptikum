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
        if val is not None:
            df = df.loc[df[f].str.contains(val, na=False)]
            # df = df[df[f].apply(regex_filter, regex, val)]
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
