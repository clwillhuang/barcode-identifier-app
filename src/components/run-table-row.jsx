import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa'

// Value for sequence.data_source based on where sequence originated from
const DATA_SOURCE_GENBANK = 'GB';
// const DATA_SOURCE_IMPORT = 'IM';

const resolveCellContents = (cell, modalShow) => {
    switch (cell.column.id) {
        case 'evalue':
        case 'bit_score':
            return (Number(cell.value));
        case 'subject_accession_version':
            if (cell.row.original.db_entry.data_source === DATA_SOURCE_GENBANK) {
                return (
                    <a className='text-nowrap' target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                        <code>{cell.value}</code>
                        <FaExternalLinkAlt />
                    </a>
                );
            } else {
                return (<code>{cell.value}</code>)
            }
        case 'db_entry.id':
            return(
                <button className='text-nowrap' target='_blank' rel='noreferrer' onClick={() => modalShow(cell.value)}>
                    <FaSearch />
                </button>
            )
        case 'db_entry.lat_lon':
            return (
                cell.value 
                    &&
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`http://maps.google.com/maps?q=${cell.value}`}>
                    <code>{cell.value}</code>
                    <FaExternalLinkAlt />
                </a>
            )
        default:
            return (cell.render('Cell'));
    }
}

const makeRow = ({ row, setSequenceShown }) => {
    return <tr {...row.getRowProps()}>
        {
            row.cells.map(cell =>
                <td className='text-nowrap' {...cell.getCellProps()}>
                    {resolveCellContents(cell, setSequenceShown)}
                </td>
            )
        }
    </tr>
}

export default makeRow;