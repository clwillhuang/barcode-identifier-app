import React from "react";
import CustomHelmet from "../components/custom-helmet";
import Wrapper from "../components/wrapper";
import '../index.css'

export default () => {
    return (
        <Wrapper>
            <CustomHelmet
                title='Manual and Documentation'
                description='Citations and references to the parties involved in making this website possible.'
                canonical='credits'
            />
            <div>
                <h2>Manual</h2>
                <p className="text-danger my-3">
                    This site, including this page, is still a work in progress. Manual is incomplete.
                </p>
                <h3>Introduction</h3>
                <p>
                    This website provides an automated software workflow that compares DNA sequences against curated DNA reference libraries derived from mined GenBank data. It does so by running BLAST and performing a multiple sequence alignment with ClustalOmega at EMBL-EBI to construct neighbor-joining trees, all in one single job submission. Simply provide a nucleotide sequence, select your settings and submit. 
                </p>
                <h3>
                    Input
                </h3>
                <h4>Sequence Input</h4>
                <p>Multiple sequences are supported for single job. There are two options to supply the input sequences, referred to as "query sequences".</p>
                <ol>
                    <li>
                        <p>File upload of a text file with FASTA-formatted sequences. The file will be parsed with Biopython using the <code>"fasta"</code> file format.</p>
                    </li>
                    <li>
                        <p>Raw text string pasted into the textbox. This text will be parsed the same way as the file upload described above. If no description line (indicated by the {'">"'} (carat) character) is supplied or no records could be parsed for any another reason, then the entire text is concatenated into a single record by removing whitespace between lines and setting the description line to "query_sequence".</p>
                    </li>
                </ol>
                <p>Each query sequences will be identified by their SeqID (sequence identifier) found directly after the {'">"'}. It cannot contain spaces, but can contain alphanumeric characters (A-Z, a-z, 0-9) as well as the following special characters: <code>-_.:*#</code>. Only the SeqID will be used to identify the query sequence in BLAST, multiple alignment, and tree output data.</p>
                <h4>
                    Nucleotide BLAST Parameters
                </h4>
                <p>
                    Presently, users can only select the database against which to BLAST, but cannot configure the parameters used to run BLAST. BLAST is run with the command line arguments <code>-outfmt 7</code>, <code>-query</code> and <code>-db</code>, which supply input and determine output. 
                </p>
                <h5>
                    Blast Database
                </h5>
                <p>
                    This refers to the curated set of nucleotide accessions used to form the search set of the BLAST query. There is presently only a single database available. Each database has a human-readable name, but it is programmatically referred to by its Universal Unique Identifier (UUID).
                </p>
                <p>
                    Example: <pre>ae47cd0a-b7b7-4dfe-9223-8e026d2980c5</pre>
                </p>
                <h4>
                    Multiple Alignment Parameters
                </h4>
                <h5>
                    Create hit tree
                </h5>
                <p>If enabled, a multiple sequence alignment job will be run with ClustalOmega hosted at EMBL-EBI using a sequence set made from all the query sequences and all their hits from the blastn query.</p>
                <h5>
                    Create database tree
                </h5>
                <p>If enabled, a multiple sequence alignment job will be run with ClustalOmega hosted at EMBL-EBI using a sequence set made from all the query sequences and all the sequences in the database.</p>
                <h4>
                    Job name
                </h4>
                <p>This is an optional text field that can be added to descriptively name the job. It will appear on results pages, but will not appear in the output files, aside from the blastn text output.</p>
                <h3>
                    Output
                </h3>
                <h4>Hits</h4>
                <p>The blastn run will return a set of hits for each query sequence supplied. This is displayed in a table with the following columns:</p>
                <ul>
                    <li>
                        Percent Identity, Alignment Length, Evalue, Bit Score: As computed by BLAST
                    </li>
                    <li>
                        Query Definition: The description line corresponding to which of the query sequences the hit is for.
                    </li>
                    <li>
                        Organism, Country, Specimen Voucher, Type (info about holotype or paratype), Evalue, Bit Score, Latitude/Longitude: As mined from GenBank, and visible on the database information page.
                    </li>
                </ul>
                <h4>Multiple Alignments and Trees</h4>
                <p>
                    Depending on 
                </p>
                <h4>Downloadable Multiple Sequence Alignment (MSA)</h4>
                <p>
                    This is an unaltered *.aln-clustal_num.clustal_num alignment file directly obtained from ClustalOmega at EMBL-EBI. It contains an alignment with nucleotides numbered.
                </p>
                <h4>Downloadable tree</h4>
                <p>
                    This is an unaltered *.phylotree.ph* file containing the 
                </p>
                <h4>
                    Job Information
                </h4>
                <h5>
                    Unique Run Identifier
                </h5>
                <p>
                    Universal Unique Identifier (UUID) used to identify the run. This ID is needed to obtain the run's results! If you want to revisit the results page, bookmark the page or save this ID. This ID is not easily recoverable otherwise.
                </p>
                <h4>Job Name</h4>
                <p>
                    The job name given when the run was started.
                </p>
                <h4>Query Input</h4>
                <p>
                    The results page shows the number of sequence records identified when parsing your input. These sequences can be downloaded as a single FASTA file.
                </p>
                <h4>Server Log</h4>
                <p>
                    Shows a record of when your job:
                    <ul>
                        <li>was received by the server and put in the job queue</li>
                        <li>passed through the queue and started to be run</li>
                        <li>finished running, if it was successful</li>
                        <li>encountered an unexpected error and had to abort, if it was unsuccessful</li>
                    </ul>
                </p>
                
            </div>
        </Wrapper>
    )
}