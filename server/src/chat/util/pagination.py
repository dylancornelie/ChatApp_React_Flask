"""Simple helper to paginate query
"""

from flask import url_for, request
from flask_sqlalchemy import BaseQuery

from src.chat.model.pagination import Pagination


def extract_pagination(page=None, per_page=None, **request_args):
    page = int(page) if page is not None else Pagination.DEFAULT_PAGE_NUMBER
    per_page = int(per_page) if per_page is not None else Pagination.DEFAULT_PAGE_SIZE
    return page, per_page, request_args


def paginate(query: BaseQuery) -> Pagination:
    page, per_page, other_request_args = extract_pagination(**request.args)
    page_obj = query.paginate(page=page, per_page=per_page)
    next_ = url_for(
        request.endpoint,
        page=page_obj.next_num if page_obj.has_next else page_obj.page,
        per_page=per_page,
        **other_request_args,
        **request.view_args
    )
    prev = url_for(
        request.endpoint,
        page=page_obj.prev_num if page_obj.has_prev else page_obj.page,
        per_page=per_page,
        **other_request_args,
        **request.view_args
    )

    return Pagination(
        total=page_obj.total,
        pages=page_obj.pages,
        has_prev=page_obj.has_prev,
        has_next=page_obj.has_next,
        next_=next_,
        prev=prev,
        data=page_obj.items
    )
