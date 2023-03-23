import { useState } from 'react';
import Metadata from '@comps/Metadata';
import Head from 'next/head';
import Link from 'next/link';
import { Configuration, OpenAIApi } from "openai";
import Modal from '@comps/Modal';

const openAiConfig = new Configuration({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfig);

export default function Home() {

	const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

	return (
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>

			{/* Metatags */}
			<Metadata title={process.env.NEXT_PUBLIC_APP_NAME} />

			{/* Body */}
			<Header
				openAboutModal={_ => setIsAboutModalVisible(true)}
			/>

			<Body />

			<Modal
				isVisible={isAboutModalVisible}
				isCloseable={true}
				title={`About ${process.env.NEXT_PUBLIC_APP_NAME}`}
				maxWidth='sm:max-w-screen-md'
				onClose={_ => setIsAboutModalVisible(false)}
			>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione enim qui obcaecati omnis nulla aliquam id voluptatem quisquam doloremque natus, adipisci saepe debitis numquam perspiciatis harum? Quo consequatur ducimus accusantium!</p>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione enim qui obcaecati omnis nulla aliquam id voluptatem quisquam doloremque natus, adipisci saepe debitis numquam perspiciatis harum? Quo consequatur ducimus accusantium!</p>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione enim qui obcaecati omnis nulla aliquam id voluptatem quisquam doloremque natus, adipisci saepe debitis numquam perspiciatis harum? Quo consequatur ducimus accusantium!</p>
			</Modal>
		</>
	);
}

function Header({ openAboutModal }) {
	return (
		<header className='max-w-screen-lg w-full mx-auto relative px-2 sm:px-4 py-2 sm:py-4 text-gray-800 dark:text-white'>

			<div className='flex flex-row justify-between items-center'>
				<Link
					href='/'
					className='font-primary text-lg font-bold'
				>{process.env.NEXT_PUBLIC_APP_NAME}</Link>

				<button
					type='button'
					className='font-primary font-semibold'
					onClick={openAboutModal}
				>About</button>
			</div>
		</header>
	)
}

function Body() {
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState([]);

	const handleSearch = async (event) => {
		event.preventDefault();

		if(search.trim() === '') return;

		setIsLoading(true);
		const response = await openai.createImage({
			prompt: search,
			n: 6,
			size: "1024x1024",
		});

		console.log(response.data);
		setResult(response.data);
		setIsLoading(false);
	}

	return (
		<main className='max-w-screen-lg mx-auto px-2 sm:px-4 py-6 sm:py-20'>

			{/* Form */}
			<form
				action='/'
				method='post'
				className='form'
				onSubmit={handleSearch}
			>
				<input
					type="text"
					placeholder='Describe the amazing story that you have in your mind right now'
					autoComplete='off'
					className='search-bar'
					defaultValue={search}
					onChange={({ target }) => setSearch(target.value)}
				/>

				<button
					type='submit'
					className='search-btn'
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
					</svg>
				</button>
			</form>

			{/* Result */}
			{
				isLoading
				? <div className='mx-auto text-center flex flex-col gap-y-2 justify-center items-center'>
					<svg xmlns="http://www.w3.org/2000/svg" className='m-0 bg-transparent block w-20 h-20 mx-auto mt-4 sm:mt-8' viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
						<rect x="19" y="19" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="discrete"></animate>
						</rect><rect x="40" y="19" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.125s" calcMode="discrete"></animate>
						</rect><rect x="61" y="19" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.25s" calcMode="discrete"></animate>
						</rect><rect x="19" y="40" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.875s" calcMode="discrete"></animate>
						</rect><rect x="61" y="40" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.375s" calcMode="discrete"></animate>
						</rect><rect x="19" y="61" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"></animate>
						</rect><rect x="40" y="61" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.625s" calcMode="discrete"></animate>
						</rect><rect x="61" y="61" width="12" height="12" fill="#84cc16">
							<animate attributeName="fill" values="#4d7c0f;#84cc16;#84cc16" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.5s" calcMode="discrete"></animate>
						</rect>
					</svg>
					<h1 className='text-dark-800 dark:text-white font-semibold font-primary'>Kindly hold on for a moment while we bring your imaginative story to life...</h1>
				</div>
				: result && result.data && result.data.length
					? <div className='mt-4 sm:mt-8 max-w-screen-lg w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4'>
						{
							result?.data?.map((img, index) => <Img key={index} src={img?.url} />)
						}
					</div>
					: null
			}

		</main>
	)
}

function Img({ src }) {
	return (
		<div
			className='img-wrapper relative rounded sm:rounded-lg overflow-hidden lg:hover:scale-[102%] transition-transform'
		>
			<img
				src={src}
				alt=''
				width={100}
				height={100}
				loading='lazy'
				className='w-full aspect-square object-cover pointer-events-none'
			/>

			<div className='absolute -inset-2 bg-black bg-opacity-20 backdrop-blur-[1px] flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity'>
				<button
					type='button'
					className='bg-primary-600 lg:hover:bg-primary-700 lg:active:bg-primary-800 text-white text-lg font-semibold px-6 py-2 rounded-lg transition-colors shadow'
				>Mint</button>
			</div>
		</div>
	)
}