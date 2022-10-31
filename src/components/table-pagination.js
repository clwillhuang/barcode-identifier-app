import React from 'react';
import { Pagination, Row, Col, Container } from 'react-bootstrap';

export default function TablePagination({previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize}) {
    return(
        <Container>
            <Row>
                <Col className='col-8'>
                    <Pagination className='d-flex justify-content-left'>
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Item onClick={() => gotoPage(0)} disabled={pageIndex === 0}>{1}</Pagination.Item>
                        <Pagination.Ellipsis disabled />
                        {pageIndex - 2 >= 0 && <Pagination.Item onClick={() => gotoPage(pageIndex - 2)}>{pageIndex - 2 + 1}</Pagination.Item>}
                        {pageIndex - 1 >= 0 && <Pagination.Item onClick={() => gotoPage(pageIndex - 1)}>{pageIndex - 1 + 1}</Pagination.Item>}
                        <Pagination.Item active>{pageIndex + 1}</Pagination.Item>
                        {pageIndex + 1 < pageCount && <Pagination.Item onClick={() => gotoPage(pageIndex + 1)}>{pageIndex + 1 + 1}</Pagination.Item>}
                        {pageIndex + 2 < pageCount && <Pagination.Item onClick={() => gotoPage(pageIndex + 2)}>{pageIndex + 2 + 1}</Pagination.Item>}
                        <Pagination.Ellipsis disabled />
                        <Pagination.Item onClick={() => gotoPage(pageCount - 1)} disabled={pageIndex === pageCount - 1}>{pageCount}</Pagination.Item>
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                    </Pagination>
                </Col>
                <Col className='col-4'>
                    <p className='text-end align-middle'>
                        {pageSize} entries per page
                    </p>
                </Col>
            </Row>
        </Container>
    )
}
