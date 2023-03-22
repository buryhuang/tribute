import { htmlToString } from "@helpers/utils";
import Head from "next/head";
import PropTypes from "prop-types";

export default function Metadata({ title, description, keywords }) {
    return (
        <Head>
            <meta name="author" content={process.env.NEXT_PUBLIC_APP_NAME} />
            <meta name="description" content={htmlToString(description) || title} />
            <meta name="keywords" content={`${keywords}`} />
            <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
            <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
            <meta property="og:description" content={htmlToString(description) || title} />
            <meta property="og:site_name" content={`${process.env.NEXT_PUBLIC_APP_NAME} | ${title}`} />
            <meta property="twitter:card" content={`${process.env.NEXT_PUBLIC_APP_NAME} | ${title}`} />
            <meta property="twitter:description" content={htmlToString(description) || title} />
        </Head>
    )
}

// Props validations
Metadata.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
}
Metadata.defaultProps = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: '',
    keywords: '',
}