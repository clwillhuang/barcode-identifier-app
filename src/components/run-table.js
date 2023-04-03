import React, { useEffect } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import MakeRow from './run-table-row';
import { FaSortAlphaDownAlt, FaSortAlphaUpAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const RunTable = ({ initialData }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Percent Identity',
                accessor: 'percent_identity'
            },
            {
                Header: 'Query Definition',
                accessor: 'query_accession_version'
            },
            {
                Header: 'Accession Number',
                accessor: 'subject_accession_version'
            },
            {
                Header: 'Organism',
                accessor: 'db_entry.organism',
            },
            {
                Header: 'Country',
                accessor: 'db_entry.country',
            },
            {
                Header: 'Specimen Voucher',
                accessor: 'db_entry.specimen_voucher',
            },
            {
                Header: 'Type',
                accessor: 'db_entry.type_material',
            },
            {
                Header: 'Alignment Length',
                accessor: 'alignment_length'
            },
            {
                Header: 'Evalue',
                accessor: 'evalue'
            },
            {
                Header: 'Bit Score',
                accessor: 'bit_score'
            },
            {
                Header: 'Latitude / Longitude',
                accessor: 'db_entry.lat_lon',
            },
        ],
        []
    )

    // current data in the table
    const [tableData, setTableData] = React.useState(
        () => initialData.map(row => {
            return { ...row }
        }))

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
                                                            : <FaSortAlphaUpAlt size={20}/>
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

export default RunTable;