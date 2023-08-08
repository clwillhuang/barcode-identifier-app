import React, { useEffect, useMemo } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import { FaSortAlphaDownAlt, FaSortAlphaDown } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { Link } from 'react-router-dom'

const resolveCellContent = (cell, libraryId) => {
    switch (cell.column.id) {
        case 'custom_name':
            return (<Link to={`/libraries/${libraryId}/version/${cell.row.original.id}`}>{cell.value}</Link>)
        case 'locked':
            return(<span>{cell.value ? 'Published' : 'Unpublished'}</span>)
        case 'id':
            return (<Link to={`/libraries/${libraryId}/version/${cell.value}`}>View</Link>)
        case 'blastId':
            if (cell.value.length > 0) 
                return (<Link to={`/blast?library=${libraryId}&database=${cell.value}`}>Query</Link>)
            else 
                return <></>
        default:
            return (cell.render('Cell'));
    }
}

const VersionTable = ({ initialData, libraryId }) => {

    const data = useMemo(() => {
        return initialData.map(entry => {
            return {...entry, 'blastId': entry.id}
        })
    }, [initialData])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Version',
                accessor: 'version_number'
            },
            {
                Header: 'Name',
                accessor: 'custom_name'
            },
            {
                Header: 'Sequence Count',
                accessor: 'sequence_count'
            },
            {
                Header: 'Published',
                accessor: 'locked',
            },
            {
                Header: 'View',
                accessor: 'id'
            },
            {
                Header: 'Query',
                accessor: 'blastId'
            }
        ], []
    )

    // current data in the table
    const [tableData, setTableData] = React.useState(
        () => data.map(row => {
            return { ...row, blastId: row.locked ? row.blastId : '' }
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
                enableColumnResizing: false,
                initialState: { pageIndex: 0, pageSize: 50 }
            },
            useSortBy, 
            usePagination)

    useEffect(() => {
        const tableWidth = document.querySelector('#table-head').getBoundingClientRect().width;
        document.querySelector('#versioncontent').style.width = `${tableWidth}px`

        const topScrollBar = document.querySelector('#versiontop')
        const botScrollBar = document.querySelector('#table-container').parentNode

        topScrollBar.addEventListener("scroll", function () {
            botScrollBar.scrollLeft = topScrollBar.scrollLeft;
        });

        botScrollBar.addEventListener("scroll", function () {
            topScrollBar.scrollLeft = botScrollBar.scrollLeft;
        });
    })

    const tableTopId = 'version-table-top';

    return (
        <div id={tableTopId}>
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex: pageIndex + 1, pageCount, nextPage, canNextPage, pageSize }} />
            <IconContext.Provider value={{ size: '0.8em', className: 'mx-1' }}>
                <div id='versiontop' style={{ overflow: 'auto', height: '15px', marginBottom: '15px'}}>
                    <div id='versioncontent' style={{ height: '15px' }}>
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
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map(cell =>
                                                <td className='text-nowrap' {...cell.getCellProps()}>
                                                    {resolveCellContent(cell, libraryId)}
                                                    <i className="bi bi-box-arrow-up-right"></i>
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </IconContext.Provider>
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex: pageIndex + 1, pageCount, nextPage, canNextPage, pageSize }} />
        </div>
    )
}

export default VersionTable;