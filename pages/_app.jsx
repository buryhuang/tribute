import { useEffect, useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import '/styles/globals.css';
import 'nprogress/nprogress.css';
import '/styles/app.scss';
import { ThemeProvider } from '@providers/ThemeProvider';

// NProgress config
NProgress.configure({
	showSpinner: false,
});

// Loading state
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Application({ Component, pageProps }) {
	const [isPageLoading, setPageLoadingStatus] = useState(true);

	useEffect(() => {

		// Site loader
        setTimeout(() => {
            setPageLoadingStatus(false);
        }, 500);

		// Register serviceWorker
		if("serviceWorker" in navigator) {
			window.addEventListener("load", function () {
				navigator.serviceWorker
					.register("/sw.js")
					.then(serviceWorker => {})
					.catch(err => console.log(`Service Worker registration failed: ${err}`));
			});
		}
    }, []);

	return (
		<>
			{/* Heads */}
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
			</Head>

			{/* Body */}
			<ThemeProvider>

				{/* Page Loader */}
				{
					isPageLoading
					? <div className="fixed inset-0 z-[100] bg-gray-100 dark:bg-[#010911] transition flex flex-row justify-center items-center"></div>
					: null
				}

				<Component {...pageProps} />
			</ThemeProvider>
		</>
	)
}
