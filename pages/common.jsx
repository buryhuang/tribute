import axios from 'axios';

export default function AboutContent () {
    return (
        <>
            <p>
                Tribute is dedicated to giving due recognition and appreciation to the talented artists whose work has been featured in AIGC arts. Our goal is to ensure that these artists receive the acknowledgement and exposure they deserve, while also providing a comprehensive database for art enthusiasts and creators to discover and engage with their work.
            </p>
            <br/>
            <p>
                As a team, we are passionate about the importance of proper attribution, and we genuinely believe that by honoring the efforts of individual artists, we are fostering a more respectful and enriched artistic community.
            </p>
            <br/>
            <p>
                Through Tribute, we hope to raise awareness about the significance of acknowledging the creative contributions of artists, ultimately making a positive impact on the industry as a whole.
            </p>
            <br/>
            <p>
                We invite you to explore the fantastic creations that are featured in AIGC arts and join us in celebrating the diverse range of exceptional talent that exists within our global community.
            </p>
        </>
    )
}

export function Img({ img, onOpen }) {
    return (
        <div
            className='img-wrapper relative rounded sm:rounded-lg overflow-hidden lg:hover:scale-[102%] transition-transform'
        >
            <img
                src={img?.url}
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
                    onClick={_ => onOpen(img?.url)}
                >Mint</button>
            </div>
        </div>
    )
}

export async function fetchImageInfo(openedImage) {
    try {
        const { data:response } = await axios({
            url: 'https://cdha7r2hmf.execute-api.us-east-1.amazonaws.com/process_image',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': window?.location?.origin || '*',
            },
            data: {
                image_url: openedImage,
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
