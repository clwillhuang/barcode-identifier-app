import React from "react";
import { appName } from "../url";
import styles from "./footer.module.css";

const Footer = () => {
    // Define the pages array with the names and links of your pages
    const pages = [
        { name: "Home", link: "/" },
        { name: "Database", link: "/about" },
        { name: "Run", link: "/blast" },
        { name: "Manual", link: "/manual" },
        { name: "About", link: "/credits" },
        { name: "API", link: "/api-docs"}
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h1 className={styles.title}>{appName}</h1>
                </div>
                <div className={styles.right}>
                    <ul className={styles.pages}>
                        {pages.map((page) => (
                            <li key={page.name}>
                                <a href={page.link}>{page.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>©2023 Lovejoy Lab at the University of Toronto. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;