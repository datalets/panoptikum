
def get_paginated(args, dp_werke, as_json=False):
    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    total = len(dp_werke)
    pages = round(total / per_page)
    offset = (page - 1) * per_page
    dprange = dp_werke[offset : offset + per_page]
    if as_json:
        return dprange.to_json(orient='records')
    return {
        'items': dprange.to_dict(orient='records'),
        'page': page, 'pages': pages, 'total': total,
        # 'has_next': ppp.has_next, 'has_prev': ppp.has_prev
    }
