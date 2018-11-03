
def get_paginated(args, dp_werke):
    page = int(args.get('page', 1))
    per_page = int(args.get('per_page', 10))
    total = len(dp_werke)
    pages = round(total / per_page)
    offset = (page - 1) * per_page
    ppp = dp_werke[offset : offset + per_page].to_dict(orient='records')
    return {
        'items': ppp,
        'page': page, 'pages': pages, 'total': total,
        # 'has_next': ppp.has_next, 'has_prev': ppp.has_prev
    }
