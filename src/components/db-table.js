import React from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
// import { useQuery } from 'react-query'

// TODO: implement pagination according to this example: https://react-table-v7.tanstack.com/docs/examples/pagination
const DbTable = ({ data }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Accession Number',
                accessor: 'accession_number'
            },
            {
                Header: 'Organism',
                accessor: 'organism'
            },
            {
                Header: 'Definition',
                accessor: 'definition'
            },
            {
                Header: 'Isolate',
                accessor: 'isolate'
            },
            {
                Header: 'Country',
                accessor: 'country'
            },
            {
                Header: 'Latitude / Longitude',
                accessor: 'lat_lon'
            }
        ],
        []
    )

    // const accession_numbers = data.map(x => x.accession_number).join(',')
    
    // const genBankUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${accession_numbers}&rettype=gb&retmode=xml`
    // const { isLoading, error, data: genBankData } = useQuery([`genbank_fetch`], () =>
    //     fetch(genBankUrl)
    //         .then((response) => response),
    //     {
    //         retry: false,
    //         staleTime: Infinity,
    //         retryDelay: attempt => attempt * 10000 ,
    //         refetchOnMount: false,
    //         refetchOnWindowFocus: false,
    //     }
    // )

    // if (!isLoading && !error) {
    //     console.log(genBankData)
    // }

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
                initialState: { pageIndex: 0, pageSize: 15 },
            },
            useSortBy, usePagination)

    return (
        <React.Fragment>
            <TablePagination {...{previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize}}/>
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
                                                {/* TODO: Find sorting icons */}
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
                                    {row.cells.map(cell => {
                                        if (cell.column.id === 'accession_number')
                                            return (
                                                // TODO: Add external link icon
                                                <td {...cell.getCellProps()}>
                                                    <a target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                                                        <code>{cell.value}</code>
                                                    </a>
                                                </td>
                                            );
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <TablePagination {...{previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize}}/>
        </React.Fragment>
    )
}

export default DbTable;



