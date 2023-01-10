import { BsBoxArrowUpRight } from 'react-icons/bs'

const resolveCellContents = (cell) => {
    switch (cell.column.id) {
        case 'evalue':
        case 'bit_score':
            return (Number(cell.value));
        case 'subject_accession_version':
            return (
                <a className='text-nowrap' target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                    <code>{cell.value}</code>
                    <BsBoxArrowUpRight />
                </a>
            );
        case 'db_entry.lat_lon':
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

const makeRow = ({ row }) => {
    return <tr {...row.getRowProps()}>
        {
            row.cells.map(cell =>
                <td className='text-nowrap' {...cell.getCellProps()}>
                    {resolveCellContents(cell)}
                </td>
            )
        }
    </tr>
}

export default makeRow;