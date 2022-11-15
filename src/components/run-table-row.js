import { urlRoot } from '../url'

const makeRow = ({ row }) => {  
    return <tr {...row.getRowProps()}>
        {
            row.cells.map(cell => {
                if (cell.column.id === 'evalue' || cell.column.id === 'bit_score') {
                    return (
                        <td {...cell.getCellProps()}>
                            {Number(cell.value)}
                        </td>
                    );
                } else if (cell.column.id === 'subject_accession_version') {
                    // TODO: Add external link icon
                    return (<td {...cell.getCellProps()}>
                        <a target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/nuccore/${cell.value}`}>
                            <code>{cell.value}</code>
                        </a>
                    </td>);
                }
                else
                    return (
                        <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                        </td>
                    );
            }
            )
        }
    </tr>
}

export default makeRow;