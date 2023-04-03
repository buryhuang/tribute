import { useEffect, useState } from "react";
import Metadata from "@comps/Metadata";
import Head from "next/head";
import Link from "next/link";
import { Configuration, OpenAIApi } from "openai";
import Modal from "@comps/Modal";
import AboutContent, { fetchImageInfo, Img, Spinner } from "./common";

const openAiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfig);

export default function Home() {
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      {/* Metatags */}
      <Metadata title={process.env.NEXT_PUBLIC_APP_NAME} />

      {/* Body */}
      <Header openAboutModal={(_) => setIsAboutModalVisible(true)} />

      <Body />

      <Modal
        isVisible={isAboutModalVisible}
        isCloseable={true}
        title={`About ${process.env.NEXT_PUBLIC_APP_NAME}`}
        maxWidth="sm:max-w-screen-md"
        onClose={(_) => setIsAboutModalVisible(false)}
      >
        <AboutContent />
      </Modal>

      {/* Footer */}
      <footer className="max-w-screen-lg w-full mx-auto px-2 sm:px-4 py-2 sm:py-4 text-gray-800 dark:text-white absolute bottom-0">
        <p className="text-center">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Header({ openAboutModal }) {
  return (
    <header className="max-w-screen-lg w-full mx-auto relative px-2 sm:px-4 py-2 sm:py-4 text-gray-800 dark:text-white">
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="font-primary text-lg font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>

        <button
          type="button"
          className="font-primary font-semibold"
          onClick={openAboutModal}
        >
          About
        </button>
      </div>
    </header>
  );
}

function Body() {
  const [imageUrl, setImageUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [openedImage, setOpenedImage] = useState("");
  const [imageInfo, setImageInfo] = useState([]);

  useEffect(() => {
    if (openedImage === "") return;

    setIsLoading(true);

    fetchImageInfo(openedImage).then((data) => {
      setImageInfo(data);
    });

    setIsLoading(false);
  }, [openedImage]);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (searchText.trim() === "" && imageUrl.trim() === "") return;

    setIsLoading(true);
    if (searchText.trim()) {
      const response = await openai.createImage({
        prompt: searchText,
        n: 4,
        size: "512x512",
      });

      setResult(response.data);
    } else if (imageUrl.trim()) {
      setResult({ data: [{ url: imageUrl }] });
    }
    setIsLoading(false);
  };

  const handleInputChange = (event) => {
    const input = event.target.value;

    // check if input is a valid URL
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (urlRegex.test(input)) {
      setImageUrl(input);
      setSearchText("");
    } else {
      setSearchText(input);
      setImageUrl("");
    }
  };

  return (
    <main className="max-w-screen-lg mx-auto px-2 sm:px-4 py-6 sm:py-20">
      {/* Form */}
      <form
        action="/"
        method="post"
        className="form"
        onSubmit={handleSearch}
        style={{ width: "33vw" }}
      >
        <input
          type="text"
          placeholder="Enter a prompt, keywords, or an image URL"
          autoComplete="off"
          className="search-bar"
          onChange={(event) => handleInputChange(event)}
        />

        <button type="submit" className="search-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </form>

      {/* Result */}
      {isLoading ? (
        <Spinner
          text={
            "Kindly hold on for a moment while we bring your imaginative story to life..."
          }
        />
      ) : result && result.data && result.data.length ? (
        <div className="mt-4 sm:mt-8 max-w-screen-lg w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {result?.data?.map((img, index) => (
            <Img
              key={index}
              img={img}
              onOpen={(src) => {
                setOpenedImage(src);
                setImageInfo([]);
              }}
            />
          ))}
        </div>
      ) : null}

      <Modal
        isVisible={openedImage !== ""}
        isCloseable={true}
        title="Preview"
        maxWidth="sm:max-w-lg 2xl:max-w-xl 3xl:max-w-screen-sm"
        onClose={(_) => setOpenedImage("")}
      >
        <div className="relative">
          <img
            src={openedImage}
            alt=""
            width={100}
            height={100}
            loading="lazy"
            className="w-full aspect-square object-contain pointer-events-none rounded"
          />

          {/* Image artists */}
          {imageInfo && imageInfo?.length ? (
            imageInfo?.map((info, index) => {
              return (
                <div
                  key={index}
                  className="mt-4 px-16 bg-black bg-opacity-80 backdrop-blur-sm font-semibold text-xl text-primary-500"
                >
                  <h3>
                    {info?.name} -{" "}
                    <span className="text-white">{info?.percentage}%</span>
                  </h3>
                </div>
              );
            })
          ) : (
            <Spinner
              text={"Finding the honorable artists to attribute to ..."}
            />
          )}
        </div>
      </Modal>
    </main>
  );
}
