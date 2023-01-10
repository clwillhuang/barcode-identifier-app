import React from "react";
import CustomHelmet from "../components/custom-helmet";
import Wrapper from "../components/wrapper";

const Credits = () => {
    // citedate of nucleotide databases in YYYY Mmm DD
    const citeDate = "2021 Dec 19"
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
                <pre>
                Janzen, F. H., Crampton, W. G., & Lovejoy, N. R. (2022). A new taxonomist-curated reference library of DNA barcodes for Neotropical electric fish (Teleostei: Gymnotiformes). Zoological Journal of the Linnean Society.
                </pre>
                <p>
                    This web application, and the server on which it relies, was developed by Cheng Liang (William) Huang under the supervision of Nathan Lovejoy at the University of Toronto Scarborough. This web service was initially explored as a local standalone Tkinter application written by a past lab student, before the present software was developed for web.
                </p>
                <h5>Barcode Data</h5>
                <p>Nucleotide and organism information used to compile the database(s) were retrieved from GenBank database (1) at the National Library of Medicine.</p>
                <pre>
                    Nucleotide [Internet]. Bethesda (MD): National Library of Medicine (US), National Center for Biotechnology Information; [1988] - [cited {citeDate}]. Available from: https://www.ncbi.nlm.nih.gov/nucleotide/
                </pre>
                <pre>
                    GenBank [Internet]. Bethesda (MD): National Library of Medicine (US), National Center for Biotechnology Information; [1982] - [cited {citeDate}]. Available from: https://www.ncbi.nlm.nih.gov/nucleotide/
                </pre>
                <pre>
                    (1) Clark K, Karsch-Mizrachi I, Lipman DJ, Ostell J, Sayers EW.
                    GenBank. Nucleic Acids Res. 44(D1):D67-72 (2016)
                </pre>
                <p>
                    Sequences included in the database(s) were amalgamated from several different publications:
                </p>
                <pre className="text-danger">TODO: CITE ALL PAPERS</pre>
                <h5>Software</h5>
                <p>
                    Integral to this website is the NCBI Basic Local Alignment Search Tool for Nucleotides (1, 2) provided by the <a href='https://www.ncbi.nlm.nih.gov/'>National Center of Biotechnology Information.</a>
                </p>
                <pre>
                    (1) Zheng Zhang, Scott Schwartz, Lukas Wagner, and Webb Miller (2000), "A greedy algorithm for aligning DNA sequences", J Comput Biol 2000; 7(1-2):203-14.
                </pre>
                <pre>
                    (2) Aleksandr Morgulis, George Coulouris, Yan Raytselis, Thomas L. Madden, Richa Agarwala, Alejandro A. Schäffer (2008), "Database Indexing for Production MegaBLAST Searches", Bioinformatics 24:1757-1764.
                </pre>
                <p>Additionally, the following Python package(s) were used to perform data parsing and analysis:</p>
                <pre>
                    Cock, P.J.A. et al. Biopython: freely available Python tools for computational molecular biology and bioinformatics. Bioinformatics 2009 Jun 1; 25(11) 1422-3 https://doi.org/10.1093/bioinformatics/btp163 pmid:19304878
                </pre>
            </div>
        </Wrapper>
    )
}

export default Credits;