import Head from "next/head";

export default function usePageTitle(title = '', isSiteNameHidden = false) {
    const siteName = !isSiteNameHidden ? process.env.NEXT_PUBLIC_APP_NAME : '';
    const siteTitle = title.trim() !== '' ? `${(!isSiteNameHidden ? ' | ' : '')} ${title}` : ''

    return (
        <Head>
            <title>{siteName + siteTitle}</title>
        </Head>
    )
}