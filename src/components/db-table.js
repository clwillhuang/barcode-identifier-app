import React, { useCallback, useEffect, useState } from 'react'
import { usePagination, useSortBy, useTable} from 'react-table'
import { Table } from 'react-bootstrap';
import TablePagination from './table-pagination';
import { FaExternalLinkAlt, FaSearch, FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import SequencePopup from './sequence-popup';
import styles from './db-table.module.css'

const resolveCellContent = (cell, modalShow) => {
    switch (cell.column.id) {
        case 'id':
            return(
                <a className='text-nowrap' target='_blank' rel='noreferrer' onClick={() => modalShow(cell.value)}>
                    <FaSearch />
                </a>
            )
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

    const [ sequenceShown, setSequenceShown] = useState(null);

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
        () => {
            const c = [
            {
                Header: 'Info',
                accessor: 'id',
                description: 'Unique identifier of sequence within this app.'
            },
            {
                Header: 'Accession.Version',
                accessor: 'version',
                description: 'Accession.version of GenBank sequence version.'
            },
            {
                Header: 'Organism',
                accessor: 'organism',
                description: 'Source organism annotated on GenBank.'
            },
            {
                Header: 'Specimen Voucher',
                accessor: 'specimen_voucher',
                description: 'Specimen voucher specified in the sequence features on GenBank.'
            },
            {
                Header: 'Country',
                accessor: 'country',
                description: 'Country of collection specified in the sequence features on GenBank.'
            },
            {
                Header: 'Type',
                accessor: 'type_material',
                description: 'The type material of the voucher specimen (e.g. paratype, holotype, etc.) annotated on GenBank.'
            },
            {
                Header: 'Isolate',
                accessor: 'isolate',
            },
            {
                Header: 'Latitude / Longitude',
                accessor: 'lat_lon',
                description: 'Latitude and longitude of collection site, expressed using decimal degrees and compass direction.'
            },
            {
                Header: 'Modification Date',
                accessor: 'genbank_modification_date',
                description: 'GenBank record modification date, specified at the top of the GenBank flat file.'
            },
            {
                Header: "Kingdom",
                accessor: "taxon_kingdom",
            },
            {
                Header: "Phylum",
                accessor: "taxon_phylum",
            },
            {
                Header: "Class",
                accessor: "taxon_class",
            },
            {
                Header: "Order",
                accessor: "taxon_order",
            },
            {
                Header: "Family",
                accessor: "taxon_family",
            },
            {
                Header: "Genus",
                accessor: "taxon_genus",
            },
            {
                Header: "Species",
                accessor: "taxon_species",
            }
        ]
            return c.map(cc => {
                if (cc.accessor.startsWith('taxon_')) {
                    return {
                        ...cc,
                        sortType: sortTaxaAlphabetically,
                        description: `The ${cc.accessor.slice(6)} of the source organism's lineage, written with the scientific
                        name of the corresponding NCBI taxonomy node. Click links to view taxa in the NCBI Taxonomy Browser.`
                    }
                } else {
                    return cc;
                }
            })
        },
        [sortTaxaAlphabetically]
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
                data: data,
                disableResizing: true,
                initialState: { pageIndex: 0, pageSize: 50, sortBy: [
                    {
                        id: 'version',
                        desc: false
                    }
                ]},
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
            <SequencePopup nuccoreId={sequenceShown} setSequenceShown={setSequenceShown}/>
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
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())} className={styles.details}>
                                                {column.render('Header')}
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <FaSortAlphaUpAlt size={20} />
                                                        : <FaSortAlphaDown size={20} />
                                                    : ''}
                                                    <span>
                                                    {column.description ? column.description : column.Header}
                                                    <br/><br/><em>Click to sort.</em>
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
                                                    {resolveCellContent(cell, setSequenceShown)}
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



