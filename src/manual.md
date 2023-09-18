# Manual

## Introduction

This website provides an automated software workflow that compares DNA sequences against curated DNA reference libraries derived from mined GenBank data. It does so by running BLAST and optionally performing a multiple sequence alignment (using ClustalOmega at EMBL-EBI) to construct neighbor-joining trees, all in one single job submission. Simply provide a nucleotide sequence, select your settings and submit.  

## Input

### Sequences

Multiple sequences are supported for single job. There are two options to supply the input sequences, referred to as "query sequences".

1.  As raw FASTA text pasted into the textbox. This text will be parsed with Biopython using the `fasta` file format. Example:

    ```
    >Steatogenys_elegans_sample isolate 8807 cytochrome c oxidase subunit I (COI) gene, partial cds; mitochondrial
    GGCACCCTTTATATAGTGTTTGGTGCCTGAGCCGGAATGGTTGGCACGGCCTTAAGCCTCCTTATTCGAG
    CCGAGCTAAGCCAACCCGGGGCCCTAATGGGTGATGACCAGATTTACAATGTTATTGTTACCGCCCATGC
    CTTCGTTATAATTTTCTTTATAGTAATACCTATTATAATTGGCGGC
    >Adontosternarchus_devenanzii isolate 11011 cytochrome c oxidase subunit I (COX1) gene, partial cds; mitochondrial
    GTACTGCTCTTAGCCTCTTGATTCGAGCAGAGCTCAACC
    AACCAGGCACCCTCTTAGAAGACGACCAAATCTACAACGTAGCCGTTACCGCCCATGCCTTCGTAATAAT
    ```

    If no description line (indicated by the ">" (carat) character) is supplied or no records could be parsed for any another reason, then the entire text is concatenated into a single record by removing whitespace between lines and setting the description line to `query_sequence`. Example:
    ```
    GGCACCCTTTATATAGTGTTTGGTGCCTGA
    GCCGGAATGGTTGG
    CACGGCCTTAAGCCTCCTTAT
    TCGAG
    ```
    will become
    ```
    >query_sequence
    GGCACCCTTTATATAGTGTTTGGTGCCTGAGCCGGAATGGTTGGCACGGCCTTAAGCCTCCTTATTCGAG
    ```


2. As a text file uploaded containing sequences as formatted above. The file will be parsed with Biopython using the `fasta` file format.

Each query sequences will be identified by their SeqID (sequence identifier) found directly after the `>`. It cannot contain spaces, but can contain alphanumeric characters (A-Z, a-z, 0-9) as well as the following special characters: `-_.:*#`. Only the SeqID will be used to identify the query sequence in BLAST, multiple alignment, and tree output data.

### Nucleotide BLAST Parameters
Presently, users can only select the database against which to BLAST, but cannot configure the parameters used to run BLAST. BLAST is run with the command line arguments `-outfmt 7`, `-query` and `-db`, which supply input and determine output. 

#### Blast Database

This refers to the curated set of nucleotide accessions used to form the search set of the BLAST query. There is presently only a single database available. Each database has a human-readable name, but it is programmatically referred to by its Universal Unique Identifier (UUID).Example: `ae47cd0a-b7b7-4dfe-9223-8e026d2980c5`.

### Multiple Alignment and Tree Parameters

"Create hit tree": If enabled, a multiple sequence alignment job will be run with ClustalOmega (hosted at EMBL-EBI) with default parameters using a sequence set made from all the query sequences and all their hits from the BLASTN query.

"Create database tree": If enabled, a multiple sequence alignment job will be run with ClustalOmega (hosted at EMBL-EBI) with default parameters using a sequence set made from all the query sequences and all the sequences in the database.

### Job Name

This is an optional text field that can be added to descriptively name the job. It will appear on results webpages but will not appear in the output files with the exception of a comment in the BLASTN text output.

## Output

### Hits

The BLASTN run will return a set of hits for each query sequence supplied. This is displayed in a table with the following columns:
-   Percent Identity, Alignment Length, Evalue, Bit Score: As computed by BLAST
-   Query Definition: The description line corresponding to which of the query sequences the hit is for.
-   Organism, Country, Specimen Voucher, Type (info about holotype or paratype), Latitude/Longitude: As mined from GenBank, and visible on the database information page.

### Multiple Alignments and Trees

The number of alignments performed will depend the multiple [alignment options selected](#multiple-alignment-and-tree-parameters).

For *each* tree there are three downloadable files, each directly obtained from the job ran on ClustalOmega at EMBL-EBI and unaltered:
-   Alignment file: A `.clustal_num` file containing  an alignment with nucleotides numbered.
-   Phylogenetic tree: `.ph` file containing the phylogenetic tree in Newick (Phylip) format.
-   Sequences: A `.txt` file containing the sequences submitted to perform the multiple sequence alignment, in FASTA format.

In all three files, the sequence identifiers of query sequences will be altered by appending `|query` at the end to denote these as query sequences. All non-query sequences (i.e. sequences from the database, such as hits) will have sequence identifiers in the format of `<accession_number>|<organism_name>`, where organism name is generally `<genus>_<species>`.

More information and additional examples of these files are available in the [documentation for ClustalOmega at EMBL-EBI](https://www.ebi.ac.uk/seqdb/confluence/display/JDSAT/Clustal+Omega+Help+and+Documentation).

### Job Information and Parameters

#### Unique Run Identifier
Universal Unique Identifier (UUID) used to identify the run. This ID is needed to obtain the run's results! If you want to revisit the results page, bookmark the page or save this ID. This ID is not easily recoverable otherwise.

#### Run Job Name
Job name specified in input.

#### Query Input
The number of sequence records identified when parsing your input. These sequences can be downloaded as a single FASTA file.

#### Server Log
The server log shows timestamps of when the job:
-   was received by the server and put in the job queue
-   passed through the queue and started running
-   finished running, if it was successful
-   terminated due to an unexpected error, if it was unsuccessful

## Example Run

The following section shows the input and output of an example run. 

**Note:** Portions of the input and output text have been shrunk down to provide succinct examples while keeping the general text formats clear. The ellipses (`...`) indicate where text has been removed. 

### Example Input
Job name: Example input and output

```
>Adontosternarchus_devenanzii
ATAGTGTTTGGCGCCTGAGCCGGTATAATTGGTACTGCTCTTAGCCTCTTGATTCGAGCAGAGCTCAACC
AACCAGGCACCCTCTTAGAAGACGACCAAATCTACAACGTAGCCGTTACCGCCCATGCCTTCGTAATAAT
TTTCTTTATAGTTATGCCAATCATAATTGGAGGCTTTGGCAACTGACTTATTCCCCTAATAATT
>Steatogenys_elegans isolate 8807 cytochrome c oxidase subunit I (COI) gene, partial cds; mitochondrial
GGCACCCTTTATATAGTGTTTGGTGCCTGAGCCGGAATGGTTGGCACGGCCTTAAGCCTCCTTATTCGAG
CCGAGCTAAGCCAACCCGGGGCCCTAATGGGTGATGACCAGATTTACAATGTTA
```

