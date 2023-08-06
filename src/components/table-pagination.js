import React from 'react';
import { Pagination, Row, Col, Container } from 'react-bootstrap';

export default function TablePagination({topId, previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize}) {
    
    return(
        <Container className='mt-3' id='page'>
            <Row>
                <Col className='col-8'>
                    <Pagination className='d-flex justify-content-left'>
                        <Pagination.Prev href={`#${topId}`} onClick={() => previousPage()} disabled={!canPreviousPage} />
                        {
                            pageCount >= 1 ?
                            <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(1)} disabled={pageIndex === 1}>{1}</Pagination.Item> :
                            <Pagination.Item href={`#${topId}`} disabled>{0}</Pagination.Item>
                        }
                        <Pagination.Ellipsis disabled />
                        {pageIndex - 2 >= 1 && <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(pageIndex - 2)}>{pageIndex - 2}</Pagination.Item>}
                        {pageIndex - 1 >= 1 && <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(pageIndex - 1)}>{pageIndex - 1}</Pagination.Item>}
                        <Pagination.Item active>{pageIndex}</Pagination.Item>
                        {pageIndex + 1 <= pageCount && <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(pageIndex + 1)}>{pageIndex + 1}</Pagination.Item>}
                        {pageIndex + 2 <= pageCount && <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(pageIndex + 2)}>{pageIndex + 2}</Pagination.Item>}
                        <Pagination.Ellipsis disabled />
                        <Pagination.Item href={`#${topId}`} onClick={() => gotoPage(pageCount)} disabled={pageIndex === pageCount}>{pageCount}</Pagination.Item>
                        <Pagination.Next href={`#${topId}`} onClick={() => nextPage()} disabled={!canNextPage} />
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
