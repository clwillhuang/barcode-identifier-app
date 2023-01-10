import React from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import { BsBoxArrowUpRight } from 'react-icons/bs'
import { IconContext } from 'react-icons'

const resolveCellContent = (cell) => {
    switch (cell.column.id) {
        case 'accession_number':
            return (
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                    <code>{cell.value}</code>
                    <BsBoxArrowUpRight />
                </a>
            );
        case 'lat_lon':
            return (
                cell.value 
                    &&
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`http://maps.google.com/maps?q=${cell.value}`}>
                    <code>{cell.value}</code>
                    <BsBoxArrowUpRight />
                </a>
            )
        default:
            return (cell.render('Cell'));
    }
}

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
                Header: 'Type',
                accessor: 'type',
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
                initialState: { pageIndex: 0, pageSize: 10 },
            },
            useSortBy, usePagination)

    return (
        <React.Fragment>
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
            <IconContext.Provider value={{ size: '0.8em', className: 'mx-1'}} >
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
                                        {
                                            row.cells.map(cell =>
                                                <td className='text-nowrap' {...cell.getCellProps()}>
                                                    {resolveCellContent(cell)}
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
            <TablePagination {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
        </React.Fragment>
    )
}

export default DbTable;



