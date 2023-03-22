import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en-US">
			<Head>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL}/>

				{/* Prefetch for faster font loading */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
				<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
				<link rel="dns-prefetch" href="https://fonts.gstatic.com" crossOrigin="true" />

				{/* Metadata */}
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="msapplication-starturl" content="/" />
				<meta name="theme-color" content="#27272a" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />

				{/* Static SEO Metadata */}
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/vercel.svg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:creator" content="@sbiswas1805" />

				{/* PWA Config */}
				{/* <link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120-precomposed.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152-precomposed.png" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-640-x-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-750-x-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-1125-x-2436.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-1242-x-2208.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-1536-x-2048.jpg" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-1668-x-2224.jpg" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" />
				<link rel="apple-touch-startup-image" href="/splash-screens/splash-screen-2048-x-2732.jpg" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" /> */}
			</Head>

			<body className="bg-gray-50 dark:bg-[#010911] antialiased custom-scroll">
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}