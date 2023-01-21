import React from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import MakeRow from './run-table-row';
import { IconContext } from 'react-icons'
// import { useQuery } from 'react-query';
// import { urlRoot } from '../url';

const RunTable = ({ initialData }) => {

    const columns = React.useMemo(
        () => [
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
                Header: 'Latitude / Longitude',
                accessor: 'db_entry.lat_lon',
            },
            {
                Header: 'Type',
                accessor: 'db_entry.type_material',
            },
            {
                Header: 'Isolate',
                accessor: 'db_entry.isolate',
            },
            {
                Header: 'Percent Identity',
                accessor: 'percent_identity'
            },
            {
                Header: 'Alignment Length',
                accessor: 'alignment_length'
            },
            // {
            //     Header: 'Mismatches',
            //     accessor: 'mismatches'
            // },
            // {
            //     Header: 'Gap Opens',
            //     accessor: 'gap_opens'
            // },
            // {
            //     Header: 'Query Start',
            //     accessor: 'query_start'
            // },
            // {
            //     Header: 'Query End',
            //     accessor: 'query_end'
            // },
            // {
            //     Header: 'Sequence Start',
            //     accessor: 'sequence_start'
            // },
            // {
            //     Header: 'Sequence End',
            //     accessor: 'sequence_end'
            // },
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

    // optional: fetch organism data from a separate url
    // const entries_visible = page.map(row => row.original.subject_accession_version)
    // const url = `${urlRoot}/nuccores/${entries_visible.join(',')}`
    // const { isLoading, error } = useQuery([`results_row_accessions`], () =>
    //     fetch(url)
    //     .then((response) => response.json())
    //     .then((newData) => {
    //         setTableData(tableData.map(
    //             (row, index) => {
    //                 // update the current table's data by adding the fields present in the fetched data
    //                 let match = newData.find(x => x.accession_number === row.subject_accession_version)
    //                 let updatedFields = (({country, organism, isolate}) => ({country, organism, isolate}))(match)
    //                 return { ... row, ...updatedFields }
    //             } 
    //         ))
    //     })
    //     .catch((e) => console.log(e)),
    // )

    // if (isLoading) {
    //     return(<p>Loading table data ...</p>)
    // }

    // if (isError) {
    //     return(<p>Error loading table data ...</p>)
    // }

    return (
        <React.Fragment>
            
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
            <IconContext.Provider value={{ size: '0.8em', className: 'mx-1'}}>
            <Table striped bordered hover responsive {...getTableProps()}>
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
                                <MakeRow key={`row${i}`} row={row}/>
                            )
                        })
                    }
                </tbody>
            </Table>
            </IconContext.Provider>
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
        </React.Fragment>
    )
}

export default RunTable;