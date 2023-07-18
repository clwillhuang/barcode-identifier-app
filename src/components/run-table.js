import React, { useEffect, useMemo, useState } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import MakeRow from './run-table-row';
import { FaSortAlphaDownAlt, FaSortAlphaDown } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import SequencePopup from './sequence-popup';
import { useQuery } from 'react-query';
import { generateHeaders, urlRoot } from '../url';
import { ErrorMessage, handleResponse } from './error-message';

const RunTable = ({ runId, querySequenceId }) => {

    const [ sequenceShown, setSequenceShown] = useState(null);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Percent Identity',
                accessor: 'percent_identity'
            },
            {
                Header: 'Query ID',
                accessor: 'query_accession_version'
            },
            {
                Header: 'Accession Number',
                accessor: 'subject_accession_version'
            },
            {
                Header: 'Info',
                accessor: 'db_entry.id',
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

    const PAGE_SIZE = 20
    const [count, setCount] = useState(50)
    const pageCount = Math.ceil(count / PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const [fetchKey, setFetchKey] = useState([`runs_${runId}_${querySequenceId}`])
    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < pageCount
    const nextPage = () => { if (canNextPage) setCurrentPage(currentPage + 1) }
    const previousPage = () => { if (canPreviousPage) setCurrentPage(currentPage - 1) }
    const gotoPage = (newPage) => { if (newPage >= 1 && newPage <= pageCount) setCurrentPage(newPage) }
    const pageIndex = currentPage;
    const pageSize = PAGE_SIZE;

    const { isLoading, error, data, isError, isSuccess } = useQuery(fetchKey, () => {
        const params = {
            page: currentPage,
            page_size: PAGE_SIZE,
            ...(sortBy.length > 0 && { ordering: `${sortBy[0].desc ? '-' : ''}${sortBy[0].id}` })
        };
        return fetch(`${urlRoot}/runs/${runId}/queries/${querySequenceId}/hits?${(new URLSearchParams(params)).toString()}`, {
            headers: generateHeaders({})
        })
            .then(handleResponse())
    },
        {
            refetchInterval: false,
            retry: false,
            onSuccess: (data) => {
                setCount(data.count)
            }
        }
    ) 

    const tableData = useMemo(() => {
        if (isLoading || isError || !isSuccess) return []
        else return data.results
    }, [data])

    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        state: { sortBy } } = useTable(
            {
                columns,
                data: tableData,
                manualSorting: true,
                manualSortBy: true,
                initialState: { 
                    enableColumnResizing: false,
                    sortBy: [
                        {
                            id: 'percent_identity',
                            desc: true
                        }
                    ]
                },
            },
            useSortBy)

    useEffect(() => {
        let ordering = sortBy.length > 0 ? `order${sortBy[0].desc ? '-' : ''}${sortBy[0].id}` : ''
        setFetchKey([`runs_${runId}_${querySequenceId}pg${currentPage}ps${PAGE_SIZE}${ordering}`])
    }, [sortBy, querySequenceId, runId, PAGE_SIZE, currentPage])

    useEffect(() => {
        if (isLoading || isError) return;
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

    if (isLoading) {
        return (<div>Loading data ...</div>)
    } else if (isError) {
        return (<ErrorMessage error={error} />)
    }
        
    const tableTopId = 'run-table-top';

    return (
        <div id={tableTopId}>
            <SequencePopup nuccoreId={sequenceShown} setSequenceShown={setSequenceShown}/>
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
                            rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <MakeRow key={`row${i}`} row={row} setSequenceShown={setSequenceShown}/>
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