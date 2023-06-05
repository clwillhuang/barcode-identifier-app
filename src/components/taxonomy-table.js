import React, { useEffect, useMemo } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import MakeRow from './run-table-row';
import { FaSortAlphaDownAlt, FaSortAlphaDown } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const TaxonomyTable = ({ initialData }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Query ID',
                accessor: 'definition'
            },
            {
                Header: 'Classification Result',
                accessor: 'results_species_name'
            },
            {
                Header: 'Original Classification',
                accessor: 'original_species_name'
            },
            {
                Header: 'Accuracy Category',
                accessor: 'accuracy_category'
            },
            {
                Header: 'Percent Identity',
                accessor: 'highest_percent_identity'
            },
            {
                Header: 'Evalue',
                accessor: 'evalue'
            }
        ],
        []
    )

    const tableData = useMemo(() => {
        // perform any modifications to incoming props here
        const parsedData = initialData.map(query => {
            query.hits = query.hits.map(hit => {
                return {
                    ...hit,
                    percent_identity: parseFloat(hit.percent_identity),
                    evalue: parseFloat(hit.evalue)
                }
            })
            const highest_percent_identity_hit = query.hits.reduce((a, b) => a.percent_identity > b.percent_identity ? a : b)
            return {
                ...query,
                highest_percent_identity: highest_percent_identity_hit.percent_identity,
                evalue: highest_percent_identity_hit.evalue
            }
        })
        return parsedData
    }, [initialData])

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize } } = useTable(
            {
                columns,
                data: tableData,
                enableColumnResizing: false,
                initialState: { pageIndex: 0, pageSize: 50 },
            },
            useSortBy, usePagination)

    useEffect(() => {
        const tableWidth = document.querySelector('#table-head').getBoundingClientRect().width;
        document.querySelector('#runcontent').style.width = `${tableWidth}px`

        const topScrollBar = document.querySelector('#runtop')
        const botScrollBar = document.querySelector('#table-container').parentNode

        topScrollBar.addEventListener("scroll", function () {
            botScrollBar.scrollLeft = topScrollBar.scrollLeft;
        });

        botScrollBar.addEventListener("scroll", function () {
            topScrollBar.scrollLeft = botScrollBar.scrollLeft;
        });
    })

    const tableTopId = 'run-table-top';

    return (
        <div id={tableTopId}>
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
            <IconContext.Provider value={{ size: '0.8em', className: 'mx-1' }}>
                <div id='runtop' style={{ overflow: 'auto', height: '15px', marginBottom: '15px'}}>
                    <div id='runcontent' style={{ height: '15px' }}>
                    </div>
                </div>
                <Table id='table-container' striped bordered hover responsive {...getTableProps()}>
                    <thead id='table-head'>
                        {
                            headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <FaSortAlphaDownAlt size={20}/>
                                                            : <FaSortAlphaDown size={20}/>
                                                        : ''}
                                                </span>
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            page.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <MakeRow key={`row${i}`} row={row} />
                                )
                            })
                        }
                    </tbody>
                </Table>
            </IconContext.Provider>
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
        </div>
    )
}

export default TaxonomyTable;