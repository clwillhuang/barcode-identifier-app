import React from "react"
import { Helmet } from "react-helmet-async"
import { appName, webRoot } from "../url"

const CustomHelmet = ({ title, description, canonical, keywords}) => {
    return (
        <Helmet>
            {/* TODO: Remove noindex on production, and uninstall react-helmet-async if no longer required */}
            <title>{title} | {appName}</title>
            <meta name="robots" content="noindex, nofollow" />
            <meta name='description' content={description}/>
            <meta name='keywords' content={keywords}/>
            <link rel='canonical' href={`${webRoot}/${canonical}`} />
            
            {/* For chartist */}
            <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css"/>
            <script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
        </Helmet>
    )
}

CustomHelmet.defaultProps = {
    title: appName,
    description: 'Browse and utilize a barcode reference library for Neotropical electric fishes.',
    canonical: '',
    keywords: 'fish, barcode, Gymnotiformes',
}

export default CustomHelmet;