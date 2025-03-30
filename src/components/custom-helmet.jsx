import React from "react"
import { Helmet } from "react-helmet-async"
import { appName, webRoot } from "../url"

const CustomHelmet = ({ title, description, canonical, keywords, useChartist, usePhylotree }) => {
    return (
        <Helmet>
            {/* TODO: Remove noindex on production, and uninstall react-helmet-async if no longer required */}
            <title>{title} | {appName}</title>
            <meta name="robots" content="noindex, nofollow" />
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <link rel='canonical' href={`${webRoot}/${canonical}`} />

            {/* For chartist */}
            {
                useChartist && <>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css" />
                    <script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
                </>
            }

            {/* For phylotree */}
            {
                usePhylotree &&
                <link rel='stylesheet' href='https://unpkg.com/phylotree@1.0.0-alpha.24/dist/phylotree.css' />
            }
        </Helmet>
    )
}

CustomHelmet.defaultProps = {
    title: 'Welcome',
    description: 'Browse and utilize a barcode reference library for Neotropical electric fishes.',
    canonical: '',
    keywords: 'fish, barcode, Gymnotiformes',
    useChartist: false,
    usePhylotree: false
}

export default CustomHelmet;