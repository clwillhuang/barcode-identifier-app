import React from "react";
import styles from './renderHeadings.module.css'
import { FaLink } from 'react-icons/fa'

// Custom component to render markdown headings as links with IDs. 
// This code was modified from a solution proposed by Eric Egli (@eegli) on GitHub.
// Link to original: https://github.com/remarkjs/react-markdown/issues/358#issuecomment-782917944
const Headings = ({ level, children }) => {
    const heading = children[0];

    // If we have a heading, make it lower case
    let anchor = typeof heading === 'string' ? heading.toLowerCase() : '';

    // Keep alphanumeric characters and replace spaces
    anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '-');

    const renderText = (children) => (
        <a id={anchor} href={`#${anchor}`}>
            <span>{children}</span>
            <FaLink size={20} className={styles.icon}/>
        </a>
    );

    switch (level) {
        case 1:
            return <h1 className={styles.heading}>{renderText(children)}</h1>;
        case 2:
            return <h2 className={styles.heading}>{renderText(children)}</h2>;
        case 3:
            return <h3 className={styles.heading}>{renderText(children)}</h3>;
        case 4:
            return <h4 className={styles.heading}>{renderText(children)}</h4>;
        case 5:
            return <h5 className={styles.heading}>{renderText(children)}</h5>;
        case 6:
            return <h6 className={styles.heading}>{renderText(children)}</h6>;
        default:
            return <h6 className={styles.heading}>{renderText(children)}</h6>;
    }
};

export default Headings;