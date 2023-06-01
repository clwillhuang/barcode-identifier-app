import React, { useCallback, useEffect } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import { FaExternalLinkAlt, FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const resolveCellContent = (cell) => {
    switch (cell.column.id) {
        case 'version':
            return (
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                    <code>{cell.value}</code>
                    <FaExternalLinkAlt />
                </a>
            );
        case 'lat_lon':
            return (
                cell.value
                &&
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`http://maps.google.com/maps?q=${cell.value}`}>
                    <code>{cell.value}</code>
                    <FaExternalLinkAlt />
                </a>
            )
        case 'taxon_kingdom':
        case 'taxon_phylum':
        case 'taxon_class':
        case 'taxon_order':
        case 'taxon_family':
        case 'taxon_genus':
        case 'taxon_species':
            return cell.value ?
                <a target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${cell.value.id}`}>
                    {cell.value.scientific_name}
                </a>
                :
                <span>-</span>
        default:
            return (cell.render('Cell'));
    }
}

const DbTable = ({ data }) => {

    const sortTaxaAlphabetically = useCallback((rowA, rowB, columnId, desc) => {
        const valueA = rowA.values[columnId];
        const valueB = rowB.values[columnId];
        if (valueA === null && valueB === null) return 0
        else if (valueA === null) return 1;
        else if (valueB === null) return -1;
        if (valueA.scientific_name < valueB.scientific_name) {
            return desc ? 1 : -1;
        }
        if (valueA.scientific_name > valueB.scientific_name) {
            return desc ? -1 : 1;
        }
        return 0;
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Accession.Version',
                accessor: 'version'
            },
            {
                Header: 'Organism',
                accessor: 'organism'
            },
            {
                Header: 'Specimen Voucher',
                accessor: 'specimen_voucher'
            },
            {
                Header: 'Country',
                accessor: 'country'
            },
            {
                Header: 'Type',
                accessor: 'type_material'
            },
            {
                Header: 'Isolate',
                accessor: 'isolate'
            },
            {
                Header: 'Latitude / Longitude',
                accessor: 'lat_lon'
            },
            {
                Header: 'Modification Date',
                accessor: 'genbank_modification_date'
            },
            {
                Header: "Kingdom",
                accessor: "taxon_kingdom",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Phylum",
                accessor: "taxon_phylum",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Class",
                accessor: "taxon_class",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Order",
                accessor: "taxon_order",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Family",
                accessor: "taxon_family",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Genus",
                accessor: "taxon_genus",
                sortType: sortTaxaAlphabetically,
            },
            {
                Header: "Species",
                accessor: "taxon_species",
                sortType: sortTaxaAlphabetically,
            }
        ],
        [sortTaxaAlphabetically]
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
                initialState: { pageIndex: 0, pageSize: 100 },
            },
            useSortBy, usePagination)

    useEffect(() => {
        const tableWidth = document.querySelector('#db-table-head').getBoundingClientRect().width;
        document.querySelector('#dbcontent').style.width = `${tableWidth}px`

        const topScrollBar = document.querySelector('#dbtop')
        const botScrollBar = document.querySelector('#db-table-container').parentNode

        topScrollBar.addEventListener("scroll", function () {
            botScrollBar.scrollLeft = topScrollBar.scrollLeft;
        });

        botScrollBar.addEventListener("scroll", function () {
            topScrollBar.scrollLeft = botScrollBar.scrollLeft;
        });
    })

    const tableTopId = 'db-table-top';

    return (
        <div style={{ marginTop: '50px' }} id={tableTopId}>
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
            <IconContext.Provider value={{ size: '0.8em', className: 'mx-1' }} >
                <div id='dbtop' style={{ overflow: 'auto', height: '15px', marginBottom: '15px' }}>
                    <div id='dbcontent' style={{ height: '15px' }}>
                    </div>
                </div>
                <Table id='db-table-container' striped bordered hover responsive {...getTableProps()} >
                    <thead id='db-table-head'>
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
                                                            ? <FaSortAlphaUpAlt size={20} />
                                                            : <FaSortAlphaDown size={20} />
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
            <TablePagination topId={tableTopId} {...{ previousPage, canPreviousPage, gotoPage, pageIndex, pageCount, nextPage, canNextPage, pageSize }} />
        </div>
    )
}

export default DbTable;



