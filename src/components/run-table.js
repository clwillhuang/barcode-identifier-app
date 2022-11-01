import React from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';

const RunTable = ({ data }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Accession Version',
                accessor: 'subject_accession_version'
            },
            {
                Header: 'Percent Identity',
                accessor: 'percent_identity'
            },
            {
                Header: 'Alignment Length',
                accessor: 'alignment_length'
            },
            {
                Header: 'Mismatches',
                accessor: 'mismatches'
            },
            {
                Header: 'Gap Opens',
                accessor: 'gap_opens'
            },
            {
                Header: 'Query Start',
                accessor: 'query_start'
            },
            {
                Header: 'Query End',
                accessor: 'query_end'
            },
            {
                Header: 'Sequence Start',
                accessor: 'sequence_start'
            },
            {
                Header: 'Sequence End',
                accessor: 'sequence_end'
            },
            {
                Header: 'Evalue',
                accessor: 'evalue'
            },
            {
                Header: 'Bit Score',
                accessor: 'bit_score'
            },
        ],
        []
    )

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
                data,
                initialState: { pageIndex: 0, pageSize: 50 },
            },
            useSortBy, usePagination)

    return (
        <React.Fragment>
            <p>BLAST run returned <strong>{data.length}</strong> hits</p>
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
            <Table striped bordered hover responsive {...getTableProps()} >
                <thead>
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
                                                        ? ' 🔽'
                                                        : ' 🔼'
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
                                        row.cells.map(cell => {
                                            if (cell.column.id === 'evalue' || cell.column.id === 'bit_score') {
                                                return (
                                                    <td {...cell.getCellProps()}>
                                                        {Number(cell.value)}
                                                    </td>
                                                )
                                                } else if (cell.column.id === 'subject_accession_version') {
                                                    // TODO: Add external link icon
                                                    return(<td {...cell.getCellProps()}>
                                                        <a target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                                                            <code>{cell.value}</code>
                                                        </a>
                                                    </td>)
                                                } else 
                                                return (
                                                    <td {...cell.getCellProps()}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                            }
                                        )
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
        </React.Fragment>
    )
}

export default RunTable;