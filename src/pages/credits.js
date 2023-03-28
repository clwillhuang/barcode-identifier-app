import React from "react";
import CustomHelmet from "../components/custom-helmet";
import Wrapper from "../components/wrapper";
import '../index.css'

const Credits = () => {
    // citedate of nucleotide databases in YYYY Mmm DD
    const citeDate = "2021 Dec 19"

    let citationNumber = 1;
    const getCitationNumber = (elementsToAdd) => {
        citationNumber += elementsToAdd;
        return citationNumber - elementsToAdd;
    }

    return (
        <Wrapper>
            <CustomHelmet
                title='Credits and Acknowledgements'
                description='Citations and references to the parties involved in making this website possible.'
                canonical='credits'
            />
            <div>
                <h2>Credits</h2>
                <p className="text-danger my-3">
                    This site, including this page, is still a work in progress. Hence, citations may be inconsistent and attributions inaccurate.
                </p>
                <h5>Project Motivation</h5>
                <p>The Barcode Identifier Web App makes available a reference library of approximately 167 barcodes of Neotropical electric knifefish (order: Gymnotiformes) species first compiled by Janzen, Crampton and Lovejoy 2022.
                </p>
                <ol start={getCitationNumber(1)}>
                    <li>
                        <pre>
                            Janzen, F. H., Crampton, W. G., & Lovejoy, N. R. (2022). A new taxonomist-curated reference library of DNA barcodes for Neotropical electric fish (Teleostei: Gymnotiformes). <em>Zoological Journal of the Linnean Society.</em>
                        </pre>
                    </li>
                </ol>
                <p>
                    This web application, and the server on which it relies, was developed by Cheng Liang (William) Huang under the supervision of Nathan Lovejoy at the University of Toronto Scarborough. This web service was initially explored as a local standalone Tkinter application written by a past lab student, before the present software was developed for web.
                </p>
                <h5>Barcode Data</h5>
                <p>Nucleotide and organism information used to compile the database(s) were retrieved from GenBank database at the National Library of Medicine.</p>
                <ol start={getCitationNumber(3)}>
                    <li>
                        <pre>
                            Nucleotide [Internet]. Bethesda (MD): National Library of Medicine (US), National Center for Biotechnology Information; [1988] - [cited {citeDate}]. Available from: <a href="https://www.ncbi.nlm.nih.gov/nucleotide/">Available from: https://www.ncbi.nlm.nih.gov/nucleotide/</a>
                        </pre>
                    </li>
                    <li>
                        <pre>
                            GenBank [Internet]. Bethesda (MD): National Library of Medicine (US), National Center for Biotechnology Information; [1982] - [cited {citeDate}]. <a href="https://www.ncbi.nlm.nih.gov/nucleotide/">Available from: https://www.ncbi.nlm.nih.gov/nucleotide/</a>
                        </pre>
                    </li>
                    <li>
                        <pre>
                            Clark K, Karsch-Mizrachi I, Lipman DJ, Ostell J, Sayers EW.
                            GenBank. <em>Nucleic Acids Res,</em> 44(D1):D67-72 (2016)
                        </pre>
                    </li>
                </ol>
                <p>
                    Sequences included in the database(s) were amalgamated from several different publications:
                </p>
                <pre className="text-danger">TODO: CITE ALL PAPERS</pre>
                <h5>Software</h5>
                <p>
                    Our workflow includes the use of NCBI Basic Local Alignment Search Tool (BLAST) for Nucleotides provided by the <a href='https://www.ncbi.nlm.nih.gov/'>National Center of Biotechnology Information.</a>
                </p>
                <ol start={getCitationNumber(2)}>
                    <li>
                        <pre>
                            Zhang, Z., Schwartz, S., Wagner, L., & Miller, W. (2000). A greedy algorithm for aligning DNA sequences. <em>Journal of Computational biology</em>, 7(1-2), 203-214.
                        </pre>
                    </li>
                    <li>
                        <pre>
                            Morgulis, A., Coulouris, G., Raytselis, Y., Madden, T. L., Agarwala, R., & Schäffer, A. A. (2008). Database indexing for production MegaBLAST searches. <em>Bioinformatics</em>, 24(16), 1757-1764.
                        </pre>
                    </li>
                </ol>
                <p>The workflow also performs multiple sequence alignment by submitting to the <a href='https://www.ebi.ac.uk/Tools/msa/clustalo/'>ClustalOmega web service provided by EMBL-EBI.</a></p>
                <ol start={getCitationNumber(2)}>
                    <li>
                        <pre>
                            Sievers, F., Wilm, A., Dineen, D., Gibson, T. J., Karplus, K., Li, W., ... & Higgins, D. G. (2011). Fast, scalable generation of high‐quality protein multiple sequence alignments using Clustal Omega. <em>Molecular systems biology</em>, 7(1), 539.
                        </pre>
                    </li>
                    <li>
                        <pre>
                            Madeira, F., Pearce, M., Tivey, A. R., Basutkar, P., Lee, J., Edbali, O., ... & Lopez, R. (2022). Search and sequence analysis tools services from EMBL-EBI in 2022. <em>Nucleic Acids Res</em>, 50(W1), W276-W279.
                        </pre>
                    </li>
                </ol>
                <p>Additionally, the following Python package(s) were used to perform data parsing and analysis:</p>
                <ol start={getCitationNumber(1)}>
                    <li>
                        <pre>
                            Cock, P. J., Antao, T., Chang, J. T., Chapman, B. A., Cox, C. J., Dalke, A., ... & De Hoon, M. J. (2009). Biopython: freely available Python tools for computational molecular biology and bioinformatics. <em>Bioinformatics</em>, 25(11), 1422-1423.
                        </pre>
                    </li>
                </ol>
                <h5>Image Attribution</h5>
                <p>Homepage image is by <a href="https://unsplash.com/@wawa01?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Waren Brasse</a> on <a href="https://unsplash.com/photos/IzCUWUi_j8I?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                </p>
            </div>
        </Wrapper>
    )
}

export default Credits;